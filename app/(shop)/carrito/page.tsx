"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, ArrowRight } from "lucide-react";
import { useCartStore } from "@/lib/cart/store";
import { formatCurrency, staggerIndex } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { PageTransition } from "@/components/shop/PageTransition";

export default function CartPage() {
  return (
    <PageTransition>
      <CartContent />
    </PageTransition>
  );
}

function CartContent() {
  const items = useCartStore((s) => s.items);
  const hasHydrated = useCartStore((s) => s.hasHydrated);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  if (!hasHydrated) return <CartSkeleton />;

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="card-globo animate-rise flex flex-col items-center justify-center gap-4 py-20 text-center">
        <ShoppingBag size={40} className="text-muted/50" />
        <p className="text-muted">Tu carrito está vacío.</p>
        <Link href="/products" transitionTypes={["nav-back"]}>
          <Button className="sheen">Ver catálogo</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Link
          href="/products"
          transitionTypes={["nav-back"]}
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-primary"
        >
          <ArrowLeft
            size={16}
            className="transition-transform duration-200 group-hover:-translate-x-0.5"
          />
          Seguir mirando
        </Link>
        <h1 className="animate-rise font-heading text-2xl font-bold text-primary">
          Tu carrito
        </h1>
      </div>

      <div className="space-y-3">
        {items.map((item, i) => (
          <div
            key={item.productId}
            style={{ "--i": staggerIndex(i) } as React.CSSProperties}
            className="stagger-rise card-globo flex items-center gap-4 p-4 transition-shadow duration-300 hover:shadow-(--shadow-card-hover)"
          >
            <Link
              href={`/productos/${item.slug}`}
              transitionTypes={["nav-forward"]}
              className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-black/5"
            >
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  sizes="64px"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-2xl">🎁</div>
              )}
            </Link>

            <div className="min-w-0 flex-1">
              <Link
                href={`/productos/${item.slug}`}
                transitionTypes={["nav-forward"]}
                className="line-clamp-1 text-sm font-medium text-text hover:underline"
              >
                {item.title}
              </Link>
              <p className="text-sm text-muted tabular-nums">
                {formatCurrency(item.price)}
              </p>
            </div>

            <div className="flex items-center rounded-lg border border-border">
              <button
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                aria-label={`Quitar una unidad de ${item.title}`}
                className="cursor-pointer p-2 text-muted transition-colors hover:text-text active:scale-90"
              >
                <Minus size={14} />
              </button>
              <span className="w-6 text-center text-sm tabular-nums">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                aria-label={`Agregar una unidad de ${item.title}`}
                className="cursor-pointer p-2 text-muted transition-colors hover:text-text active:scale-90"
              >
                <Plus size={14} />
              </button>
            </div>

            <button
              onClick={() => removeItem(item.productId)}
              aria-label={`Eliminar ${item.title}`}
              className="cursor-pointer text-red-600 transition-opacity hover:opacity-70 active:scale-90"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <div
        style={{ "--i": staggerIndex(items.length) } as React.CSSProperties}
        className="stagger-rise card-globo p-5"
      >
        <div className="flex items-center justify-between font-heading text-lg font-semibold text-text">
          <span>Subtotal</span>
          <span className="tabular-nums">{formatCurrency(subtotal)}</span>
        </div>
        <p className="mt-1 text-xs text-muted">
          El costo de envío se calcula en el siguiente paso.
        </p>
        <Link href="/checkout" transitionTypes={["nav-forward"]}>
          <Button className="sheen mt-4 w-full transition-transform active:scale-[0.99]" size="lg">
            Continuar compra <ArrowRight size={18} />
          </Button>
        </Link>
      </div>
    </div>
  );
}

function CartSkeleton() {
  return (
    <div className="space-y-5" role="status" aria-label="Cargando carrito">
      <Skeleton className="h-8 w-40" />
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{ "--i": staggerIndex(i) } as React.CSSProperties}
            className="stagger-rise card-globo flex items-center gap-4 p-4"
          >
            <Skeleton className="h-16 w-16 shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3.5 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
