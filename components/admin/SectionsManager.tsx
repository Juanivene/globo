"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { useConfirm } from "@/components/ui/ConfirmProvider";

export interface SectionRow {
  id: string;
  name: string;
  slug: string;
  _count: { products: number };
}

export function SectionsManager({ initial }: { initial: SectionRow[] }) {
  const router = useRouter();
  const confirm = useConfirm();
  const [editing, setEditing] = useState<SectionRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return initial;
    return initial.filter((s) => s.name.toLowerCase().includes(q));
  }, [initial, query]);

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
    const ok = await confirm({
      title: `¿Eliminar la sección "${section.name}"?`,
      description:
        section._count.products > 0
          ? `Se va a desvincular de ${section._count.products} producto(s).`
          : undefined,
      confirmLabel: "Eliminar",
      variant: "danger",
    });
    if (!ok) return;
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

      <div className="relative max-w-sm">
        <Search
          size={16}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar sección..."
          aria-label="Buscar sección"
          className="w-full rounded-full border border-border bg-card py-2 pl-10 pr-9 text-sm shadow-(--shadow-card) outline-none transition-[border-color,box-shadow] duration-200 focus:border-link focus:ring-2 focus:ring-link/25"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Limpiar búsqueda"
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full p-1 text-muted transition-colors hover:bg-black/5 hover:text-text"
          >
            <X size={14} />
          </button>
        )}
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

      {/* overflow-x-auto (not overflow-hidden): lets the table scroll within
          its own card on narrow phones instead of stretching the whole
          admin layout. */}
      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
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
            {filtered.map((section) => (
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
                    className="mr-2 text-link hover:opacity-70 cursor-pointer"
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
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted">
                  {initial.length === 0
                    ? "Todavía no hay secciones."
                    : "Ninguna sección coincide con la búsqueda."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
