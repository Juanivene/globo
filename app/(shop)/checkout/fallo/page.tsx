import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
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
      <div className="mx-auto max-w-lg">
        <div className="card-globo relative overflow-hidden p-8 text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-red-500/10 to-transparent"
          />

          <div className="relative space-y-6">
            <span
              style={{ "--i": 0 } as React.CSSProperties}
              className="stagger-rise relative mx-auto flex h-16 w-16 items-center justify-center"
            >
              <span className="absolute inset-0 rounded-full bg-red-500/10" />
              <XCircle size={44} className="text-red-600" />
            </span>

            <div style={{ "--i": 1 } as React.CSSProperties} className="stagger-rise">
              <h1 className="font-heading text-2xl font-bold text-primary">
                El pago no se pudo completar
              </h1>
              <p className="mt-1 text-sm text-muted">
                No te preocupes, no se realizó ningún cargo. Podés intentar de nuevo.
              </p>
            </div>

            <div
              style={{ "--i": 2 } as React.CSSProperties}
              className="stagger-rise space-y-3"
            >
              <Link href="/checkout" transitionTypes={["nav-forward"]}>
                <Button
                  size="lg"
                  className="sheen w-full transition-transform active:scale-[0.98]"
                >
                  Volver a intentar
                </Button>
              </Link>
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
      </div>
    </PageTransition>
  );
}
