"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Label } from "@/components/ui/Input";
import { uploadProductImage } from "@/lib/uploadProductImage";
import { PROVINCE_LABELS, PROVINCES } from "@/lib/shipping/provinces";
import type { ArgentinaProvince } from "@/app/generated/prisma/enums";

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
  freeShipping: boolean;
  freeShippingProvinces: ArgentinaProvince[];
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
      freeShipping: false,
      freeShippingProvinces: [],
    }
  );
  const [saving, setSaving] = useState(false);

  const isCreate = !values.id;
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  function toggleSection(id: string) {
    setValues((v) => ({
      ...v,
      sectionIds: v.sectionIds.includes(id)
        ? v.sectionIds.filter((s) => s !== id)
        : [...v.sectionIds, id],
    }));
  }

  function toggleFreeShippingProvince(province: ArgentinaProvince) {
    setValues((v) => ({
      ...v,
      freeShippingProvinces: v.freeShippingProvinces.includes(province)
        ? v.freeShippingProvinces.filter((p) => p !== province)
        : [...v.freeShippingProvinces, province],
    }));
  }

  function addImageFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const list = Array.from(files);
    setImageFiles((prev) => [...prev, ...list]);
    setImagePreviews((prev) => [...prev, ...list.map((f) => URL.createObjectURL(f))]);
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeImageFile(index: number) {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
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

      if (!values.id) {
        for (const file of imageFiles) {
          try {
            await uploadProductImage(file, product.id);
          } catch {
            toast.error(`No se pudo subir ${file.name}`);
          }
        }
        toast.success("Producto creado");
        router.push(`/admin/productos/${product.id}`);
      } else {
        toast.success("Producto actualizado");
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

      {isCreate && (
        <div>
          <Label>Imagen (opcional)</Label>
          <div className="flex flex-wrap gap-3">
            {imagePreviews.map((src, i) => (
              <div
                key={src}
                className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-black/5"
              >
                <Image src={src} alt="" fill className="object-cover" sizes="80px" />
                <button
                  type="button"
                  onClick={() => removeImageFile(i)}
                  className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex h-20 w-20 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border text-muted transition-colors hover:border-link hover:text-link cursor-pointer"
            >
              <Upload size={18} />
              <span className="text-xs">Subir</span>
            </button>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            hidden
            onChange={(e) => addImageFiles(e.target.files)}
          />
        </div>
      )}

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
                  : "border-border text-muted hover:border-link"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-border p-4">
        <label className="flex items-center gap-2 text-sm text-text">
          <input
            type="checkbox"
            checked={values.freeShipping}
            onChange={(e) =>
              setValues((v) => ({ ...v, freeShipping: e.target.checked }))
            }
            className="h-4 w-4 rounded border-border accent-accent"
          />
          Envío gratis
        </label>
        {values.freeShipping && (
          <div>
            <Label className="text-xs">
              Provincias (si no elegís ninguna, aplica a todas)
            </Label>
            <div className="flex flex-wrap gap-2">
              {PROVINCES.map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => toggleFreeShippingProvince(p)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition-colors cursor-pointer ${
                    values.freeShippingProvinces.includes(p)
                      ? "border-accent bg-accent/20 text-primary font-medium"
                      : "border-border text-muted hover:border-link"
                  }`}
                >
                  {PROVINCE_LABELS[p]}
                </button>
              ))}
            </div>
          </div>
        )}
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
