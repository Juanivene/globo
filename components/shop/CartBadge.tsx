"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/cart/store";

export function CartBadge() {
  const items = useCartStore((s) => s.items);
  const hasHydrated = useCartStore((s) => s.hasHydrated);
  const count = hasHydrated
    ? items.reduce((sum, i) => sum + i.quantity, 0)
    : 0;

  return (
    <Link
      href="/carrito"
      className="relative flex h-10 w-10 items-center justify-center rounded-full text-text-invert transition-colors hover:bg-white/10"
    >
      <ShoppingBag size={20} />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-bold text-primary">
          {count}
        </span>
      )}
    </Link>
  );
}
