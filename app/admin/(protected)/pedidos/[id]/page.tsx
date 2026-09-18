import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { PROVINCE_LABELS } from "@/lib/shipping/provinces";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { ProvinceSelect } from "@/components/admin/ProvinceSelect";
import { DeleteOrderButton } from "@/components/admin/DeleteOrderButton";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) notFound();

  const label = order.id.slice(-8).toUpperCase();

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Pedido #{label}</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted">
            {order.createdAt.toLocaleString("es-AR")}
          </span>
          <DeleteOrderButton
            orderId={order.id}
            orderLabel={label}
            redirectTo="/admin/pedidos"
            variant="button"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-muted">Estado</h2>
          <OrderStatusSelect orderId={order.id} status={order.status} />
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-muted">
            Provincia (para envío)
          </h2>
          <ProvinceSelect orderId={order.id} province={order.province} />
        </div>
      </div>

      <div className="rounded-xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-muted">Cliente</h2>
        <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted">Nombre</dt>
            <dd className="text-text">{order.customerName}</dd>
          </div>
          <div>
            <dt className="text-muted">Email</dt>
            <dd className="text-text">{order.customerEmail}</dd>
          </div>
          <div>
            <dt className="text-muted">Teléfono</dt>
            <dd className="text-text">{order.customerPhone}</dd>
          </div>
          <div>
            <dt className="text-muted">Dirección</dt>
            <dd className="text-text">
              {order.address} (CP {order.postalCode}, {PROVINCE_LABELS[order.province]})
            </dd>
          </div>
        </dl>
      </div>

      <div className="rounded-xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-muted">Ítems</h2>
        {/* overflow-x-auto: lets a long item list scroll within the card on
            narrow phones instead of stretching the whole admin layout. */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-xs uppercase text-muted">
              <tr>
                <th className="py-2">Producto</th>
                <th className="py-2">Cant.</th>
                <th className="py-2 text-right">Precio</th>
                <th className="py-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-2 text-text">{item.titleSnapshot}</td>
                  <td className="py-2 text-muted">{item.quantity}</td>
                  <td className="py-2 text-right text-text">
                    {formatCurrency(item.priceSnapshot.toString())}
                  </td>
                  <td className="py-2 text-right text-text">
                    {formatCurrency(
                      (Number(item.priceSnapshot) * item.quantity).toString()
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 space-y-1 border-t border-border pt-4 text-sm">
          <div className="flex justify-between text-muted">
            <span>Subtotal</span>
            <span>{formatCurrency(order.itemsSubtotal.toString())}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>Envío</span>
            <span>{formatCurrency(order.shippingCost.toString())}</span>
          </div>
          <div className="flex justify-between text-base font-semibold text-text">
            <span>Total</span>
            <span>{formatCurrency(order.total.toString())}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>Método de pago</span>
            <span>
              {order.paymentMethod === "MERCADO_PAGO"
                ? "Mercado Pago"
                : "Transferencia"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
