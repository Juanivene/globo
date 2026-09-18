import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CheckoutForm } from "@/components/shop/CheckoutForm";
import { PageTransition } from "@/components/shop/PageTransition";

export default function CheckoutPage() {
  return (
    <PageTransition>
      <div className="space-y-5">
        <div className="space-y-2">
          <Link
            href="/carrito"
            transitionTypes={["nav-back"]}
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-primary"
          >
            <ArrowLeft
              size={16}
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />
            Volver al carrito
          </Link>
          <h1 className="animate-rise font-heading text-2xl font-bold text-primary">
            Checkout
          </h1>
        </div>

        <CheckoutForm />
      </div>
    </PageTransition>
  );
}
