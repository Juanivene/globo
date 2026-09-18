"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Select } from "@/components/ui/Input";
import { PROVINCES, PROVINCE_LABELS } from "@/lib/shipping/provinces";
import type { ArgentinaProvince } from "@/app/generated/prisma/enums";

export function ProvinceSelect({
  orderId,
  province,
}: {
  orderId: string;
  province: ArgentinaProvince;
}) {
  const router = useRouter();
  const [value, setValue] = useState(province);
  const [saving, setSaving] = useState(false);

  async function handleChange(newProvince: ArgentinaProvince) {
    setSaving(true);
    setValue(newProvince);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ province: newProvince }),
      });
      if (!res.ok) throw new Error();
      toast.success("Provincia corregida");
      router.refresh();
    } catch {
      setValue(province);
      toast.error("No se pudo actualizar la provincia");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Select
      value={value}
      disabled={saving}
      onChange={(e) => handleChange(e.target.value as ArgentinaProvince)}
      className="max-w-xs"
    >
      {PROVINCES.map((p) => (
        <option key={p} value={p}>
          {PROVINCE_LABELS[p]}
        </option>
      ))}
    </Select>
  );
}
