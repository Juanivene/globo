"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { useConfirm } from "@/components/ui/ConfirmProvider";

export interface SurchargeRuleRow {
  id?: string;
  thresholdKg: string;
  surchargePct: string;
  active: boolean;
}

function emptyRow(): SurchargeRuleRow {
  return { thresholdKg: "", surchargePct: "", active: true };
}

export function ShippingSurchargeRules({
  initialRules,
}: {
  initialRules: SurchargeRuleRow[];
}) {
  const confirm = useConfirm();
  const [rules, setRules] = useState<SurchargeRuleRow[]>(initialRules);
  const [savingIndex, setSavingIndex] = useState<number | null>(null);

  function updateRule(index: number, patch: Partial<SurchargeRuleRow>) {
    setRules((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  function addRow() {
    setRules((prev) => [...prev, emptyRow()]);
  }

  async function saveRule(index: number) {
    const rule = rules[index];
    if (!rule.thresholdKg || !rule.surchargePct) {
      toast.error("Completá el umbral y el porcentaje de recargo");
      return;
    }
    setSavingIndex(index);
    try {
      const url = rule.id
        ? `/api/admin/shipping-surcharges/${rule.id}`
        : "/api/admin/shipping-surcharges";
      const res = await fetch(url, {
        method: rule.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          thresholdKg: rule.thresholdKg,
          surchargePct: rule.surchargePct,
          active: rule.active,
        }),
      });
      if (!res.ok) throw new Error();
      const saved = await res.json();
      updateRule(index, {
        id: saved.id,
        thresholdKg: saved.thresholdKg.toString(),
        surchargePct: saved.surchargePct.toString(),
      });
      toast.success("Tramo guardado");
    } catch {
      toast.error("No se pudo guardar el tramo");
    } finally {
      setSavingIndex(null);
    }
  }

  async function deleteRule(index: number) {
    const rule = rules[index];
    if (rule.id) {
      const ok = await confirm({
        title: "¿Eliminar este tramo de recargo?",
        confirmLabel: "Eliminar",
        variant: "danger",
      });
      if (!ok) return;
      try {
        const res = await fetch(`/api/admin/shipping-surcharges/${rule.id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error();
        toast.success("Tramo eliminado");
      } catch {
        toast.error("No se pudo eliminar el tramo");
        return;
      }
    }
    setRules((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <h2 className="mb-1 text-lg font-semibold text-primary">Recargo por peso</h2>
      <p className="mb-4 text-sm text-muted">
        Podés cargar varios tramos (ej: +1kg, +3kg). Si el peso total del
        pedido supera el umbral de un tramo, se suma su porcentaje al costo
        base de envío. Se aplica un único tramo: el más específico que el
        peso supera.
      </p>

      <div className="space-y-3">
        {rules.map((rule, index) => (
          <div
            key={rule.id ?? `new-${index}`}
            className="grid grid-cols-[1fr_1fr_auto_auto_auto] items-end gap-3 rounded-lg border border-border p-3"
          >
            <div>
              <Label className="text-xs">Umbral (kg)</Label>
              <Input
                type="number"
                min="0"
                step="0.001"
                value={rule.thresholdKg}
                onChange={(e) => updateRule(index, { thresholdKg: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-xs">Recargo (%)</Label>
              <Input
                type="number"
                min="0"
                step="0.1"
                value={rule.surchargePct}
                onChange={(e) => updateRule(index, { surchargePct: e.target.value })}
              />
            </div>
            <label className="flex items-center gap-1.5 pb-2 text-xs text-text">
              <input
                type="checkbox"
                checked={rule.active}
                onChange={(e) => updateRule(index, { active: e.target.checked })}
                className="h-4 w-4 rounded border-border accent-accent"
              />
              Activo
            </label>
            <Button
              type="button"
              size="sm"
              onClick={() => saveRule(index)}
              disabled={savingIndex === index}
            >
              <Save size={14} /> Guardar
            </Button>
            <button
              type="button"
              onClick={() => deleteRule(index)}
              className="cursor-pointer p-2 text-red-600 hover:opacity-70"
              aria-label="Eliminar tramo"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {rules.length === 0 && (
          <p className="text-sm text-muted">Todavía no hay tramos de recargo.</p>
        )}
      </div>

      <Button type="button" variant="ghost" size="sm" className="mt-3" onClick={addRow}>
        <Plus size={16} /> Agregar tramo
      </Button>
    </div>
  );
}
