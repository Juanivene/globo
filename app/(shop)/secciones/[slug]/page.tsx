import { Suspense, ViewTransition } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { CatalogControls } from "@/components/shop/CatalogControls";
import { CatalogResults } from "@/components/shop/CatalogResults";
import { PageTransition } from "@/components/shop/PageTransition";
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
        <div className="space-y-2">
          <Link
            href="/products"
            transitionTypes={["nav-back"]}
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-primary"
          >
            <ArrowLeft
              size={16}
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />
            Volver al catálogo
          </Link>
          <h1 className="animate-rise font-heading text-2xl font-bold text-primary">
            {section.name}
          </h1>
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
            <CatalogResults seccion={slug} />
          </ViewTransition>
        </Suspense>
      </div>
    </PageTransition>
  );
}
