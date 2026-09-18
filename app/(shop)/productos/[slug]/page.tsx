import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plane, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { PageTransition } from "@/components/shop/PageTransition";
import { productImageTransitionName } from "@/components/shop/ProductCard";

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
    <PageTransition>
      <div className="space-y-5">
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

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <ProductGallery
            images={product.images.map((i) => ({ id: i.id, url: i.url }))}
            title={product.title}
            transitionName={productImageTransitionName(product.slug)}
          />

          <div className="space-y-4">
            {product.sections.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.sections.map(({ section }) => (
                  <Link
                    key={section.id}
                    href={`/secciones/${section.slug}`}
                    transitionTypes={["nav-back"]}
                    className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
                  >
                    {section.name}
                  </Link>
                ))}
              </div>
            )}

            <h1
              style={{ "--i": 0 } as React.CSSProperties}
              className="stagger-rise font-heading text-2xl font-bold text-text sm:text-3xl"
            >
              {product.title}
            </h1>

            <p
              style={{ "--i": 1 } as React.CSSProperties}
              className="stagger-rise font-heading text-3xl font-bold text-primary tabular-nums"
            >
              {formatCurrency(product.price.toString())}
            </p>

            <p
              style={{ "--i": 2 } as React.CSSProperties}
              className="stagger-rise whitespace-pre-line text-sm leading-relaxed text-muted"
            >
              {product.description}
            </p>

            <div style={{ "--i": 3 } as React.CSSProperties} className="stagger-rise">
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

            <ul
              style={{ "--i": 4 } as React.CSSProperties}
              className="stagger-rise flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-4 text-xs text-muted"
            >
              <li className="flex items-center gap-1.5">
                <Plane size={14} className="text-bronze" /> Importado de USA
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-bronze" /> Compra protegida
              </li>
            </ul>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
