"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Select } from "@/components/ui/Input";
import { STATUS_LABELS } from "@/components/ui/Badge";
import type { OrderStatus } from "@/app/generated/prisma/enums";

const STATUSES: OrderStatus[] = [
  "PENDIENTE",
  "CONFIRMADO",
  "ENVIADO",
  "ENTREGADO",
  "CANCELADO",
];

export function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [saving, setSaving] = useState(false);

  async function handleChange(newStatus: OrderStatus) {
    setSaving(true);
    setValue(newStatus);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      toast.success("Estado actualizado. Se notificó al cliente por email.");
      router.refresh();
    } catch {
      setValue(status);
      toast.error("No se pudo actualizar el estado");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Select
      value={value}
      disabled={saving}
      onChange={(e) => handleChange(e.target.value as OrderStatus)}
      className="max-w-xs"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {STATUS_LABELS[s]}
        </option>
      ))}
    </Select>
  );
}
