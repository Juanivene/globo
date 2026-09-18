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
      className="night-panel relative overflow-hidden rounded-2xl p-6 sm:p-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full border border-accent/15"
      />
      <div className="relative grid gap-6 sm:grid-cols-2 sm:gap-8">
        {items.map(({ icon: Icon, title, body, cta, message }, i) => (
          <div
            key={title}
            className={
              i > 0
                ? "flex flex-col items-start gap-3 border-t border-white/15 pt-6 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0"
                : "flex flex-col items-start gap-3"
            }
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent">
              <Icon size={20} />
            </span>
            <div>
              <h2 className="font-heading text-lg font-bold text-white">{title}</h2>
              <p className="mt-1 text-sm text-white/75">{body}</p>
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
