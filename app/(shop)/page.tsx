import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CatalogResults } from "@/components/shop/CatalogResults";
import { PageTransition } from "@/components/shop/PageTransition";
import { SectionHeading } from "@/components/shop/SectionHeading";
import { ShopHero } from "@/components/shop/ShopHero";
import { ShippingBand } from "@/components/shop/ShippingBand";
import { TrustBar } from "@/components/shop/TrustBar";
import { WhatsAppBand } from "@/components/shop/WhatsAppBand";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { latest } from "@/lib/content/site";

/**
 * Dinámica a propósito: muestra los últimos productos cargados. Sin esto Next la
 * prerenderiza en el build y un producto nuevo del admin no aparecería.
 */
export const dynamic = "force-dynamic";

/** Cuántos productos recientes se muestran en la portada. */
const LATEST_COUNT = 8;

/**
 * Home: una presentación corta. Portada, los tres datos de confianza, los
 * últimos productos cargados (con salida a `/products` para ver todo), cómo
 * funciona y contacto.
 *
 * El orden responde a las preguntas en el orden en que aparecen: qué es esto,
 * puedo confiar, qué venden, cómo llega, cómo les escribo. El buscador y el
 * filtro por sección viven en `/products`.
 */
export default function ShopHomePage() {
  return (
    <PageTransition>
      <div className="space-y-12 sm:space-y-16">
        <ShopHero />

        <TrustBar />

        <section aria-labelledby="latest-title" className="space-y-5">
          <SectionHeading
            id="latest-title"
            eyebrow={latest.eyebrow}
            title={latest.title}
            action={
              <Link
                href="/products"
                transitionTypes={["nav-forward"]}
                className="group inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-link hover:underline"
              >
                {latest.cta}
                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>
            }
          />

          <Suspense fallback={<ProductGridSkeleton count={LATEST_COUNT} />}>
            <CatalogResults limit={LATEST_COUNT} />
          </Suspense>

          <div className="reveal flex justify-center pt-2">
            <Link
              href="/products"
              transitionTypes={["nav-forward"]}
              className="sheen group inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-text-invert transition-[background-color,box-shadow,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-primary-light hover:shadow-(--shadow-card-hover) active:translate-y-0 active:scale-[0.98]"
            >
              {latest.ctaLong}
              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </section>

        <ShippingBand />

        <WhatsAppBand />
      </div>
    </PageTransition>
  );
}
