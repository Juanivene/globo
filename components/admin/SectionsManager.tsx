"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";

export interface SectionRow {
  id: string;
  name: string;
  slug: string;
  _count: { products: number };
}

export function SectionsManager({ initial }: { initial: SectionRow[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<SectionRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  function openCreate() {
    setName("");
    setEditing(null);
    setCreating(true);
  }

  function openEdit(section: SectionRow) {
    setName(section.name);
    setEditing(section);
    setCreating(true);
  }

  function closeForm() {
    setCreating(false);
    setEditing(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editing
        ? `/api/admin/sections/${editing.id}`
        : "/api/admin/sections";
      const res = await fetch(url, {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error();
      toast.success(editing ? "Sección actualizada" : "Sección creada");
      closeForm();
      router.refresh();
    } catch {
      toast.error("No se pudo guardar la sección");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(section: SectionRow) {
    if (!confirm(`¿Eliminar la sección "${section.name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/sections/${section.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.success("Sección eliminada");
      router.refresh();
    } catch {
      toast.error("No se pudo eliminar la sección");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Secciones</h1>
        <Button onClick={openCreate} size="sm">
          <Plus size={16} /> Nueva sección
        </Button>
      </div>

      {creating && (
        <form
          onSubmit={handleSubmit}
          className="flex items-end gap-3 rounded-xl bg-white p-4 shadow-sm"
        >
          <div className="flex-1">
            <Label>Nombre</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              placeholder="Ej: Perfumes"
            />
          </div>
          <Button type="submit" size="sm" disabled={saving}>
            {saving ? "Guardando..." : "Guardar"}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={closeForm}>
            <X size={16} />
          </Button>
        </form>
      )}

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-black/[0.02] text-left text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Productos</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {initial.map((section) => (
              <tr key={section.id}>
                <td className="px-4 py-3 font-medium text-text">
                  {section.name}
                </td>
                <td className="px-4 py-3 text-muted">{section.slug}</td>
                <td className="px-4 py-3 text-muted">
                  {section._count.products}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => openEdit(section)}
                    className="mr-2 text-glow hover:opacity-70 cursor-pointer"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(section)}
                    className="text-red-600 hover:opacity-70 cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {initial.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted">
                  Todavía no hay secciones.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
