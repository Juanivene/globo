import { prisma } from "@/lib/prisma";
import { ShippingSurchargeRules } from "@/components/admin/ShippingSurchargeRules";
import { ShippingProvincePricing } from "@/components/admin/ShippingProvincePricing";
import { PROVINCES, PROVINCE_LABELS } from "@/lib/shipping/provinces";

export default async function AdminShippingPage() {
  const [provinceConfigs, surchargeRules] = await Promise.all([
    prisma.shippingProvinceConfig.findMany(),
    prisma.shippingSurchargeRule.findMany({ orderBy: { thresholdKg: "asc" } }),
  ]);

  const provinceRows = [...PROVINCES]
    .sort((a, b) => PROVINCE_LABELS[a].localeCompare(PROVINCE_LABELS[b], "es"))
    .map((province) => {
      const existing = provinceConfigs.find((c) => c.province === province);
      return {
        province,
        label: PROVINCE_LABELS[province],
        basePrice: existing?.basePrice.toString() ?? "",
        configured: Boolean(existing),
      };
    });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary">Configuración de envío</h1>
      <ShippingSurchargeRules
        initialRules={surchargeRules.map((r) => ({
          id: r.id,
          thresholdKg: r.thresholdKg.toString(),
          surchargePct: r.surchargePct.toString(),
          active: r.active,
        }))}
      />
      <ShippingProvincePricing initial={provinceRows} />
    </div>
  );
}
