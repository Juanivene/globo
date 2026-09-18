import Image from "next/image";
import Link from "next/link";
import { Plane } from "lucide-react";
import { footer, nav } from "@/lib/content/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { whatsapp } from "@/lib/content/site";
import { WhatsAppButton } from "@/components/shop/WhatsAppButton";

export function Footer() {
  const hasWhatsapp = Boolean(whatsappUrl("x"));

  return (
    <footer className="night-panel relative mt-16 overflow-hidden">
      {/* Misma línea dorada que el header, cerrando la página de forma simétrica. */}
      <div
        aria-hidden
        className="h-px bg-linear-to-r from-transparent via-accent/50 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full border border-accent/10"
      />

      <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt=""
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="font-heading text-lg font-bold text-accent">Globo Arg</span>
          </Link>
          <p className="mt-3 flex items-start gap-1.5 text-sm text-white/65">
            <Plane size={14} className="mt-1 shrink-0 text-accent/70" />
            {footer.tagline}
          </p>
        </div>

        <nav aria-label="Pie de página">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
            Explorar
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {[{ label: "Inicio", href: "/" }, ...nav].map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-white/75 transition-colors hover:text-accent"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {hasWhatsapp && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
              {footer.contactTitle}
            </p>
            <p className="mt-3 text-sm text-white/75">{footer.contactBody}</p>
            <WhatsAppButton message={whatsapp.doubt.message} className="mt-3">
              {whatsapp.doubt.cta}
            </WhatsAppButton>
          </div>
        )}
      </div>

      <p className="relative border-t border-white/10 px-4 py-4 text-center text-xs text-white/55">
        © {new Date().getFullYear()} Globo Arg. Todos los derechos reservados.
      </p>
    </footer>
  );
}
