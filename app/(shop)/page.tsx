import { prisma } from "@/lib/prisma";
import { CatalogControls } from "@/components/shop/CatalogControls";
import { ProductGrid } from "@/components/shop/ProductGrid";
import type { Prisma } from "@/app/generated/prisma/client";

export default async function ShopHomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; seccion?: string }>;
}) {
  const { q, seccion } = await searchParams;

  const where: Prisma.ProductWhereInput = { enabled: true };

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  if (seccion) {
    where.sections = { some: { section: { slug: seccion } } };
  }

  const [products, sections] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { images: { orderBy: { position: "asc" }, take: 1 } },
    }),
    prisma.section.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-primary px-6 py-8 text-center sm:py-10">
        <h1 className="font-heading text-2xl font-bold text-white sm:text-3xl">
          Productos importados, directo a tu puerta
        </h1>
        <p className="mt-2 text-sm text-white/70">
          Perfumes, gadgets y más, traídos de USA.
        </p>
      </div>

      <CatalogControls
        sections={sections.map((s) => ({ slug: s.slug, name: s.name }))}
      />

      <ProductGrid
        products={products.map((p) => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          price: p.price.toString(),
          imageUrl: p.images[0]?.url,
        }))}
      />
    </div>
  );
}
