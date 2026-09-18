"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Label } from "@/components/ui/Input";

export interface SectionOption {
  id: string;
  name: string;
}

export interface ProductFormValues {
  id?: string;
  title: string;
  description: string;
  price: string;
  weightKg: string;
  enabled: boolean;
  sectionIds: string[];
}

export function ProductForm({
  initial,
  sections,
}: {
  initial?: ProductFormValues;
  sections: SectionOption[];
}) {
  const router = useRouter();
  const [values, setValues] = useState<ProductFormValues>(
    initial ?? {
      title: "",
      description: "",
      price: "",
      weightKg: "",
      enabled: true,
      sectionIds: [],
    }
  );
  const [saving, setSaving] = useState(false);

  function toggleSection(id: string) {
    setValues((v) => ({
      ...v,
      sectionIds: v.sectionIds.includes(id)
        ? v.sectionIds.filter((s) => s !== id)
        : [...v.sectionIds, id],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const url = values.id
        ? `/api/admin/products/${values.id}`
        : "/api/admin/products";
      const res = await fetch(url, {
        method: values.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error();
      const product = await res.json();
      toast.success(values.id ? "Producto actualizado" : "Producto creado");
      if (!values.id) {
        router.push(`/admin/productos/${product.id}`);
      } else {
        router.refresh();
      }
    } catch {
      toast.error("No se pudo guardar el producto");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <div>
        <Label>Título</Label>
        <Input
          required
          value={values.title}
          onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
        />
      </div>
      <div>
        <Label>Descripción</Label>
        <Textarea
          required
          rows={5}
          value={values.description}
          onChange={(e) =>
            setValues((v) => ({ ...v, description: e.target.value }))
          }
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Precio (ARS)</Label>
          <Input
            required
            type="number"
            min="0"
            step="0.01"
            value={values.price}
            onChange={(e) =>
              setValues((v) => ({ ...v, price: e.target.value }))
            }
          />
        </div>
        <div>
          <Label>Peso (kg)</Label>
          <Input
            required
            type="number"
            min="0"
            step="0.001"
            value={values.weightKg}
            onChange={(e) =>
              setValues((v) => ({ ...v, weightKg: e.target.value }))
            }
          />
        </div>
      </div>

      <div>
        <Label>Secciones (opcional)</Label>
        <div className="flex flex-wrap gap-2">
          {sections.length === 0 && (
            <p className="text-sm text-muted">
              No hay secciones creadas todavía.
            </p>
          )}
          {sections.map((s) => (
            <button
              type="button"
              key={s.id}
              onClick={() => toggleSection(s.id)}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors cursor-pointer ${
                values.sectionIds.includes(s.id)
                  ? "border-accent bg-accent/20 text-primary font-medium"
                  : "border-border text-muted hover:border-glow"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-text">
        <input
          type="checkbox"
          checked={values.enabled}
          onChange={(e) =>
            setValues((v) => ({ ...v, enabled: e.target.checked }))
          }
          className="h-4 w-4 rounded border-border accent-accent"
        />
        Producto habilitado (visible en la tienda)
      </label>

      <Button type="submit" disabled={saving}>
        {saving ? "Guardando..." : "Guardar"}
      </Button>
    </form>
  );
}
