import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/shop/ProductGrid";
import type { Prisma } from "@/app/generated/prisma/client";

/**
 * The async half of the catalog. Kept separate from the page so the page shell
 * (hero, search, section chips) can stream in immediately and only the grid
 * waits on the database.
 */
export async function CatalogResults({
  q,
  seccion,
  limit,
}: {
  q?: string;
  seccion?: string;
  /** Si se indica, trae solo los N más recientes (la home muestra los últimos). */
  limit?: number;
}) {
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

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
    ...(limit ? { take: limit } : {}),
    include: { images: { orderBy: { position: "asc" }, take: 1 } },
  });

  return (
    <ProductGrid
      query={q}
      products={products.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        price: p.price.toString(),
        imageUrl: p.images[0]?.url,
      }))}
    />
  );
}
