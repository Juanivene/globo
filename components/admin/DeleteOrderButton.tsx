"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useConfirm } from "@/components/ui/ConfirmProvider";

export function DeleteOrderButton({
  orderId,
  orderLabel,
  redirectTo,
  variant = "icon",
}: {
  orderId: string;
  orderLabel: string;
  /** Si se pasa, navega ahí después de borrar (para la vista de detalle). */
  redirectTo?: string;
  variant?: "icon" | "button";
}) {
  const router = useRouter();
  const confirm = useConfirm();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const ok = await confirm({
      title: `¿Eliminar el pedido #${orderLabel}?`,
      description: "Esta acción no se puede deshacer.",
      confirmLabel: "Eliminar",
      variant: "danger",
    });
    if (!ok) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.success("Pedido eliminado");
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.refresh();
      }
    } catch {
      toast.error("No se pudo eliminar el pedido");
      setDeleting(false);
    }
  }

  if (variant === "button") {
    return (
      <Button
        type="button"
        variant="danger"
        size="sm"
        onClick={handleDelete}
        disabled={deleting}
      >
        <Trash2 size={14} /> {deleting ? "Eliminando..." : "Eliminar pedido"}
      </Button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="cursor-pointer text-red-600 hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-40"
      aria-label={`Eliminar pedido #${orderLabel}`}
    >
      <Trash2 size={16} />
    </button>
  );
}
