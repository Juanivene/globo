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
  showCount = false,
}: {
  q?: string;
  seccion?: string;
  /** Si se indica, trae solo los N más recientes (la home muestra los últimos). */
  limit?: number;
  /**
   * Muestra cuántos productos quedaron. Solo en el catálogo y en las secciones,
   * donde el usuario filtró y quiere saber qué efecto tuvo; en la home la línea
   * sería ruido, porque ahí el recorte lo puso la página, no él.
   */
  showCount?: boolean;
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
    <div className="space-y-4">
      {showCount && products.length > 0 && (
        <p aria-live="polite" className="text-sm text-muted">
          {products.length === 1
            ? "1 producto"
            : `${products.length} productos`}
          {q && (
            <>
              {" "}
              para <span className="font-medium text-text">“{q}”</span>
            </>
          )}
        </p>
      )}

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
    </div>
  );
}
