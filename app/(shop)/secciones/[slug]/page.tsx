import { Suspense, ViewTransition } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BackLink } from "@/components/shop/BackLink";
import { CatalogControls } from "@/components/shop/CatalogControls";
import { CatalogResults } from "@/components/shop/CatalogResults";
import { PageTransition } from "@/components/shop/PageTransition";
import { SectionHeading } from "@/components/shop/SectionHeading";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";

export default async function SectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [section, sections] = await Promise.all([
    prisma.section.findUnique({ where: { slug } }),
    prisma.section.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!section) notFound();

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="space-y-3">
          <BackLink href="/products">Volver al catálogo</BackLink>
          <SectionHeading as="h1" eyebrow="Sección" title={section.name} />
        </div>

        <CatalogControls
          sections={sections.map((s) => ({ slug: s.slug, name: s.name }))}
          activeSection={slug}
        />

        <Suspense
          key={slug}
          fallback={
            <ViewTransition exit="slide-down" default="none">
              <ProductGridSkeleton />
            </ViewTransition>
          }
        >
          <ViewTransition enter="slide-up" default="none">
            <CatalogResults seccion={slug} showCount />
          </ViewTransition>
        </Suspense>
      </div>
    </PageTransition>
  );
}
