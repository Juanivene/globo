"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export interface ProductRow {
  id: string;
  title: string;
  price: string;
  enabled: boolean;
  images: { url: string }[];
  sections: { section: { name: string } }[];
}

export function ProductsTable({ initial }: { initial: ProductRow[] }) {
  const router = useRouter();

  async function toggleEnabled(product: ProductRow) {
    try {
      const res = await fetch(`/api/admin/products/${product.id}/toggle`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      toast.error("No se pudo actualizar el producto");
    }
  }

  async function handleDelete(product: ProductRow) {
    if (!confirm(`¿Eliminar "${product.title}"? Esta acción no se puede deshacer.`))
      return;
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.success("Producto eliminado");
      router.refresh();
    } catch {
      toast.error("No se pudo eliminar el producto");
    }
  }

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-black/[0.02] text-left text-xs uppercase text-muted">
          <tr>
            <th className="px-4 py-3">Producto</th>
            <th className="px-4 py-3">Precio</th>
            <th className="px-4 py-3">Secciones</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {initial.map((product) => (
            <tr key={product.id}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-black/5">
                    {product.images[0] && (
                      <Image
                        src={product.images[0].url}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    )}
                  </div>
                  <span className="font-medium text-text">{product.title}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-text">
                {formatCurrency(product.price)}
              </td>
              <td className="px-4 py-3 text-muted">
                {product.sections.map((s) => s.section.name).join(", ") || "—"}
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => toggleEnabled(product)}
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold cursor-pointer ${
                    product.enabled
                      ? "bg-green-100 text-green-800"
                      : "bg-black/10 text-muted"
                  }`}
                >
                  {product.enabled ? "Habilitado" : "Deshabilitado"}
                </button>
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/admin/productos/${product.id}`}
                  className="mr-2 inline-block text-glow hover:opacity-70"
                >
                  <Pencil size={16} />
                </Link>
                <button
                  onClick={() => handleDelete(product)}
                  className="text-red-600 hover:opacity-70 cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
          {initial.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-muted">
                Todavía no hay productos.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
