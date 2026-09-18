"use client";

import { useEffect, useRef, useState } from "react";
import { ShoppingBag, Minus, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/cart/store";
import { useCartUiStore } from "@/lib/cart/ui-store";

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
    <div className="flex items-center gap-3">
      <div className="flex items-center rounded-lg border border-border bg-card">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          aria-label="Reducir cantidad"
          className="cursor-pointer p-2.5 text-muted transition-colors hover:text-text active:scale-90"
        >
          <Minus size={16} />
        </button>
        <span className="w-8 text-center text-sm font-medium tabular-nums">
          {quantity}
        </span>
        <button
          type="button"
          onClick={() => setQuantity((q) => q + 1)}
          aria-label="Aumentar cantidad"
          className="cursor-pointer p-2.5 text-muted transition-colors hover:text-text active:scale-90"
        >
          <Plus size={16} />
        </button>
      </div>

      <Button
        onClick={handleAdd}
        size="lg"
        className="sheen flex-1 transition-transform active:scale-[0.98]"
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
