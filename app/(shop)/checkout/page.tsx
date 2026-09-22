import { CheckoutForm } from "@/components/shop/CheckoutForm";
import { BackLink } from "@/components/shop/BackLink";
import { PageTransition } from "@/components/shop/PageTransition";
import { SectionHeading } from "@/components/shop/SectionHeading";

export default function CheckoutPage() {
  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="space-y-3">
          <BackLink href="/carrito">Volver al carrito</BackLink>
          <SectionHeading
            as="h1"
            eyebrow="Último paso"
            title="Finalizar compra"
          />
        </div>

        <CheckoutForm />
      </div>
    </PageTransition>
  );
}
