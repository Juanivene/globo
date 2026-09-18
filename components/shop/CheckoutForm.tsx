"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MessageCircle, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/lib/cart/store";

type PaymentMethod = "MERCADO_PAGO" | "TRANSFERENCIA";

export function CheckoutForm() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const hasHydrated = useCartStore((s) => s.hasHydrated);
  const clear = useCartStore((s) => s.clear);

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("MERCADO_PAGO");

  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [shippingError, setShippingError] = useState<string | null>(null);
  const [quoting, setQuoting] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const isValidCp = /^\d{4}$/.test(postalCode) && items.length > 0;

  useEffect(() => {
    if (!isValidCp) return;
    const controller = new AbortController();

    async function fetchQuote() {
      setQuoting(true);
      setShippingError(null);
      try {
        const res = await fetch("/api/shipping/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            postalCode,
            items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Error al calcular el envío");
        setShippingCost(data.shippingCost);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setShippingCost(null);
        setShippingError(err instanceof Error ? err.message : "Error al calcular el envío");
      } finally {
        setQuoting(false);
      }
    }

    fetchQuote();
    return () => controller.abort();
  }, [postalCode, items, isValidCp]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidCp || shippingCost === null) {
      toast.error("Ingresá un código postal válido para calcular el envío");
      return;
    }
    setSubmitting(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          address,
          postalCode,
          paymentMethod,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No se pudo crear el pedido");

      if (paymentMethod === "MERCADO_PAGO") {
        const mpRes = await fetch("/api/checkout/mercadopago", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: data.orderId }),
        });
        const mpData = await mpRes.json();
        if (!mpRes.ok || !mpData.initPoint) {
          throw new Error(mpData.error ?? "No se pudo iniciar el pago con Mercado Pago");
        }
        clear();
        window.location.href = mpData.initPoint;
        return;
      }

      // Transferencia: go straight to confirmation with WhatsApp link
      clear();
      router.push(`/checkout/exito?orderId=${data.orderId}&metodo=transferencia`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ocurrió un error");
    } finally {
      setSubmitting(false);
    }
  }

  if (!hasHydrated) return null;

  if (items.length === 0) {
    return (
      <p className="rounded-xl bg-white p-8 text-center text-muted shadow-sm">
        Tu carrito está vacío.
      </p>
    );
  }

  const total =
    isValidCp && shippingCost !== null ? subtotal + shippingCost : null;

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-primary">Tus datos</h2>
          <div className="space-y-4">
            <div>
              <Label>Nombre completo</Label>
              <Input
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label>Email</Label>
                <Input
                  required
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
              </div>
              <div>
                <Label>Teléfono</Label>
                <Input
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="11 2345 6789"
                />
              </div>
            </div>
            <div>
              <Label>Dirección</Label>
              <Input
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Calle, número, piso/depto"
              />
            </div>
            <div className="max-w-[160px]">
              <Label>Código postal</Label>
              <Input
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="1425"
                inputMode="numeric"
              />
              {quoting && <p className="mt-1 text-xs text-muted">Calculando envío...</p>}
              {shippingError && (
                <p className="mt-1 text-xs text-red-600">{shippingError}</p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-primary">
            Método de pago
          </h2>
          <div className="space-y-2">
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                paymentMethod === "MERCADO_PAGO"
                  ? "border-accent bg-accent/10"
                  : "border-border"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === "MERCADO_PAGO"}
                onChange={() => setPaymentMethod("MERCADO_PAGO")}
                className="accent-accent"
              />
              <CreditCard size={18} className="text-primary" />
              <div>
                <p className="text-sm font-medium text-text">Mercado Pago</p>
                <p className="text-xs text-muted">
                  Pagás online, todas las tarjetas y medios disponibles.
                </p>
              </div>
            </label>
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                paymentMethod === "TRANSFERENCIA"
                  ? "border-accent bg-accent/10"
                  : "border-border"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === "TRANSFERENCIA"}
                onChange={() => setPaymentMethod("TRANSFERENCIA")}
                className="accent-accent"
              />
              <MessageCircle size={18} className="text-primary" />
              <div>
                <p className="text-sm font-medium text-text">Transferencia</p>
                <p className="text-xs text-muted">
                  Coordinás el pago por WhatsApp con nosotros.
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="h-fit space-y-4 rounded-xl bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-primary">Resumen</h2>
        <ul className="space-y-2 text-sm">
          {items.map((i) => (
            <li key={i.productId} className="flex justify-between text-muted">
              <span className="line-clamp-1">
                {i.title} x{i.quantity}
              </span>
              <span>{formatCurrency(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="space-y-1 border-t border-border pt-3 text-sm">
          <div className="flex justify-between text-muted">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>Envío</span>
            <span>
              {isValidCp && shippingCost !== null
                ? formatCurrency(shippingCost)
                : "—"}
            </span>
          </div>
          <div className="flex justify-between text-base font-semibold text-text">
            <span>Total</span>
            <span>{total !== null ? formatCurrency(total) : "—"}</span>
          </div>
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={submitting}>
          {submitting ? "Procesando..." : "Confirmar pedido"}
        </Button>
      </div>
    </form>
  );
}
