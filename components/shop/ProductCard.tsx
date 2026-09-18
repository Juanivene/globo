import { ViewTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { CardPendingHint } from "@/components/shop/CardPendingHint";

export interface ProductCardData {
  id: string;
  slug: string;
  title: string;
  price: string;
  imageUrl?: string;
}

/** Shared name for the thumbnail -> hero morph. Also used by the detail page. */
export function productImageTransitionName(slug: string) {
  return `product-image-${slug}`;
}

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
      className="stagger-rise card-globo group relative block overflow-hidden transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-(--shadow-card-hover) active:translate-y-0 active:scale-[0.99]"
    >
      <div className="relative aspect-square overflow-hidden bg-black/5">
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
              className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </ViewTransition>
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">🎁</div>
        )}

        {/* Warm scrim that deepens on hover, so the card feels lit from below. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-primary/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      </div>

      <div className="p-3">
        <h3 className="line-clamp-2 text-sm font-medium text-text">{product.title}</h3>
        <p className="mt-1 font-heading text-base font-semibold text-primary tabular-nums">
          {formatCurrency(product.price)}
        </p>
      </div>

      {/* Immediate feedback on tap while the product page loads. */}
      <CardPendingHint />
    </Link>
  );
}
