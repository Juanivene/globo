import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { AddToCartButton } from "@/components/shop/AddToCartButton";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { position: "asc" } },
      sections: { include: { section: true } },
    },
  });

  if (!product || !product.enabled) notFound();

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div className="space-y-3">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-white shadow-sm">
          {product.images[0] ? (
            <Image
              src={product.images[0].url}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-6xl">
              🎁
            </div>
          )}
        </div>
        {product.images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {product.images.slice(1).map((img) => (
              <div
                key={img.id}
                className="relative aspect-square overflow-hidden rounded-lg bg-white shadow-sm"
              >
                <Image src={img.url} alt="" fill className="object-cover" sizes="100px" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        {product.sections.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {product.sections.map(({ section }) => (
              <Link
                key={section.id}
                href={`/secciones/${section.slug}`}
                className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary/20"
              >
                {section.name}
              </Link>
            ))}
          </div>
        )}
        <h1 className="font-heading text-2xl font-bold text-text sm:text-3xl">
          {product.title}
        </h1>
        <p className="font-heading text-3xl font-bold text-primary">
          {formatCurrency(product.price.toString())}
        </p>
        <p className="whitespace-pre-line text-sm leading-relaxed text-muted">
          {product.description}
        </p>

        <AddToCartButton
          product={{
            id: product.id,
            slug: product.slug,
            title: product.title,
            price: Number(product.price),
            weightKg: Number(product.weightKg),
            imageUrl: product.images[0]?.url,
          }}
        />
      </div>
    </div>
  );
}
