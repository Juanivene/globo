import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mpPreference } from "@/lib/mercadopago";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const orderId = body?.orderId as string | undefined;
  if (!orderId) {
    return NextResponse.json({ error: "Falta orderId" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) {
    return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
  }
  if (order.paymentMethod !== "MERCADO_PAGO") {
    return NextResponse.json({ error: "El pedido no usa Mercado Pago" }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? req.nextUrl.origin;

  const preference = await mpPreference.create({
    body: {
      items: [
        ...order.items.map((item) => ({
          id: item.id,
          title: item.titleSnapshot,
          quantity: item.quantity,
          unit_price: Number(item.priceSnapshot),
          currency_id: "ARS",
        })),
        {
          id: "shipping",
          title: "Envío",
          quantity: 1,
          unit_price: Number(order.shippingCost),
          currency_id: "ARS",
        },
      ],
      payer: {
        name: order.customerName,
        email: order.customerEmail,
        phone: { number: order.customerPhone },
      },
      external_reference: order.id,
      back_urls: {
        success: `${baseUrl}/checkout/exito?orderId=${order.id}`,
        pending: `${baseUrl}/checkout/exito?orderId=${order.id}`,
        failure: `${baseUrl}/checkout/fallo?orderId=${order.id}`,
      },
      auto_return: "approved",
      notification_url: `${baseUrl}/api/checkout/mercadopago/webhook`,
    },
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { mpPreferenceId: preference.id },
  });

  return NextResponse.json({
    initPoint: preference.init_point ?? preference.sandbox_init_point,
  });
}
