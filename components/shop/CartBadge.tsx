"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/cart/store";
import { useCartUiStore } from "@/lib/cart/ui-store";

export function CartBadge() {
  const items = useCartStore((s) => s.items);
  const hasHydrated = useCartStore((s) => s.hasHydrated);
  const openDrawer = useCartUiStore((s) => s.openDrawer);
  const bumpKey = useCartUiStore((s) => s.bumpKey);

  const count = hasHydrated ? items.reduce((sum, i) => sum + i.quantity, 0) : 0;

  return (
    <button
      onClick={openDrawer}
      aria-label={count > 0 ? `Abrir carrito, ${count} productos` : "Abrir carrito"}
      className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-text-invert transition-colors hover:bg-white/10 active:scale-95"
    >
      {/*
        Keying on `bumpKey` remounts these nodes on every add, which replays the
        CSS animation. Cheaper and simpler than tracking "is animating" in state.
      */}
      <ShoppingBag
        key={bumpKey}
        size={20}
        className={bumpKey > 0 ? "animate-pop" : undefined}
      />
      {count > 0 && (
        <span
          key={bumpKey}
          className={`absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-bold text-primary tabular-nums ${
            bumpKey > 0 ? "animate-pop" : "animate-fade-in"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
