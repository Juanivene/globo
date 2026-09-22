import Image from "next/image";
import Link from "next/link";
import { Plane } from "lucide-react";
import { footer, nav, whatsapp } from "@/lib/content/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppButton } from "@/components/shop/WhatsAppButton";

export function Footer() {
  const hasWhatsapp = Boolean(whatsappUrl("x"));

  return (
    <footer className="night-panel meridians mt-20 overflow-hidden">
      {/* Mismo hilo dorado que cierra el header, cerrando la página de forma
          simétrica. */}
      <div
        aria-hidden
        className="h-px bg-linear-to-r from-transparent via-accent/55 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full border border-accent/10"
      />

      <div className="shell relative grid gap-10 py-12 sm:grid-cols-3">
        <div>
          <Link href="/" className="group inline-flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt=""
              width={34}
              height={34}
              className="rounded-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
            />
            <span className="font-heading text-lg font-bold text-white">
              Globo <span className="text-gold-gradient">Arg</span>
            </span>
          </Link>
          <p className="mt-4 flex items-start gap-2 text-sm text-white/65">
            <Plane size={14} className="mt-1 shrink-0 text-accent/70" />
            {footer.tagline}
          </p>
        </div>

        <nav aria-label="Pie de página">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/45">
            Explorar
          </p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[{ label: "Inicio", href: "/" }, ...nav].map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="group inline-flex items-center gap-2 text-white/75 transition-colors duration-200 hover:text-accent"
                >
                  <span
                    aria-hidden
                    className="h-px w-0 bg-accent transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-4"
                  />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {hasWhatsapp && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/45">
              {footer.contactTitle}
            </p>
            <p className="mt-4 text-sm text-white/75">{footer.contactBody}</p>
            <WhatsAppButton message={whatsapp.doubt.message} className="mt-4">
              {whatsapp.doubt.cta}
            </WhatsAppButton>
          </div>
        )}
      </div>

      <p className="relative border-t border-white/10 px-4 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Globo Arg. Todos los derechos reservados.
      </p>
    </footer>
  );
}
