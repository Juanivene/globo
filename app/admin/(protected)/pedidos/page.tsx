import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency, cn } from "@/lib/utils";
import { OrderStatusBadge, STATUS_LABELS } from "@/components/ui/Badge";
import { DeleteOrderButton } from "@/components/admin/DeleteOrderButton";
import type { OrderStatus } from "@/app/generated/prisma/enums";

const FILTERS: (OrderStatus | "TODOS")[] = [
  "TODOS",
  "PENDIENTE",
  "CONFIRMADO",
  "ENVIADO",
  "ENTREGADO",
  "CANCELADO",
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeFilter =
    status && FILTERS.includes(status as OrderStatus) ? status : "TODOS";

  const orders = await prisma.order.findMany({
    where: activeFilter === "TODOS" ? {} : { status: activeFilter as OrderStatus },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-primary">Pedidos</h1>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f}
            href={f === "TODOS" ? "/admin/pedidos" : `/admin/pedidos?status=${f}`}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              activeFilter === f
                ? "bg-primary text-white"
                : "bg-white text-muted hover:bg-black/5"
            )}
          >
            {f === "TODOS" ? "Todos" : STATUS_LABELS[f]}
          </Link>
        ))}
      </div>

      {/* overflow-x-auto (not overflow-hidden): lets the table scroll within
          its own card on narrow phones instead of stretching the whole
          admin layout. */}
      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-black/[0.02] text-left text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Pedido</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Pago</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order) => {
              const label = order.id.slice(-8).toUpperCase();
              return (
                <tr key={order.id} className="hover:bg-black/[0.015]">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/pedidos/${order.id}`}
                      className="font-medium text-link hover:underline"
                    >
                      #{label}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-text">{order.customerName}</td>
                  <td className="px-4 py-3 text-muted">
                    {order.paymentMethod === "MERCADO_PAGO"
                      ? "Mercado Pago"
                      : "Transferencia"}
                  </td>
                  <td className="px-4 py-3 text-text">
                    {formatCurrency(order.total.toString())}
                  </td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {order.createdAt.toLocaleDateString("es-AR")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DeleteOrderButton orderId={order.id} orderLabel={label} />
                  </td>
                </tr>
              );
            })}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted">
                  No hay pedidos en este estado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
