import { prisma } from "@/lib/prisma";
import { resolveProvinceFromCp } from "@/lib/shipping/cpTable";
import { ArgentinaProvince } from "@/app/generated/prisma/enums";

export class ShippingError extends Error {
  constructor(public code: "CP_NOT_RECOGNIZED" | "PROVINCE_NOT_CONFIGURED") {
    super(code);
  }
}

export interface ShippingQuote {
  province: ArgentinaProvince;
  shippingCost: number;
}

export async function calculateShipping(
  cp: string,
  totalWeightKg: number
): Promise<ShippingQuote> {
  const province = resolveProvinceFromCp(cp);
  if (!province) throw new ShippingError("CP_NOT_RECOGNIZED");

  const config = await prisma.shippingProvinceConfig.findUnique({
    where: { province },
  });
  if (!config) throw new ShippingError("PROVINCE_NOT_CONFIGURED");

  const rule = await prisma.shippingSurchargeRule.findFirst({
    where: { active: true },
  });

  let cost = Number(config.basePrice);
  if (rule && totalWeightKg > Number(rule.thresholdKg)) {
    cost += cost * (Number(rule.surchargePct) / 100);
  }

  return { province, shippingCost: Math.round(cost * 100) / 100 };
}

export function totalWeightKgForItems(
  items: { weightKg: number; quantity: number }[]
): number {
  return items.reduce((sum, item) => sum + item.weightKg * item.quantity, 0);
}
