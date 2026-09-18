import { prisma } from "@/lib/prisma";
import { ShippingConfigForm } from "@/components/admin/ShippingConfigForm";

export default async function AdminShippingPage() {
  const [provinces, surchargeRule] = await Promise.all([
    prisma.shippingProvinceConfig.findMany({ orderBy: { province: "asc" } }),
    prisma.shippingSurchargeRule.findFirst(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary">Configuración de envío</h1>
      <ShippingConfigForm
        initialProvinces={provinces.map((p) => ({
          province: p.province,
          basePrice: p.basePrice.toString(),
        }))}
        initialSurcharge={{
          id: surchargeRule?.id,
          thresholdKg: surchargeRule?.thresholdKg.toString() ?? "5",
          surchargePct: surchargeRule?.surchargePct.toString() ?? "15",
          active: surchargeRule?.active ?? true,
        }}
      />
    </div>
  );
}
