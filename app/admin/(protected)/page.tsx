import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/ui/Badge";

export default async function AdminDashboardPage() {
  const [pendingCount, productCount, enabledCount, recentOrders] =
    await Promise.all([
      prisma.order.count({ where: { status: "PENDIENTE" } }),
      prisma.product.count(),
      prisma.product.count({ where: { enabled: true } }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
    ]);

  const stats = [
    { label: "Pedidos pendientes", value: pendingCount },
    { label: "Productos habilitados", value: enabledCount },
    { label: "Productos totales", value: productCount },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-primary">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-muted">{s.label}</p>
            <p className="mt-1 text-3xl font-bold text-primary">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-primary">
            Últimos pedidos
          </h2>
          <Link
            href="/admin/pedidos"
            className="text-sm text-link hover:underline"
          >
            Ver todos
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-muted">Todavía no hay pedidos.</p>
        ) : (
          <ul className="divide-y divide-border">
            {recentOrders.map((order) => (
              <li key={order.id} className="py-3">
                <Link
                  href={`/admin/pedidos/${order.id}`}
                  className="flex items-center justify-between gap-4 hover:opacity-70"
                >
                  <div>
                    <p className="text-sm font-medium text-text">
                      {order.customerName}
                    </p>
                    <p className="text-xs text-muted">
                      #{order.id.slice(-8).toUpperCase()} ·{" "}
                      {order.createdAt.toLocaleDateString("es-AR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-text">
                      {formatCurrency(order.total.toString())}
                    </span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
