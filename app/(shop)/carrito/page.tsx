"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/cart/store";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const hasHydrated = useCartStore((s) => s.hasHydrated);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  if (!hasHydrated) return null;

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl bg-white py-20 text-center shadow-sm">
        <ShoppingBag size={40} className="text-muted" />
        <p className="text-muted">Tu carrito está vacío.</p>
        <Link href="/">
          <Button>Ver catálogo</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-primary">
        Tu carrito
      </h1>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm"
          >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-black/5">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-2xl">
                  🎁
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <Link
                href={`/productos/${item.slug}`}
                className="line-clamp-1 text-sm font-medium text-text hover:underline"
              >
                {item.title}
              </Link>
              <p className="text-sm text-muted">{formatCurrency(item.price)}</p>
            </div>
            <div className="flex items-center rounded-lg border border-border">
              <button
                onClick={() =>
                  updateQuantity(item.productId, item.quantity - 1)
                }
                className="p-2 text-muted hover:text-text cursor-pointer"
              >
                <Minus size={14} />
              </button>
              <span className="w-6 text-center text-sm">{item.quantity}</span>
              <button
                onClick={() =>
                  updateQuantity(item.productId, item.quantity + 1)
                }
                className="p-2 text-muted hover:text-text cursor-pointer"
              >
                <Plus size={14} />
              </button>
            </div>
            <button
              onClick={() => removeItem(item.productId)}
              className="text-red-600 hover:opacity-70 cursor-pointer"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between text-lg font-semibold text-text">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <p className="mt-1 text-xs text-muted">
          El costo de envío se calcula en el siguiente paso.
        </p>
        <Link href="/checkout">
          <Button className="mt-4 w-full" size="lg">
            Continuar compra
          </Button>
        </Link>
      </div>
    </div>
  );
}
