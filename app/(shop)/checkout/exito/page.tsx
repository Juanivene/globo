import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock, MessageCircle, Package } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { mpPayment } from "@/lib/mercadopago";
import { confirmDraftFromPayment } from "@/lib/checkout/confirmMercadoPagoPayment";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { PageTransition } from "@/components/shop/PageTransition";
import { ClearCartOnMount } from "@/components/shop/ClearCartOnMount";
import type { Order, OrderItem } from "@/app/generated/prisma/client";

function buildWhatsappLink(order: {
  id: string;
  customerName: string;
  items: { titleSnapshot: string; quantity: number }[];
  total: unknown;
}) {
  const adminNumber = process.env.ADMIN_WHATSAPP_NUMBER?.replace(/\D/g, "");
  if (!adminNumber) return null;

  const itemsText = order.items
    .map((i) => `- ${i.titleSnapshot} x${i.quantity}`)
    .join("\n");

  const message = [
    `Hola! Soy ${order.customerName}.`,
    `Quiero coordinar el pago por transferencia de mi pedido #${order.id.slice(-8).toUpperCase()}:`,
    itemsText,
    `Total: ${formatCurrency(String(order.total))}`,
  ].join("\n");

  return `https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`;
}

type OrderWithItems = Order & { items: OrderItem[] };

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{
    orderId?: string;
    draftId?: string;
    metodo?: string;
    payment_id?: string;
    collection_id?: string;
  }>;
}) {
  const { orderId, draftId, metodo, payment_id, collection_id } = await searchParams;
  if (!orderId && !draftId) notFound();

  let order: OrderWithItems | null = null;

  if (orderId) {
    order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
    if (!order) notFound();
  } else if (draftId) {
    const draft = await prisma.checkoutDraft.findUnique({ where: { id: draftId } });
    if (!draft) notFound();

    if (draft.status === "CONFIRMED" && draft.orderId) {
      order = await prisma.order.findUnique({
        where: { id: draft.orderId },
        include: { items: true },
      });
    } else if (draft.status === "PENDING") {
      // El webhook todavía no llegó (demora, o no hay URL pública en local).
      // Respaldo: preguntarle directo a MP por el pago usando el id que
      // agrega a la URL de retorno, e intentar confirmar el pedido acá mismo.
      const paymentId = payment_id ?? collection_id;
      if (paymentId) {
        try {
          const payment = await mpPayment.get({ id: paymentId });
          const confirmed = await confirmDraftFromPayment(payment);
          if (confirmed) {
            order = await prisma.order.findUnique({
              where: { id: confirmed.id },
              include: { items: true },
            });
          }
        } catch (err) {
          console.error("Failed to verify MercadoPago payment on success page", err);
        }
      }
    }
  }

  if (!order) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-lg">
          <div className="card-globo relative overflow-hidden p-8 text-center">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-accent/10 to-transparent"
            />
            <div className="relative space-y-6">
              <span className="relative mx-auto flex h-16 w-16 items-center justify-center">
                <span className="absolute inset-0 rounded-full bg-accent/10" />
                <Clock size={40} className="text-bronze" />
              </span>
              <div>
                <h1 className="font-heading text-2xl font-bold text-primary">
                  Estamos confirmando tu pago
                </h1>
                <p className="mt-1 text-sm text-muted">
                  En cuanto Mercado Pago nos confirme la acreditación te vamos a
                  avisar por email. No hace falta que hagas nada más.
                </p>
              </div>
              <Link
                href="/products"
                transitionTypes={["nav-back"]}
                className="block text-sm text-link transition-colors hover:text-primary hover:underline"
              >
                Volver al catálogo
              </Link>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  const isTransfer =
    metodo === "transferencia" || order.paymentMethod === "TRANSFERENCIA";
  const whatsappLink = isTransfer ? buildWhatsappLink(order) : null;

  return (
    <PageTransition>
      {!isTransfer && <ClearCartOnMount />}
      <div className="mx-auto max-w-lg">
        <div className="card-globo relative overflow-hidden p-8 text-center">
          {/* Soft green wash behind the confirmation mark. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-green-500/10 to-transparent"
          />

          <div className="relative space-y-6">
            <span
              style={{ "--i": 0 } as React.CSSProperties}
              className="stagger-rise relative mx-auto flex h-16 w-16 items-center justify-center"
            >
              <span className="absolute inset-0 rounded-full bg-green-500/10" />
              <CheckCircle2 size={44} className="animate-check-pop text-green-600" />
            </span>

            <div style={{ "--i": 1 } as React.CSSProperties} className="stagger-rise">
              <h1 className="font-heading text-2xl font-bold text-primary">
                ¡Pedido recibido!
              </h1>
              <p className="mt-1 text-sm text-muted">
                Pedido #{order.id.slice(-8).toUpperCase()} — Total{" "}
                <strong className="font-semibold text-text tabular-nums">
                  {formatCurrency(order.total.toString())}
                </strong>
              </p>
            </div>

            <ul
              style={{ "--i": 2 } as React.CSSProperties}
              className="stagger-rise space-y-1.5 rounded-xl bg-black/3 p-4 text-left text-sm"
            >
              {order.items.map((item) => (
                <li key={item.id} className="flex items-start gap-2 text-muted">
                  <Package size={15} className="mt-0.5 shrink-0 text-bronze" />
                  <span className="flex-1">
                    {item.titleSnapshot} × {item.quantity}
                  </span>
                </li>
              ))}
            </ul>

            <div style={{ "--i": 3 } as React.CSSProperties} className="stagger-rise">
              {isTransfer ? (
                <div className="space-y-3">
                  <p className="text-sm text-text">
                    Para confirmar tu pedido, envianos el resumen por WhatsApp.
                    Nosotros te vamos a pasar los datos para la transferencia.
                  </p>
                  {whatsappLink && (
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                      <Button
                        size="lg"
                        className="sheen w-full transition-transform active:scale-[0.98]"
                      >
                        <MessageCircle size={18} /> Enviar por WhatsApp
                      </Button>
                    </a>
                  )}
                </div>
              ) : (
                <p className="text-sm text-text">
                  Ya confirmamos tu pago con Mercado Pago. Te vamos a avisar por
                  email cuando despachemos tu pedido.
                </p>
              )}
            </div>

            <Link
              href="/products"
              transitionTypes={["nav-back"]}
              style={{ "--i": 4 } as React.CSSProperties}
              className="stagger-rise block text-sm text-link transition-colors hover:text-primary hover:underline"
            >
              Volver al catálogo
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
