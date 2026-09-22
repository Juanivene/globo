import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { OutcomeCard } from "@/components/shop/OutcomeCard";
import { PageTransition } from "@/components/shop/PageTransition";
import { prisma } from "@/lib/prisma";
import { mpPayment } from "@/lib/mercadopago";
import { confirmDraftFromPayment } from "@/lib/checkout/confirmMercadoPagoPayment";

export default async function CheckoutFailurePage({
  searchParams,
}: {
  searchParams: Promise<{ draftId?: string; payment_id?: string; collection_id?: string }>;
}) {
  const { draftId, payment_id, collection_id } = await searchParams;

  // No bloquea el render de la página de error: solo deja trazabilidad de
  // que el intento de pago falló, marcando el draft como FAILED.
  if (draftId) {
    try {
      const draft = await prisma.checkoutDraft.findUnique({ where: { id: draftId } });
      const paymentId = payment_id ?? collection_id;
      if (draft?.status === "PENDING" && paymentId) {
        const payment = await mpPayment.get({ id: paymentId });
        await confirmDraftFromPayment(payment);
      }
    } catch (err) {
      console.error("Failed to reconcile checkout draft on failure page", err);
    }
  }

  return (
    <PageTransition>
      <OutcomeCard
        tone="error"
        icon={XCircle}
        title="El pago no se pudo completar"
        subtitle="No te preocupes, no se realizó ningún cargo. Podés intentar de nuevo."
      >
        <div style={{ "--i": 2 } as React.CSSProperties} className="stagger-rise space-y-3">
          <Link href="/checkout" transitionTypes={["nav-forward"]} className="block">
            <Button
              size="lg"
              className="sheen w-full transition-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            >
              Volver a intentar
            </Button>
          </Link>
          <Link
            href="/products"
            transitionTypes={["nav-back"]}
            className="block text-sm font-medium text-link transition-colors hover:text-primary hover:underline"
          >
            Volver al catálogo
          </Link>
        </div>
      </OutcomeCard>
    </PageTransition>
  );
}
