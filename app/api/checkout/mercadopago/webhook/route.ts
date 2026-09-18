import { NextRequest, NextResponse } from "next/server";
import { WebhookSignatureValidator, InvalidWebhookSignatureError } from "mercadopago";
import { mpPayment } from "@/lib/mercadopago";
import { confirmDraftFromPayment } from "@/lib/checkout/confirmMercadoPagoPayment";

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const dataId = url.searchParams.get("data.id") ?? url.searchParams.get("id");
  const xSignature = req.headers.get("x-signature");
  const xRequestId = req.headers.get("x-request-id");

  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (secret) {
    try {
      WebhookSignatureValidator.validate({
        xSignature,
        xRequestId,
        dataId,
        secret,
        toleranceSeconds: 300,
      });
    } catch (err) {
      if (err instanceof InvalidWebhookSignatureError) {
        console.error("Invalid MercadoPago webhook signature", err.reason);
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
      throw err;
    }
  }

  if (!dataId) {
    return NextResponse.json({ ok: true });
  }

  let payment;
  try {
    payment = await mpPayment.get({ id: dataId });
  } catch (err) {
    console.error("Failed to fetch MercadoPago payment", err);
    return NextResponse.json({ ok: true });
  }

  try {
    await confirmDraftFromPayment(payment);
  } catch (err) {
    console.error("Failed to confirm checkout draft from webhook payment", err);
  }

  return NextResponse.json({ ok: true });
}
