"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ShoppingBag, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/cart/store";

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
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center rounded-lg border border-border">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="p-2.5 text-muted hover:text-text cursor-pointer"
        >
          <Minus size={16} />
        </button>
        <span className="w-8 text-center text-sm font-medium">{quantity}</span>
        <button
          onClick={() => setQuantity((q) => q + 1)}
          className="p-2.5 text-muted hover:text-text cursor-pointer"
        >
          <Plus size={16} />
        </button>
      </div>
      <Button
        onClick={() => {
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
          toast.success(`${product.title} agregado al carrito`);
        }}
        className="flex-1"
      >
        <ShoppingBag size={18} /> Agregar al carrito
      </Button>
    </div>
  );
}
