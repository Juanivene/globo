import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock, MessageCircle, Package } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { mpPayment } from "@/lib/mercadopago";
import { confirmDraftFromPayment } from "@/lib/checkout/confirmMercadoPagoPayment";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { OutcomeCard } from "@/components/shop/OutcomeCard";
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
        <OutcomeCard
          tone="pending"
          icon={Clock}
          title="Estamos confirmando tu pago"
          subtitle="En cuanto Mercado Pago nos confirme la acreditación te vamos a avisar por email. No hace falta que hagas nada más."
        >
          <BackToCatalog />
        </OutcomeCard>
      </PageTransition>
    );
  }

  const isTransfer =
    metodo === "transferencia" || order.paymentMethod === "TRANSFERENCIA";
  const whatsappLink = isTransfer ? buildWhatsappLink(order) : null;

  return (
    <PageTransition>
      {!isTransfer && <ClearCartOnMount />}

      <OutcomeCard
        tone="success"
        icon={CheckCircle2}
        title={isTransfer ? "¡Pedido recibido!" : "¡Gracias por tu compra!"}
        subtitle={
          <>
            Pedido #{order.id.slice(-8).toUpperCase()} — Total{" "}
            <strong className="font-semibold text-text tabular-nums">
              {formatCurrency(order.total.toString())}
            </strong>
          </>
        }
      >
        <ul
          style={{ "--i": 2 } as React.CSSProperties}
          className="stagger-rise space-y-2 rounded-xl bg-primary/4 p-4 text-left text-sm"
        >
          {order.items.map((item) => (
            <li key={item.id} className="flex items-start gap-2.5 text-muted">
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
                    className="sheen w-full transition-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                  >
                    <MessageCircle size={18} /> Enviar por WhatsApp
                  </Button>
                </a>
              )}
            </div>
          ) : (
            <p className="text-sm text-text">
              Ya confirmamos tu pago con Mercado Pago. En breve te va a llegar un
              email a <strong className="font-medium">{order.customerEmail}</strong> con
              el resumen de tu pedido, y te vamos a avisar por ahí cuando lo
              despachemos.
            </p>
          )}
        </div>

        <BackToCatalog index={4} />
      </OutcomeCard>
    </PageTransition>
  );
}

function BackToCatalog({ index = 2 }: { index?: number }) {
  return (
    <Link
      href="/products"
      transitionTypes={["nav-back"]}
      style={{ "--i": index } as React.CSSProperties}
      className="stagger-rise block text-sm font-medium text-link transition-colors hover:text-primary hover:underline"
    >
      Volver al catálogo
    </Link>
  );
}
