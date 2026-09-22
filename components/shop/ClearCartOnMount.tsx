"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/cart/store";

/**
 * Vacía el carrito recién cuando el pedido de Mercado Pago está confirmado,
 * así un pago abandonado o rechazado no hace perder el carrito.
 */
export function ClearCartOnMount() {
  const clear = useCartStore((s) => s.clear);

  useEffect(() => {
    clear();
  }, [clear]);

  return null;
}
