import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CatalogResults } from "@/components/shop/CatalogResults";
import { PageTransition } from "@/components/shop/PageTransition";
import { ShopHero } from "@/components/shop/ShopHero";
import { ShippingBand } from "@/components/shop/ShippingBand";
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
 * Home: una presentación corta. Portada, los últimos productos cargados (con
 * salida a `/products` para ver todo), cómo funciona y contacto.
 * El buscador y el filtro por sección viven en `/products`.
 */
export default function ShopHomePage() {
  return (
    <PageTransition>
      <div className="space-y-10 sm:space-y-12">
        <ShopHero />

        <section aria-labelledby="latest-title" className="space-y-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-bronze">
                {latest.eyebrow}
              </p>
              <h2
                id="latest-title"
                className="font-heading text-2xl font-bold text-primary"
              >
                {latest.title}
              </h2>
            </div>
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
          </div>

          <Suspense fallback={<ProductGridSkeleton count={LATEST_COUNT} />}>
            <CatalogResults limit={LATEST_COUNT} />
          </Suspense>

          <div className="flex justify-center pt-1">
            <Link
              href="/products"
              transitionTypes={["nav-forward"]}
              className="sheen inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-text-invert transition-[background-color,transform] duration-200 hover:bg-primary-light active:scale-[0.98]"
            >
              {latest.ctaLong} <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        <ShippingBand />

        <WhatsAppBand />
      </div>
    </PageTransition>
  );
}
