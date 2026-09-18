import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";
import { ImageUploader } from "@/components/admin/ImageUploader";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, sections] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { position: "asc" } },
        sections: { select: { sectionId: true } },
      },
    }),
    prisma.section.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!product) notFound();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-primary">Editar producto</h1>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-muted">Imágenes</h2>
        <ImageUploader productId={product.id} initialImages={product.images} />
      </div>

      <ProductForm
        sections={sections}
        initial={{
          id: product.id,
          title: product.title,
          description: product.description,
          price: product.price.toString(),
          weightKg: product.weightKg.toString(),
          enabled: product.enabled,
          sectionIds: product.sections.map((s) => s.sectionId),
          freeShipping: product.freeShipping,
          freeShippingProvinces: product.freeShippingProvinces,
        }}
      />
    </div>
  );
}
