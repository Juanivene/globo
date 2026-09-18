import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mpPreference } from "@/lib/mercadopago";
import type { CheckoutDraftPayload } from "@/lib/checkout/confirmMercadoPagoPayment";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const draftId = body?.draftId as string | undefined;
  if (!draftId) {
    return NextResponse.json({ error: "Falta draftId" }, { status: 400 });
  }

  const draft = await prisma.checkoutDraft.findUnique({ where: { id: draftId } });
  if (!draft) {
    return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
  }
  if (draft.status !== "PENDING") {
    return NextResponse.json({ error: "Este pedido ya fue procesado" }, { status: 400 });
  }

  const payload = draft.payload as unknown as CheckoutDraftPayload;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? req.nextUrl.origin;
  // Mercado Pago rejects auto_return unless every back_url is a reachable
  // HTTPS address — harmless in production, but it must be omitted for local
  // (http://localhost) testing or preference creation fails outright.
  const isHttps = baseUrl.startsWith("https://");

  try {
    const preference = await mpPreference.create({
      body: {
        items: [
          ...payload.lineItems.map((item, idx) => ({
            id: `${idx}`,
            title: item.titleSnapshot,
            quantity: item.quantity,
            unit_price: item.priceSnapshot,
            currency_id: "ARS",
          })),
          {
            id: "shipping",
            title: "Envío",
            quantity: 1,
            unit_price: payload.shippingCost,
            currency_id: "ARS",
          },
        ],
        payer: {
          name: payload.customerName,
          email: payload.customerEmail,
          phone: { number: payload.customerPhone },
        },
        external_reference: draft.id,
        back_urls: {
          success: `${baseUrl}/checkout/exito?draftId=${draft.id}`,
          pending: `${baseUrl}/checkout/exito?draftId=${draft.id}`,
          failure: `${baseUrl}/checkout/fallo?draftId=${draft.id}`,
        },
        ...(isHttps ? { auto_return: "approved" as const } : {}),
        notification_url: `${baseUrl}/api/checkout/mercadopago/webhook`,
      },
    });

    await prisma.checkoutDraft.update({
      where: { id: draft.id },
      data: { mpPreferenceId: preference.id },
    });

    return NextResponse.json({
      initPoint: preference.init_point ?? preference.sandbox_init_point,
    });
  } catch (err) {
    console.error("Failed to create Mercado Pago preference", err);
    return NextResponse.json(
      { error: "No se pudo iniciar el pago con Mercado Pago" },
      { status: 502 }
    );
  }
}
