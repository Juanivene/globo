import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validations/checkout";
import { calculateShipping, totalWeightKgForItems, ShippingError } from "@/lib/shipping/calc";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { items: cartItems, ...customer } = parsed.data;

  const productIds = cartItems.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, enabled: true },
  });

  if (products.length !== cartItems.length) {
    return NextResponse.json(
      { error: "Uno o más productos ya no están disponibles" },
      { status: 400 }
    );
  }

  const lineItems = cartItems.map((ci) => {
    const product = products.find((p) => p.id === ci.productId)!;
    return {
      productId: product.id,
      titleSnapshot: product.title,
      priceSnapshot: product.price,
      quantity: ci.quantity,
      weightKgSnapshot: product.weightKg,
    };
  });

  const totalWeightKg = totalWeightKgForItems(
    lineItems.map((i) => ({ weightKg: Number(i.weightKgSnapshot), quantity: i.quantity }))
  );

  let quote;
  try {
    quote = await calculateShipping(customer.postalCode, totalWeightKg);
  } catch (err) {
    if (err instanceof ShippingError) {
      const messages = {
        CP_NOT_RECOGNIZED: "No reconocemos ese código postal",
        PROVINCE_NOT_CONFIGURED: "Todavía no configuramos el envío para esa provincia",
      };
      return NextResponse.json({ error: messages[err.code] }, { status: 400 });
    }
    throw err;
  }

  const itemsSubtotal = lineItems.reduce(
    (sum, i) => sum + Number(i.priceSnapshot) * i.quantity,
    0
  );
  const total = itemsSubtotal + quote.shippingCost;

  const order = await prisma.order.create({
    data: {
      customerName: customer.customerName,
      customerEmail: customer.customerEmail,
      customerPhone: customer.customerPhone,
      address: customer.address,
      postalCode: customer.postalCode,
      province: quote.province,
      paymentMethod: customer.paymentMethod,
      shippingCost: quote.shippingCost,
      itemsSubtotal,
      total,
      status: "PENDIENTE",
      items: { create: lineItems },
    },
  });

  return NextResponse.json({
    orderId: order.id,
    total: total.toString(),
    paymentMethod: order.paymentMethod,
  });
}
