import Image from "next/image";
import { bannerImageUrl } from "@/lib/images";
import { howItWorks } from "@/lib/content/site";
import { ContentIcon } from "@/components/shop/ContentIcon";

/**
 * Franja "Cómo funciona". Va *debajo* del catálogo a propósito: cuenta el
 * recorrido del pedido sin empujar los productos hacia abajo ni competir con
 * la grilla. El texto vive en `lib/content/home.ts`.
 */
export function ShippingBand() {
  const photo = bannerImageUrl();

  return (
    <section className="card-globo overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2">
        {photo && (
          <div className="relative h-48 sm:h-auto sm:min-h-65">
            <Image
              src={photo}
              alt={howItWorks.imageAlt}
              fill
              loading="lazy"
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover"
            />
            {/* Lavado con el color de marca para que la foto se lea como parte
                de la paleta y no como una imagen de stock pegada. */}
            <div
              aria-hidden
              className="absolute inset-0 bg-primary/25 mix-blend-multiply"
            />
          </div>
        )}

        <div className="flex flex-col justify-center gap-5 p-6 sm:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-bronze">
              {howItWorks.eyebrow}
            </p>
            <h2 className="mt-1 font-heading text-xl font-bold text-primary sm:text-2xl">
              {howItWorks.title}
            </h2>
          </div>

          <ol className="space-y-4">
            {howItWorks.steps.map(({ icon, title, body }, i) => (
              <li key={title} className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/20 text-bronze">
                  <ContentIcon name={icon} size={17} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-text">
                    <span className="text-bronze">{i + 1}.</span> {title}
                  </p>
                  <p className="text-sm text-muted">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
