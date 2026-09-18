import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function CheckoutFailurePage() {
  return (
    <div className="mx-auto max-w-lg space-y-6 rounded-xl bg-white p-8 text-center shadow-sm">
      <XCircle size={48} className="mx-auto text-red-600" />
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary">
          El pago no se pudo completar
        </h1>
        <p className="mt-1 text-sm text-muted">
          No te preocupes, no se realizó ningún cargo. Podés intentar de nuevo.
        </p>
      </div>
      <Link href="/checkout">
        <Button size="lg" className="w-full">
          Volver a intentar
        </Button>
      </Link>
      <Link href="/" className="block text-sm text-glow hover:underline">
        Volver al catálogo
      </Link>
    </div>
  );
}
