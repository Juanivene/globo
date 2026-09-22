import type { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";
import { prisma } from "@/lib/prisma";
import { sendOrderStatusEmail, sendNewSaleAdminEmail } from "@/lib/email";
import type { ArgentinaProvince } from "@/app/generated/prisma/enums";
import type { Order } from "@/app/generated/prisma/client";

export interface CheckoutDraftLineItem {
  productId: string;
  titleSnapshot: string;
  priceSnapshot: number;
  quantity: number;
  weightKgSnapshot: number;
}

export interface CheckoutDraftPayload {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  postalCode: string;
  province: ArgentinaProvince;
  itemsSubtotal: number;
  shippingCost: number;
  total: number;
  lineItems: CheckoutDraftLineItem[];
}

/**
 * Confirms (or rejects) a MERCADO_PAGO checkout draft from a MercadoPago
 * payment. Called from the webhook (primary path) and, as a fallback, from
 * the success page (covers local dev without a public webhook URL, and
 * webhook delivery delays). Idempotent: safe to call twice for the same
 * payment/draft.
 */
export async function confirmDraftFromPayment(
  payment: PaymentResponse
): Promise<Order | null> {
  const draftId = payment.external_reference;
  if (!draftId) return null;

  const draft = await prisma.checkoutDraft.findUnique({ where: { id: draftId } });
  if (!draft) return null;

  if (draft.status === "CONFIRMED") {
    return draft.orderId
      ? prisma.order.findUnique({ where: { id: draft.orderId } })
      : null;
  }

  if (payment.status !== "approved") {
    // Solo un rechazo/cancelación es definitivo. "pending", "in_process" o
    // "authorized" (revisión manual de la tarjeta) pueden terminar aprobándose
    // más tarde, así que el draft se deja PENDING para el próximo webhook.
    const isFinalFailure =
      payment.status === "rejected" ||
      payment.status === "cancelled" ||
      payment.status === "refunded" ||
      payment.status === "charged_back";
    if (isFinalFailure && draft.status === "PENDING") {
      await prisma.checkoutDraft.update({
        where: { id: draft.id },
        data: { status: "FAILED" },
      });
    }
    return null;
  }

  const expectedTotal = Number((draft.payload as unknown as CheckoutDraftPayload).total);
  if (Math.abs(Number(payment.transaction_amount) - expectedTotal) > 0.01) {
    console.error(
      `MercadoPago payment ${payment.id} amount ${payment.transaction_amount} does not match draft ${draft.id} total ${expectedTotal}`
    );
    return null;
  }

  // Conditional update guards against a concurrent call (webhook + success
  // page fallback racing) creating the order twice. FAILED también se puede
  // reclamar: el usuario puede reintentar con otra tarjeta sobre la misma
  // preferencia después de un rechazo, y ese pago aprobado debe generar pedido.
  const claimed = await prisma.checkoutDraft.updateMany({
    where: { id: draft.id, status: { in: ["PENDING", "FAILED"] } },
    data: { status: "CONFIRMED" },
  });

  if (claimed.count === 0) {
    // Someone else just confirmed it — re-fetch and return that result.
    const fresh = await prisma.checkoutDraft.findUnique({ where: { id: draft.id } });
    return fresh?.orderId
      ? prisma.order.findUnique({ where: { id: fresh.orderId } })
      : null;
  }

  const payload = draft.payload as unknown as CheckoutDraftPayload;

  // Un producto puede haberse borrado entre el checkout y la confirmación
  // del pago (que puede tardar minutos). El pedido igual se crea con el
  // snapshot guardado — solo se limpia la referencia al producto inexistente
  // en vez de romper la creación por una violación de foreign key.
  const productIds = [...new Set(payload.lineItems.map((i) => i.productId))];
  const existingProducts = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true },
  });
  const existingProductIds = new Set(existingProducts.map((p) => p.id));

  const order = await prisma.order.create({
    data: {
      customerName: payload.customerName,
      customerEmail: payload.customerEmail,
      customerPhone: payload.customerPhone,
      address: payload.address,
      postalCode: payload.postalCode,
      province: payload.province,
      paymentMethod: "MERCADO_PAGO",
      shippingCost: payload.shippingCost,
      itemsSubtotal: payload.itemsSubtotal,
      total: payload.total,
      status: "CONFIRMADO",
      mpPreferenceId: draft.mpPreferenceId,
      mpPaymentId: String(payment.id),
      items: {
        create: payload.lineItems.map((item) => ({
          productId: existingProductIds.has(item.productId) ? item.productId : null,
          titleSnapshot: item.titleSnapshot,
          priceSnapshot: item.priceSnapshot,
          quantity: item.quantity,
          weightKgSnapshot: item.weightKgSnapshot,
        })),
      },
    },
  });

  await prisma.checkoutDraft.update({
    where: { id: draft.id },
    data: { orderId: order.id },
  });

  try {
    await Promise.all([
      sendOrderStatusEmail({
        orderId: order.id,
        status: "CONFIRMADO",
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        total: order.total.toString(),
      }),
      sendNewSaleAdminEmail({
        orderId: order.id,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        total: order.total.toString(),
      }),
    ]);
  } catch (err) {
    console.error("Failed to send order confirmation emails", err);
  }

  return order;
}
