"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import type { ArgentinaProvince } from "@/app/generated/prisma/enums";

export interface ProvincePriceRow {
  province: ArgentinaProvince;
  label: string;
  basePrice: string;
  configured: boolean;
}

async function saveProvinces(rows: { province: ArgentinaProvince; basePrice: string }[]) {
  const res = await fetch("/api/admin/shipping-config", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ provinces: rows }),
  });
  if (!res.ok) throw new Error();
}

export function ShippingProvincePricing({ initial }: { initial: ProvincePriceRow[] }) {
  const [rows, setRows] = useState(initial);
  const [original, setOriginal] = useState(initial);
  const [savingProvince, setSavingProvince] = useState<ArgentinaProvince | null>(null);
  const [savingAll, setSavingAll] = useState(false);

  function updatePrice(province: ArgentinaProvince, value: string) {
    setRows((prev) => prev.map((r) => (r.province === province ? { ...r, basePrice: value } : r)));
  }

  function isDirty(row: ProvincePriceRow) {
    const orig = original.find((o) => o.province === row.province);
    return orig?.basePrice !== row.basePrice;
  }

  async function saveRow(province: ArgentinaProvince) {
    const row = rows.find((r) => r.province === province);
    if (!row || !row.basePrice) {
      toast.error("Ingresá un precio");
      return;
    }
    setSavingProvince(province);
    try {
      await saveProvinces([{ province, basePrice: row.basePrice }]);
      setRows((prev) =>
        prev.map((r) => (r.province === province ? { ...r, configured: true } : r))
      );
      setOriginal((prev) =>
        prev.map((r) => (r.province === province ? { ...r, basePrice: row.basePrice, configured: true } : r))
      );
      toast.success(`Precio de ${row.label} guardado`);
    } catch {
      toast.error("No se pudo guardar el precio");
    } finally {
      setSavingProvince(null);
    }
  }

  async function saveAll() {
    const dirty = rows.filter((r) => isDirty(r) && r.basePrice);
    if (dirty.length === 0) {
      toast.info("No hay cambios para guardar");
      return;
    }
    setSavingAll(true);
    try {
      await saveProvinces(dirty.map((r) => ({ province: r.province, basePrice: r.basePrice })));
      setRows((prev) =>
        prev.map((r) => (dirty.some((d) => d.province === r.province) ? { ...r, configured: true } : r))
      );
      setOriginal(rows.map((r) => ({ ...r, configured: r.configured || dirty.some((d) => d.province === r.province) })));
      toast.success(`${dirty.length} provincia(s) guardada(s)`);
    } catch {
      toast.error("No se pudo guardar la configuración");
    } finally {
      setSavingAll(false);
    }
  }

  const pendingCount = rows.filter((r) => isDirty(r) && r.basePrice).length;

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-primary">Precio base por provincia</h2>
          <p className="text-sm text-muted">
            Precio de envío antes de recargos por peso. Las provincias sin
            configurar no permiten calcular el envío en el checkout.
          </p>
        </div>
        <Button type="button" size="sm" onClick={saveAll} disabled={savingAll || pendingCount === 0}>
          <Save size={14} /> Guardar todo {pendingCount > 0 && `(${pendingCount})`}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((row) => (
          <div
            key={row.province}
            className={cn(
              "space-y-1 rounded-lg border p-2.5",
              row.configured ? "border-border" : "border-amber-400/60 bg-amber-50/50"
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <Label className="text-xs">{row.label}</Label>
              {!row.configured && (
                <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
                  Sin configurar
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <Input
                type="number"
                min="0"
                step="0.01"
                value={row.basePrice}
                onChange={(e) => updatePrice(row.province, e.target.value)}
              />
              <button
                type="button"
                onClick={() => saveRow(row.province)}
                disabled={savingProvince === row.province || !isDirty(row)}
                className="shrink-0 cursor-pointer rounded-md p-2 text-link transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-30"
                aria-label={`Guardar precio de ${row.label}`}
              >
                <Save size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
