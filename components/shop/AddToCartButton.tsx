"use client";

import { useEffect, useRef, useState } from "react";
import { ShoppingBag, Minus, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/cart/store";
import { useCartUiStore } from "@/lib/cart/ui-store";

/**
 * Cantidad + "Agregar al carrito".
 *
 * El botón ocupa todo el ancho y la cantidad queda en su propia fila, rotulada:
 * antes compartían la fila y, en el panel angosto de la ficha, el CTA terminaba
 * siendo el elemento más chico de la pantalla más importante.
 */
export function AddToCartButton({
  product,
}: {
  product: {
    id: string;
    slug: string;
    title: string;
    price: number;
    weightKg: number;
    imageUrl?: string;
  };
}) {
  const addItem = useCartStore((s) => s.addItem);
  const openDrawer = useCartUiStore((s) => s.openDrawer);
  const bump = useCartUiStore((s) => s.bump);

  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const resetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (resetRef.current) clearTimeout(resetRef.current);
  }, []);

  function handleAdd() {
    // The cart is updated first and synchronously — no animation gates this.
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        title: product.title,
        price: product.price,
        weightKg: product.weightKg,
        imageUrl: product.imageUrl,
      },
      quantity
    );
    bump();
    openDrawer();

    setJustAdded(true);
    if (resetRef.current) clearTimeout(resetRef.current);
    resetRef.current = setTimeout(() => setJustAdded(false), 1600);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <span id="qty-label" className="text-sm font-medium text-text">
          Cantidad
        </span>
        <div
          role="group"
          aria-labelledby="qty-label"
          className="flex items-center rounded-xl border border-border bg-surface-light"
        >
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Reducir cantidad"
            className="cursor-pointer rounded-l-xl p-2.5 text-muted transition-[color,background-color,transform] duration-150 hover:bg-primary/6 hover:text-text active:scale-90"
          >
            <Minus size={16} />
          </button>
          <span
            key={quantity}
            aria-live="polite"
            className="animate-fade-in w-9 text-center text-sm font-semibold text-text tabular-nums"
          >
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            aria-label="Aumentar cantidad"
            className="cursor-pointer rounded-r-xl p-2.5 text-muted transition-[color,background-color,transform] duration-150 hover:bg-primary/6 hover:text-text active:scale-90"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <Button
        onClick={handleAdd}
        size="lg"
        className="sheen w-full transition-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
      >
        {justAdded ? (
          <>
            <Check size={18} className="animate-check-pop" /> ¡Agregado!
          </>
        ) : (
          <>
            <ShoppingBag size={18} /> Agregar al carrito
          </>
        )}
      </Button>
    </div>
  );
}
