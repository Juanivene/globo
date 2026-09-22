import { notFound } from "next/navigation";
import Link from "next/link";
import { Plane, ShieldCheck, Truck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { BackLink } from "@/components/shop/BackLink";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { PageTransition } from "@/components/shop/PageTransition";
import { productImageTransitionName } from "@/components/shop/ProductCard";

/** Los tres datos que acompañan al botón de compra. */
const REASSURANCES = [
  { icon: Plane, label: "Importado de USA" },
  { icon: Truck, label: "Envío a todo el país" },
  { icon: ShieldCheck, label: "Compra protegida" },
];

/**
 * Ficha de producto.
 *
 * Lo que decide la compra —foto, precio y botón— va arriba y junto; en
 * pantallas grandes ese bloque queda fijo mientras se lee la descripción, que
 * bajó a su propia tarjeta debajo de la galería. Antes la descripción se metía
 * entre el precio y el botón: con un texto largo, el botón caía fuera de la
 * pantalla justo cuando la persona ya estaba decidida.
 */
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
        <BackLink href="/products">Volver al catálogo</BackLink>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-10">
          <div className="lg:col-start-1 lg:row-start-1">
            <ProductGallery
              images={product.images.map((i) => ({ id: i.id, url: i.url }))}
              title={product.title}
              transitionName={productImageTransitionName(product.slug)}
            />
          </div>

          {/* Panel de compra. En escritorio se queda pegado arriba mientras el
              resto de la página sigue scrolleando. */}
          <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <div className="card-globo space-y-5 p-5 sm:p-6 lg:sticky lg:top-24">
              {product.sections.length > 0 && (
                <div
                  style={{ "--i": 0 } as React.CSSProperties}
                  className="stagger-rise flex flex-wrap gap-2"
                >
                  {product.sections.map(({ section }) => (
                    <Link
                      key={section.id}
                      href={`/secciones/${section.slug}`}
                      transitionTypes={["nav-back"]}
                      className="rounded-full bg-primary/8 px-3 py-1 text-xs font-semibold text-primary transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-primary/15"
                    >
                      {section.name}
                    </Link>
                  ))}
                </div>
              )}

              <h1
                style={{ "--i": 1 } as React.CSSProperties}
                className="stagger-rise font-heading text-2xl font-bold leading-tight text-text sm:text-3xl"
              >
                {product.title}
              </h1>

              <div style={{ "--i": 2 } as React.CSSProperties} className="stagger-rise">
                <p className="font-heading text-4xl font-bold text-primary tabular-nums">
                  {formatCurrency(product.price.toString())}
                </p>
                <p className="mt-1 text-xs text-muted">
                  El costo de envío se calcula al finalizar la compra.
                </p>
              </div>

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
                className="stagger-rise space-y-2.5 border-t border-border pt-4"
              >
                {REASSURANCES.map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="flex items-center gap-2.5 text-sm text-muted"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-bronze">
                      <Icon size={15} />
                    </span>
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <section
            aria-labelledby="description-title"
            className="card-globo p-5 sm:p-6 lg:col-start-1 lg:row-start-2"
          >
            <h2
              id="description-title"
              className="font-heading text-lg font-semibold text-primary"
            >
              Descripción
            </h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted">
              {product.description}
            </p>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}
