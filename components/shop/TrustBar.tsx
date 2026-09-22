import { hero } from "@/lib/content/site";
import { ContentIcon } from "@/components/shop/ContentIcon";

/**
 * Franja de confianza, justo debajo de la portada.
 *
 * Son los mismos tres datos que antes iban apretados dentro del hero, como
 * texto chico sobre la foto. Sacados a su propia franja se leen de un vistazo
 * y responden las tres dudas que frenan una primera compra (de dónde viene,
 * si llega a mi ciudad, cómo pago) antes de que el usuario vea un precio.
 */
export function TrustBar() {
  return (
    <ul className="grid gap-3 sm:grid-cols-3">
      {hero.chips.map(({ icon, label }, i) => (
        <li
          key={label}
          style={{ "--i": i } as React.CSSProperties}
          className="reveal-item card-globo flex items-center gap-3 px-4 py-3.5"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/15 text-bronze">
            <ContentIcon name={icon} size={17} />
          </span>
          <span className="text-sm font-medium text-text">{label}</span>
        </li>
      ))}
    </ul>
  );
}
