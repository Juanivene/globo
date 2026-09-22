"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, X, ArrowRight } from "lucide-react";
import { useCartStore } from "@/lib/cart/store";
import { useCartUiStore } from "@/lib/cart/ui-store";
import { formatCurrency, staggerIndex } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

/**
 * Slide-in cart.
 *
 * The panel stays mounted and is moved off-canvas when closed, so the browser
 * animates both directions from plain CSS — no mount/unmount bookkeeping and no
 * setState-in-effect. While closed it is `inert`, which takes it out of the
 * accessibility tree and out of the tab order.
 *
 * La cabecera va en panel noche: es el momento de marca más fuerte de la
 * compra, y encima separa con claridad el panel del contenido de la página que
 * queda atrás.
 */
export function CartDrawer() {
  const isDrawerOpen = useCartUiStore((s) => s.isDrawerOpen);
  const closeDrawer = useCartUiStore((s) => s.closeDrawer);

  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const panelRef = useRef<HTMLDivElement>(null);

  // Escape to close, background scroll locked, focus moved into the panel.
  useEffect(() => {
    if (!isDrawerOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeDrawer();
    }
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isDrawerOpen, closeDrawer]);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div
      className={`fixed inset-0 z-50 ${isDrawerOpen ? "" : "pointer-events-none"}`}
      inert={!isDrawerOpen}
    >
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        aria-hidden
        className={`absolute inset-0 bg-bg/55 backdrop-blur-[3px] transition-opacity duration-260 ease-out ${
          isDrawerOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Tu carrito"
        style={{ boxShadow: "var(--shadow-drawer)" }}
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-surface-light outline-none transition-transform duration-260 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="night-panel meridians flex items-center justify-between px-5 py-4">
          <h2 className="flex items-center gap-2.5 font-heading text-lg font-bold text-white">
            <ShoppingBag size={20} className="text-accent" />
            Tu carrito
            {count > 0 && (
              <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-primary tabular-nums">
                {count}
              </span>
            )}
          </h2>
          <button
            onClick={closeDrawer}
            aria-label="Cerrar carrito"
            className="cursor-pointer rounded-full p-2 text-white/70 transition-[color,background-color,transform] duration-200 hover:bg-white/10 hover:text-white active:scale-90"
          >
            <X size={20} />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/5 text-muted">
              <ShoppingBag size={30} />
            </span>
            <p className="text-sm text-muted">Todavía no agregaste nada.</p>
            <Button variant="secondary" onClick={closeDrawer}>
              Seguir mirando
            </Button>
          </div>
        ) : (
          <>
            {/* Keyed on open state so the items re-stagger each time it opens. */}
            <ul
              key={String(isDrawerOpen)}
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            >
              {items.map((item, i) => (
                <li
                  key={item.productId}
                  style={{ "--i": staggerIndex(i) } as React.CSSProperties}
                  className="stagger-rise card-globo flex items-start gap-3 p-3"
                >
                  <Link
                    href={`/productos/${item.slug}`}
                    onClick={closeDrawer}
                    className="group relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-primary/5"
                  >
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-107"
                        sizes="64px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xl">
                        🎁
                      </div>
                    )}
                  </Link>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/productos/${item.slug}`}
                        onClick={closeDrawer}
                        className="line-clamp-2 text-sm font-medium text-text transition-colors hover:text-link"
                      >
                        {item.title}
                      </Link>
                      <span
                        key={item.quantity}
                        className="animate-fade-in shrink-0 font-heading text-sm font-bold text-primary tabular-nums"
                      >
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between gap-2">
                      <div className="flex items-center rounded-lg border border-border bg-surface-light">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          aria-label={`Quitar una unidad de ${item.title}`}
                          className="cursor-pointer rounded-l-lg p-1.5 text-muted transition-[color,background-color,transform] duration-150 hover:bg-primary/6 hover:text-text active:scale-90"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          aria-label={`Agregar una unidad de ${item.title}`}
                          className="cursor-pointer rounded-r-lg p-1.5 text-muted transition-[color,background-color,transform] duration-150 hover:bg-primary/6 hover:text-text active:scale-90"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        aria-label={`Eliminar ${item.title}`}
                        className="cursor-pointer rounded-full p-1.5 text-muted transition-[color,background-color,transform] duration-150 hover:bg-red-50 hover:text-red-600 active:scale-90"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t border-border bg-card px-5 py-4">
              <div className="flex items-baseline justify-between">
                <span className="font-heading text-base font-semibold text-text">
                  Subtotal
                </span>
                <span
                  key={subtotal}
                  className="animate-fade-in font-heading text-xl font-bold text-primary tabular-nums"
                >
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted">
                El envío se calcula en el checkout.
              </p>

              <Link href="/checkout" onClick={closeDrawer} className="mt-3 block">
                <Button
                  size="lg"
                  className="sheen w-full transition-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                >
                  Continuar compra <ArrowRight size={18} />
                </Button>
              </Link>
              <Link
                href="/carrito"
                onClick={closeDrawer}
                className="mt-2 block text-center text-sm text-muted transition-colors hover:text-primary"
              >
                Ver carrito completo
              </Link>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
