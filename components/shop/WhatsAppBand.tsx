import { MessageCircleQuestion, SearchX } from "lucide-react";
import { whatsapp } from "@/lib/content/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppButton } from "@/components/shop/WhatsAppButton";

/**
 * Dos salidas a WhatsApp: "no ves el producto" y "tenés una duda". El texto y
 * los mensajes prearmados viven en `lib/content/site.ts`.
 *
 * Sin número de WhatsApp configurado la franja entera se oculta.
 */
export function WhatsAppBand() {
  if (!whatsappUrl("x")) return null;

  const items = [
    { icon: SearchX, ...whatsapp.missing },
    { icon: MessageCircleQuestion, ...whatsapp.doubt },
  ];

  return (
    <section
      aria-label="Contacto por WhatsApp"
      className="night-panel aurora meridians overflow-hidden rounded-3xl p-6 shadow-(--shadow-panel) sm:p-10"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full border border-accent/15"
      />
      <div className="relative grid gap-8 sm:grid-cols-2 sm:gap-10">
        {items.map(({ icon: Icon, title, body, cta, message }, i) => (
          <div
            key={title}
            style={{ "--i": i } as React.CSSProperties}
            className={
              i > 0
                ? "reveal-item flex flex-col items-start gap-3 border-t border-white/15 pt-8 sm:border-l sm:border-t-0 sm:pl-10 sm:pt-0"
                : "reveal-item flex flex-col items-start gap-3"
            }
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/15 text-accent ring-1 ring-accent/25">
              <Icon size={21} />
            </span>
            <div>
              <h2 className="font-heading text-lg font-bold text-white sm:text-xl">
                {title}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-white/70">{body}</p>
            </div>
            <WhatsAppButton message={message} className="mt-auto">
              {cta}
            </WhatsAppButton>
          </div>
        ))}
      </div>
    </section>
  );
}
