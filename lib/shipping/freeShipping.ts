import { ArgentinaProvince } from "@/app/generated/prisma/enums";

/**
 * "Todo o nada": el envío del carrito es gratis solo si CADA producto tiene
 * envío gratis habilitado para la provincia de destino. Si uno solo no lo
 * tiene, se cobra el envío normal completo.
 */
export function isCartFreeShipping(
  products: { freeShipping: boolean; freeShippingProvinces: ArgentinaProvince[] }[],
  province: ArgentinaProvince
): boolean {
  return products.every(
    (p) =>
      p.freeShipping &&
      (p.freeShippingProvinces.length === 0 || p.freeShippingProvinces.includes(province))
  );
}
