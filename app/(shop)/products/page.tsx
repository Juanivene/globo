import type { Metadata } from "next";
import { Suspense, ViewTransition } from "react";
import { prisma } from "@/lib/prisma";
import { CatalogControls } from "@/components/shop/CatalogControls";
import { CatalogResults } from "@/components/shop/CatalogResults";
import { PageTransition } from "@/components/shop/PageTransition";
import { WhatsAppBand } from "@/components/shop/WhatsAppBand";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = {
  title: "Productos | Globo Arg",
  description: "Todos los productos importados de USA que tenemos disponibles.",
};

/** Catálogo completo: todos los productos, con buscador y filtro por sección. */
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; seccion?: string }>;
}) {
  const { q, seccion } = await searchParams;

  const sections = await prisma.section.findMany({ orderBy: { name: "asc" } });

  return (
    <PageTransition>
      <div className="space-y-6">
        <h1 className="animate-rise font-heading text-2xl font-bold text-primary sm:text-3xl">
          Productos
        </h1>

        <CatalogControls
          sections={sections.map((s) => ({ slug: s.slug, name: s.name }))}
        />

        {/*
          Con `key` en los filtros, cambiarlos vuelve a suspender: la grilla
          pasa por el skeleton en vez de saltar de un resultado al otro.
        */}
        <Suspense
          key={`${q ?? ""}|${seccion ?? ""}`}
          fallback={
            <ViewTransition exit="slide-down" default="none">
              <ProductGridSkeleton />
            </ViewTransition>
          }
        >
          <ViewTransition enter="slide-up" default="none">
            <CatalogResults q={q} seccion={seccion} />
          </ViewTransition>
        </Suspense>

        <WhatsAppBand />
      </div>
    </PageTransition>
  );
}
