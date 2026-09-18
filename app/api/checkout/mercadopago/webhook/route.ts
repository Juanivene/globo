import { NextRequest, NextResponse } from "next/server";
import { WebhookSignatureValidator, InvalidWebhookSignatureError } from "mercadopago";
import { prisma } from "@/lib/prisma";
import { mpPayment } from "@/lib/mercadopago";
import { sendOrderStatusEmail, sendNewSaleAdminEmail } from "@/lib/email";

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

  const orderId = payment.external_reference;
  if (!orderId) return NextResponse.json({ ok: true });

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return NextResponse.json({ ok: true });

  if (payment.status === "approved" && order.status === "PENDIENTE") {
    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status: "CONFIRMADO", mpPaymentId: String(payment.id) },
    });

    try {
      await Promise.all([
        sendOrderStatusEmail({
          orderId: updated.id,
          status: "CONFIRMADO",
          customerName: updated.customerName,
          customerEmail: updated.customerEmail,
          total: updated.total.toString(),
        }),
        sendNewSaleAdminEmail({
          orderId: updated.id,
          customerName: updated.customerName,
          customerEmail: updated.customerEmail,
          customerPhone: updated.customerPhone,
          total: updated.total.toString(),
        }),
      ]);
    } catch (err) {
      console.error("Failed to send order confirmation emails", err);
    }
  }

  return NextResponse.json({ ok: true });
}
