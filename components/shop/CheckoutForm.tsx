"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MessageCircle, CreditCard, Loader2, Truck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { CheckoutProgress } from "@/components/shop/CheckoutProgress";
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
  const [redirecting, setRedirecting] = useState(false);

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
        setRedirecting(true);
        const mpRes = await fetch("/api/checkout/mercadopago", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ draftId: data.draftId }),
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
      setRedirecting(false);
      toast.error(err instanceof Error ? err.message : "Ocurrió un error");
    } finally {
      setSubmitting(false);
    }
  }

  if (!hasHydrated) return <CheckoutFormSkeleton />;

  if (items.length === 0) {
    return (
      <p className="card-globo animate-rise p-8 text-center text-muted">
        Tu carrito está vacío.
      </p>
    );
  }

  const total = isValidCp && shippingCost !== null ? subtotal + shippingCost : null;

  const stepsDone = {
    datos: Boolean(customerName && customerEmail && customerPhone && address),
    envio: isValidCp && shippingCost !== null,
    pago: submitting,
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">
        <CheckoutProgress done={stepsDone} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <section
              style={{ "--i": 0 } as React.CSSProperties}
              className="stagger-rise card-globo p-5"
            >
              <h2 className="mb-4 font-heading text-lg font-semibold text-primary">
                Tus datos
              </h2>
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
                      autoComplete="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Teléfono</Label>
                    <Input
                      required
                      autoComplete="tel"
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
                    autoComplete="street-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Calle, número, piso/depto"
                  />
                </div>
                <div>
                  <Label>Código postal</Label>
                  <div className="max-w-40">
                    <Input
                      required
                      value={postalCode}
                      onChange={(e) =>
                        setPostalCode(e.target.value.replace(/\D/g, "").slice(0, 4))
                      }
                      placeholder="1425"
                      inputMode="numeric"
                      autoComplete="postal-code"
                    />
                  </div>

                  {/* Reserved slot, so the layout never jumps as the quote resolves. */}
                  <div className="mt-2 min-h-5 text-xs">
                    {quoting && (
                      <span className="animate-fade-in flex items-center gap-1.5 text-muted">
                        <Truck size={13} className="text-bronze" />
                        Calculando envío
                        <Skeleton className="h-3 w-14 rounded-full" />
                      </span>
                    )}
                    {!quoting && shippingError && (
                      <span className="animate-fade-in text-red-600">{shippingError}</span>
                    )}
                    {!quoting && !shippingError && shippingCost !== null && (
                      <span className="animate-fade-in text-muted">
                        Envío a CP {postalCode}:{" "}
                        <strong className="font-semibold text-primary">
                          {formatCurrency(shippingCost)}
                        </strong>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section
              style={{ "--i": 1 } as React.CSSProperties}
              className="stagger-rise card-globo p-5"
            >
              <h2 className="mb-4 font-heading text-lg font-semibold text-primary">
                Método de pago
              </h2>
              <div className="space-y-2">
                <PaymentOption
                  checked={paymentMethod === "MERCADO_PAGO"}
                  onSelect={() => setPaymentMethod("MERCADO_PAGO")}
                  icon={<CreditCard size={18} />}
                  title="Mercado Pago"
                  description="Pagás online, todas las tarjetas y medios disponibles."
                />
                <PaymentOption
                  checked={paymentMethod === "TRANSFERENCIA"}
                  onSelect={() => setPaymentMethod("TRANSFERENCIA")}
                  icon={<MessageCircle size={18} />}
                  title="Transferencia"
                  description="Coordinás el pago por WhatsApp con nosotros."
                />
              </div>
            </section>
          </div>

          <section
            style={{ "--i": 2 } as React.CSSProperties}
            className="stagger-rise card-globo h-fit space-y-4 p-5 lg:sticky lg:top-24"
          >
            <h2 className="font-heading text-lg font-semibold text-primary">Resumen</h2>
            <ul className="space-y-2 text-sm">
              {items.map((i) => (
                <li key={i.productId} className="flex justify-between gap-3 text-muted">
                  <span className="line-clamp-1">
                    {i.title} x{i.quantity}
                  </span>
                  <span className="shrink-0 tabular-nums">
                    {formatCurrency(i.price * i.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="space-y-1 border-t border-border pt-3 text-sm">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Envío</span>
                {quoting ? (
                  <Skeleton className="h-4 w-16 rounded-full" />
                ) : (
                  <span className="tabular-nums">
                    {isValidCp && shippingCost !== null
                      ? formatCurrency(shippingCost)
                      : "—"}
                  </span>
                )}
              </div>
              <div className="flex justify-between font-heading text-base font-semibold text-text">
                <span>Total</span>
                <span key={total ?? "empty"} className="animate-fade-in tabular-nums">
                  {total !== null ? formatCurrency(total) : "—"}
                </span>
              </div>
            </div>
            <Button
              type="submit"
              className="sheen w-full transition-transform active:scale-[0.98]"
              size="lg"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Procesando...
                </>
              ) : (
                "Confirmar pedido"
              )}
            </Button>
            <p className="text-center text-xs text-muted">
              No se te cobra nada hasta confirmar el pago.
            </p>
          </section>
        </div>
      </form>

      {redirecting && <MercadoPagoRedirectOverlay />}
    </>
  );
}

function PaymentOption({
  checked,
  onSelect,
  icon,
  title,
  description,
}: {
  checked: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        checked
          ? "border-accent bg-accent/10 shadow-(--shadow-option-active)"
          : "border-border hover:border-primary/30 hover:bg-black/2"
      }`}
    >
      <input
        type="radio"
        name="paymentMethod"
        checked={checked}
        onChange={onSelect}
        className="accent-accent"
      />
      <span
        className={`transition-colors duration-200 ${
          checked ? "text-bronze" : "text-primary"
        }`}
      >
        {icon}
      </span>
      <div>
        <p className="text-sm font-medium text-text">{title}</p>
        <p className="text-xs text-muted">{description}</p>
      </div>
    </label>
  );
}

/**
 * Covers the gap between "Confirmar pedido" and Mercado Pago's own page, which
 * is otherwise a few seconds of a frozen-looking form.
 */
function MercadoPagoRedirectOverlay() {
  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-bg/80 backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <span className="relative flex h-14 w-14 items-center justify-center">
        <span className="absolute inset-0 rounded-full border-2 border-accent/25" />
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-accent" />
        <CreditCard size={20} className="text-accent" />
      </span>
      <div className="text-center">
        <p className="font-heading text-base font-semibold text-white">
          Te llevamos a Mercado Pago
        </p>
        <p className="mt-1 text-sm text-white/60">
          No cierres esta ventana, tarda solo unos segundos.
        </p>
      </div>
    </div>
  );
}

function CheckoutFormSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3" role="status" aria-label="Cargando checkout">
      <div className="space-y-5 lg:col-span-2">
        {[0, 1].map((i) => (
          <div key={i} style={{ "--i": i } as React.CSSProperties} className="stagger-rise card-globo space-y-4 p-5">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-2/3" />
          </div>
        ))}
      </div>
      <div style={{ "--i": 2 } as React.CSSProperties} className="stagger-rise card-globo h-fit space-y-3 p-5">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}
