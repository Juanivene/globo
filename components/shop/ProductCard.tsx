import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";

export interface ProductCardData {
  id: string;
  slug: string;
  title: string;
  price: string;
  imageUrl?: string;
}

export function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <Link
      href={`/productos/${product.slug}`}
      className="group block overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-black/5">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">
            🎁
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="line-clamp-2 text-sm font-medium text-text">
          {product.title}
        </h3>
        <p className="mt-1 font-heading text-base font-semibold text-primary">
          {formatCurrency(product.price)}
        </p>
      </div>
    </Link>
  );
}
