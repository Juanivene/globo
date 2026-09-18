import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CatalogControls } from "@/components/shop/CatalogControls";
import { ProductGrid } from "@/components/shop/ProductGrid";

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

  const products = await prisma.product.findMany({
    where: { enabled: true, sections: { some: { section: { slug } } } },
    orderBy: { createdAt: "desc" },
    include: { images: { orderBy: { position: "asc" }, take: 1 } },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-primary">
        {section.name}
      </h1>

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
