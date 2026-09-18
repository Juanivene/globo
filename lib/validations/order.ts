import { z } from "zod";

export const orderStatusSchema = z.object({
  status: z.enum(["PENDIENTE", "CONFIRMADO", "ENVIADO", "ENTREGADO", "CANCELADO"]),
});

export type OrderStatusInput = z.infer<typeof orderStatusSchema>;

export const shippingProvinceConfigSchema = z.object({
  basePrice: z.coerce.number().nonnegative(),
});

export const shippingSurchargeRuleSchema = z.object({
  thresholdKg: z.coerce.number().nonnegative(),
  surchargePct: z.coerce.number().nonnegative(),
  active: z.boolean().default(true),
});
