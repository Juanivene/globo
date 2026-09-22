import type { LucideIcon } from "lucide-react";

type Tone = "success" | "pending" | "error";

/**
 * Tarjeta de cierre de la compra: pago confirmado, pago en revisión o pago
 * rechazado.
 *
 * Las tres páginas tenían el mismo bloque copiado con retoques —un halo, un
 * ícono, un título, un texto— y se habían ido separando entre sí. Acá viven una
 * sola vez: cambia el tono y nada más, así el final de la compra se siente
 * igual salga como salga.
 */
const TONES: Record<Tone, { wash: string; halo: string; icon: string }> = {
  success: {
    wash: "from-green-500/12",
    halo: "bg-green-500/10",
    icon: "text-green-600",
  },
  pending: {
    wash: "from-accent/15",
    halo: "bg-accent/12",
    icon: "text-bronze",
  },
  error: {
    wash: "from-red-500/12",
    halo: "bg-red-500/10",
    icon: "text-red-600",
  },
};

export function OutcomeCard({
  tone,
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  tone: Tone;
  icon: LucideIcon;
  title: string;
  subtitle: React.ReactNode;
  children?: React.ReactNode;
}) {
  const t = TONES[tone];

  return (
    <div className="mx-auto max-w-xl">
      <div className="card-globo relative overflow-hidden px-6 py-10 text-center sm:px-8">
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b ${t.wash} to-transparent`}
        />

        <div className="relative space-y-6">
          <span
            style={{ "--i": 0 } as React.CSSProperties}
            className="stagger-rise relative mx-auto flex h-18 w-18 items-center justify-center"
          >
            {/* Halo que se expande una vez, como un "listo" visual. */}
            <span
              aria-hidden
              className={`absolute inset-0 rounded-full ${t.halo} motion-safe:animate-[ping-ring_1.4s_var(--ease-out-soft)_1_forwards]`}
            />
            <span aria-hidden className={`absolute inset-0 rounded-full ${t.halo}`} />
            <Icon size={42} className={`relative ${t.icon}`} />
          </span>

          <div style={{ "--i": 1 } as React.CSSProperties} className="stagger-rise">
            <h1 className="font-heading text-2xl font-bold text-primary sm:text-3xl">
              {title}
            </h1>
            <div className="mt-2 text-sm text-muted">{subtitle}</div>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
