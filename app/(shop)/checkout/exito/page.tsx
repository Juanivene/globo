import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

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

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string; metodo?: string }>;
}) {
  const { orderId, metodo } = await searchParams;
  if (!orderId) notFound();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) notFound();

  const isTransfer = metodo === "transferencia" || order.paymentMethod === "TRANSFERENCIA";
  const whatsappLink = isTransfer ? buildWhatsappLink(order) : null;

  return (
    <div className="mx-auto max-w-lg space-y-6 rounded-xl bg-white p-8 text-center shadow-sm">
      <CheckCircle2 size={48} className="mx-auto text-green-600" />
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary">
          ¡Pedido recibido!
        </h1>
        <p className="mt-1 text-sm text-muted">
          Pedido #{order.id.slice(-8).toUpperCase()} — Total{" "}
          {formatCurrency(order.total.toString())}
        </p>
      </div>

      {isTransfer ? (
        <div className="space-y-3">
          <p className="text-sm text-text">
            Para confirmar tu pedido, envianos el resumen por WhatsApp. Nosotros
            te vamos a pasar los datos para la transferencia.
          </p>
          {whatsappLink && (
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="w-full">
                <MessageCircle size={18} /> Enviar por WhatsApp
              </Button>
            </a>
          )}
        </div>
      ) : (
        <p className="text-sm text-text">
          Estamos confirmando tu pago con Mercado Pago. Te vamos a avisar por
          email en cuanto se acredite.
        </p>
      )}

      <Link href="/" className="block text-sm text-glow hover:underline">
        Volver al catálogo
      </Link>
    </div>
  );
}
