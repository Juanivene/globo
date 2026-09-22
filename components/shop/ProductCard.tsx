import { ViewTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { CardPendingHint } from "@/components/shop/CardPendingHint";

export interface ProductCardData {
  id: string;
  slug: string;
  title: string;
  price: string;
  imageUrl?: string;
}

/** Nombre compartido para el morph miniatura -> portada. Lo usa también la ficha. */
export function productImageTransitionName(slug: string) {
  return `product-image-${slug}`;
}

/**
 * Tarjeta de producto.
 *
 * La jerarquía va foto -> precio -> título, no al revés: en una grilla lo que
 * decide si alguien entra a la ficha es cuánto sale, así que el precio se lee
 * grande, en el tipo de los títulos y con cifras de ancho fijo. El título
 * queda en dos líneas como dato de apoyo.
 */
export function ProductCard({
  product,
  index = 0,
}: {
  product: ProductCardData;
  index?: number;
}) {
  return (
    <Link
      href={`/productos/${product.slug}`}
      transitionTypes={["nav-forward"]}
      style={{ "--i": index } as React.CSSProperties}
      className="reveal-item card-globo card-lift group relative flex flex-col overflow-hidden"
    >
      <div className="relative aspect-square overflow-hidden bg-primary/5">
        {product.imageUrl ? (
          <ViewTransition
            name={productImageTransitionName(product.slug)}
            share="morph"
            default="none"
          >
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-107"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </ViewTransition>
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">🎁</div>
        )}

        {/* Velo navy que sube desde abajo al pasar por encima, para que el
            botón dorado tenga sobre qué apoyarse. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-primary/55 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        {/* Afordancia de "entrar": aparece deslizándose desde abajo. En touch no
            hay hover, y no hace falta: toda la tarjeta es el link. */}
        <span
          aria-hidden
          className="absolute bottom-3 right-3 flex h-9 w-9 translate-y-3 items-center justify-center rounded-full bg-accent text-primary opacity-0 shadow-(--shadow-accent) transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100"
        >
          <ArrowUpRight size={18} />
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3.5">
        <p className="font-heading text-lg font-bold text-primary tabular-nums">
          {formatCurrency(product.price)}
        </p>
        <h3 className="line-clamp-2 text-sm leading-snug text-muted transition-colors duration-200 group-hover:text-text">
          {product.title}
        </h3>
      </div>

      {/* Feedback inmediato al tocar, mientras carga la ficha del producto. */}
      <CardPendingHint />
    </Link>
  );
}
