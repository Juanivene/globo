import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { shippingQuoteSchema } from "@/lib/validations/checkout";
import { calculateShipping, totalWeightKgForItems, ShippingError } from "@/lib/shipping/calc";
import { isCartFreeShipping } from "@/lib/shipping/freeShipping";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = shippingQuoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const productIds = parsed.data.items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, enabled: true },
  });

  const items = parsed.data.items
    .map((i) => {
      const product = products.find((p) => p.id === i.productId);
      if (!product) return null;
      return { weightKg: Number(product.weightKg), quantity: i.quantity };
    })
    .filter((i): i is { weightKg: number; quantity: number } => i !== null);

  if (items.length !== parsed.data.items.length) {
    return NextResponse.json({ error: "Uno o más productos ya no están disponibles" }, { status: 400 });
  }

  const totalWeightKg = totalWeightKgForItems(items);

  try {
    const quote = await calculateShipping(parsed.data.postalCode, totalWeightKg);
    const shippingCost = isCartFreeShipping(products, quote.province) ? 0 : quote.shippingCost;
    return NextResponse.json({ ...quote, shippingCost });
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
}
