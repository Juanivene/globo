import { CheckoutForm } from "@/components/shop/CheckoutForm";

export default function CheckoutPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-primary">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
