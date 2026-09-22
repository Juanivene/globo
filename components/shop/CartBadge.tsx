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
      className="group relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/8 text-white transition-[background-color,border-color,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-accent/50 hover:bg-white/15 active:scale-95"
    >
      {/*
        Remontar estos nodos con `bumpKey` en cada alta vuelve a disparar la
        animación CSS. Más barato y más simple que llevar un "estoy animando"
        en el estado.

        Las dos claves llevan prefijo porque son hermanas: con `bumpKey` pelado
        las dos valen "0" al cargar y React avisa de claves duplicadas.
      */}
      <ShoppingBag
        key={`bag-${bumpKey}`}
        size={19}
        className={bumpKey > 0 ? "animate-pop" : undefined}
      />
      {count > 0 && (
        <span
          key={`count-${bumpKey}`}
          className={`absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-bold text-primary tabular-nums shadow-(--shadow-accent) ${
            bumpKey > 0 ? "animate-pop" : "animate-fade-in"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
