"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/lib/cart/store";
import { formatCurrency, staggerIndex } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { BackLink } from "@/components/shop/BackLink";
import { PageTransition } from "@/components/shop/PageTransition";
import { SectionHeading } from "@/components/shop/SectionHeading";

export default function CartPage() {
  return (
    <PageTransition>
      <CartContent />
    </PageTransition>
  );
}

/**
 * Carrito.
 *
 * En escritorio la lista y el resumen van en dos columnas, con el resumen
 * fijo: el subtotal y el botón de seguir quedan siempre a la vista, aunque el
 * carrito tenga quince productos. Antes el resumen vivía al final de la lista
 * y con el carrito cargado había que scrollear hasta abajo para encontrarlo.
 */
function CartContent() {
  const items = useCartStore((s) => s.items);
  const hasHydrated = useCartStore((s) => s.hasHydrated);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  if (!hasHydrated) return <CartSkeleton />;

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="card-globo animate-rise mx-auto flex max-w-md flex-col items-center justify-center gap-4 px-6 py-16 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/5 text-muted">
          <ShoppingBag size={30} />
        </span>
        <div>
          <p className="font-heading text-lg font-semibold text-primary">
            Tu carrito está vacío
          </p>
          <p className="mt-1 text-sm text-muted">
            Cuando agregues algo, lo vas a ver acá.
          </p>
        </div>
        <Link href="/products" transitionTypes={["nav-back"]}>
          <Button className="sheen" size="lg">
            Ver catálogo <ArrowRight size={18} />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <BackLink href="/products">Seguir mirando</BackLink>
        <SectionHeading
          as="h1"
          eyebrow={count === 1 ? "1 producto" : `${count} productos`}
          title="Tu carrito"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <ul className="space-y-3">
          {items.map((item, i) => (
            <li
              key={item.productId}
              style={{ "--i": staggerIndex(i) } as React.CSSProperties}
              className="stagger-rise card-globo flex flex-wrap items-center gap-x-4 gap-y-3 p-3.5 sm:flex-nowrap sm:p-4"
            >
              <Link
                href={`/productos/${item.slug}`}
                transitionTypes={["nav-forward"]}
                className="group relative h-18 w-18 shrink-0 overflow-hidden rounded-xl bg-primary/5"
              >
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-107"
                    sizes="72px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-2xl">🎁</div>
                )}
              </Link>

              <div className="min-w-0 flex-1">
                <Link
                  href={`/productos/${item.slug}`}
                  transitionTypes={["nav-forward"]}
                  className="line-clamp-2 text-sm font-medium text-text transition-colors hover:text-link"
                >
                  {item.title}
                </Link>
                <p className="mt-0.5 text-xs text-muted tabular-nums">
                  {formatCurrency(item.price)} c/u
                </p>
              </div>

              <div className="flex items-center rounded-xl border border-border bg-surface-light">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  aria-label={`Quitar una unidad de ${item.title}`}
                  className="cursor-pointer rounded-l-xl p-2 text-muted transition-[color,background-color,transform] duration-150 hover:bg-primary/6 hover:text-text active:scale-90"
                >
                  <Minus size={14} />
                </button>
                <span className="w-7 text-center text-sm font-semibold tabular-nums">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  aria-label={`Agregar una unidad de ${item.title}`}
                  className="cursor-pointer rounded-r-xl p-2 text-muted transition-[color,background-color,transform] duration-150 hover:bg-primary/6 hover:text-text active:scale-90"
                >
                  <Plus size={14} />
                </button>
              </div>

              <p
                key={item.quantity}
                className="animate-fade-in w-24 shrink-0 text-right font-heading text-base font-bold text-primary tabular-nums"
              >
                {formatCurrency(item.price * item.quantity)}
              </p>

              <button
                onClick={() => removeItem(item.productId)}
                aria-label={`Eliminar ${item.title}`}
                className="cursor-pointer rounded-full p-2 text-muted transition-[color,background-color,transform] duration-150 hover:bg-red-50 hover:text-red-600 active:scale-90"
              >
                <Trash2 size={17} />
              </button>
            </li>
          ))}
        </ul>

        <div
          style={{ "--i": staggerIndex(items.length) } as React.CSSProperties}
          className="stagger-rise card-globo space-y-4 p-5 lg:sticky lg:top-24"
        >
          <h2 className="font-heading text-lg font-bold text-primary">Resumen</h2>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between text-muted">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-muted">
              <span>Envío</span>
              <span>Se calcula en el checkout</span>
            </div>
          </div>

          <div className="flex items-baseline justify-between border-t border-border pt-4">
            <span className="font-heading text-base font-semibold text-text">Total</span>
            <span
              key={subtotal}
              className="animate-fade-in font-heading text-2xl font-bold text-primary tabular-nums"
            >
              {formatCurrency(subtotal)}
            </span>
          </div>

          <Link href="/checkout" transitionTypes={["nav-forward"]} className="block">
            <Button
              className="sheen w-full transition-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
              size="lg"
            >
              Continuar compra <ArrowRight size={18} />
            </Button>
          </Link>
          <p className="text-center text-xs text-muted">
            No se te cobra nada hasta confirmar el pago.
          </p>
        </div>
      </div>
    </div>
  );
}

function CartSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Cargando carrito">
      <Skeleton className="h-9 w-40" />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{ "--i": staggerIndex(i) } as React.CSSProperties}
              className="stagger-rise card-globo flex items-center gap-4 p-4"
            >
              <Skeleton className="h-18 w-18 shrink-0 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3.5 w-1/4" />
              </div>
            </div>
          ))}
        </div>
        <div
          style={{ "--i": 3 } as React.CSSProperties}
          className="stagger-rise card-globo space-y-3 p-5"
        >
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
