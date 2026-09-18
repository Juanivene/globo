"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { PROVINCE_LABELS } from "@/lib/shipping/provinces";
import type { ArgentinaProvince } from "@/app/generated/prisma/enums";

interface ProvinceRow {
  province: ArgentinaProvince;
  basePrice: string;
}

interface SurchargeRule {
  id?: string;
  thresholdKg: string;
  surchargePct: string;
  active: boolean;
}

export function ShippingConfigForm({
  initialProvinces,
  initialSurcharge,
}: {
  initialProvinces: ProvinceRow[];
  initialSurcharge: SurchargeRule;
}) {
  const [provinces, setProvinces] = useState(initialProvinces);
  const [surcharge, setSurcharge] = useState(initialSurcharge);
  const [saving, setSaving] = useState(false);

  function updatePrice(province: ArgentinaProvince, value: string) {
    setProvinces((prev) =>
      prev.map((p) => (p.province === province ? { ...p, basePrice: value } : p))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/shipping-config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provinces, surcharge }),
      });
      if (!res.ok) throw new Error();
      toast.success("Configuración de envío guardada");
    } catch {
      toast.error("No se pudo guardar la configuración");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <h2 className="mb-1 text-lg font-semibold text-primary">
          Recargo por peso
        </h2>
        <p className="mb-4 text-sm text-muted">
          Si el peso total del pedido supera el umbral, se suma el porcentaje
          indicado al costo base de envío.
        </p>
        <div className="grid max-w-md grid-cols-2 gap-4">
          <div>
            <Label>Umbral (kg)</Label>
            <Input
              type="number"
              min="0"
              step="0.001"
              value={surcharge.thresholdKg}
              onChange={(e) =>
                setSurcharge((s) => ({ ...s, thresholdKg: e.target.value }))
              }
            />
          </div>
          <div>
            <Label>Recargo (%)</Label>
            <Input
              type="number"
              min="0"
              step="0.1"
              value={surcharge.surchargePct}
              onChange={(e) =>
                setSurcharge((s) => ({ ...s, surchargePct: e.target.value }))
              }
            />
          </div>
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm text-text">
          <input
            type="checkbox"
            checked={surcharge.active}
            onChange={(e) =>
              setSurcharge((s) => ({ ...s, active: e.target.checked }))
            }
            className="h-4 w-4 rounded border-border accent-accent"
          />
          Regla activa
        </label>
      </div>

      <div className="rounded-xl bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-primary">
          Precio base por provincia
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {provinces.map((p) => (
            <div key={p.province}>
              <Label className="text-xs">{PROVINCE_LABELS[p.province]}</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={p.basePrice}
                onChange={(e) => updatePrice(p.province, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={saving}>
        {saving ? "Guardando..." : "Guardar configuración"}
      </Button>
    </form>
  );
}
