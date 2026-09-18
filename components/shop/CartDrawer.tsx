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
        className={`absolute inset-0 bg-bg/50 backdrop-blur-[2px] transition-opacity duration-260 ease-out ${
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
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-primary">
            <ShoppingBag size={20} className="text-bronze" />
            Tu carrito
            {count > 0 && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary tabular-nums">
                {count}
              </span>
            )}
          </h2>
          <button
            onClick={closeDrawer}
            aria-label="Cerrar carrito"
            className="cursor-pointer rounded-full p-2 text-muted transition-colors hover:bg-black/5 hover:text-text active:scale-90"
          >
            <X size={20} />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag size={40} className="text-muted/50" />
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
              className="flex-1 space-y-3 overflow-y-auto px-5 py-4"
            >
              {items.map((item, i) => (
                <li
                  key={item.productId}
                  style={{ "--i": staggerIndex(i) } as React.CSSProperties}
                  className="stagger-rise card-globo flex items-center gap-3 p-3"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-black/5">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xl">
                        🎁
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/productos/${item.slug}`}
                      onClick={closeDrawer}
                      className="line-clamp-1 text-sm font-medium text-text hover:underline"
                    >
                      {item.title}
                    </Link>
                    <p className="text-sm text-muted tabular-nums">
                      {formatCurrency(item.price)}
                    </p>

                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="flex items-center rounded-lg border border-border">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          aria-label={`Quitar una unidad de ${item.title}`}
                          className="cursor-pointer p-1.5 text-muted transition-colors hover:text-text active:scale-90"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-6 text-center text-sm tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          aria-label={`Agregar una unidad de ${item.title}`}
                          className="cursor-pointer p-1.5 text-muted transition-colors hover:text-text active:scale-90"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        aria-label={`Eliminar ${item.title}`}
                        className="cursor-pointer p-1.5 text-red-600 transition-opacity hover:opacity-70 active:scale-90"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <span className="shrink-0 self-start text-sm font-semibold text-primary tabular-nums">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <footer className="border-t border-border bg-card px-5 py-4">
              <div className="flex items-center justify-between font-heading text-lg font-bold text-text">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatCurrency(subtotal)}</span>
              </div>
              <p className="mt-0.5 text-xs text-muted">
                El envío se calcula en el checkout.
              </p>

              <Link href="/checkout" onClick={closeDrawer} className="mt-3 block">
                <Button size="lg" className="sheen w-full transition-transform active:scale-[0.98]">
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
