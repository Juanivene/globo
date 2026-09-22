import Image from "next/image";
import { bannerImageUrl } from "@/lib/images";
import { howItWorks } from "@/lib/content/site";
import { ContentIcon } from "@/components/shop/ContentIcon";

/**
 * Franja "Cómo funciona". Va *debajo* del catálogo a propósito: cuenta el
 * recorrido del pedido sin empujar los productos hacia abajo ni competir con
 * la grilla. El texto vive en `lib/content/site.ts`.
 *
 * Los tres pasos van unidos por una línea vertical, no sueltos: se leen como
 * un recorrido con principio y final, que es justo lo que se quiere explicar.
 */
export function ShippingBand() {
  const photo = bannerImageUrl();

  return (
    // Sin `reveal` en la sección entera: los pasos ya entran de a uno y, si el
    // contenedor también se desvaneciera, las dos opacidades se multiplicarían
    // y el bloque se vería apagado a mitad de camino.
    <section className="card-globo overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2">
        {/* El panel noche queda debajo de la foto: sostiene el bloque mientras
            la imagen carga, en vez de un rectángulo gris. */}
        <div className="night-panel relative h-52 sm:h-auto sm:min-h-full">
          <Image
            src={photo}
            alt={howItWorks.imageAlt}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover"
          />
          {/* Lavado con el color de marca para que la foto se lea como parte
              de la paleta y no como una imagen de stock pegada. Suave a
              propósito: más cargado apagaba la madera y la caja de USPS, que
              es justo lo que la foto viene a mostrar. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-primary/14 mix-blend-multiply"
          />
        </div>

        <div className="flex flex-col justify-center gap-6 p-6 sm:p-8 lg:p-10">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-bronze">
              <span aria-hidden className="h-px w-6 bg-bronze/50" />
              {howItWorks.eyebrow}
            </p>
            <h2 className="mt-1.5 font-heading text-xl font-bold text-primary sm:text-2xl">
              {howItWorks.title}
            </h2>
          </div>

          <ol className="relative space-y-6">
            {/* Línea que enhebra los tres pasos. Arranca y termina en el centro
                de los círculos de los extremos, no en el borde del bloque. */}
            <span
              aria-hidden
              className="absolute bottom-5 left-5 top-5 w-px bg-linear-to-b from-accent/50 via-accent/30 to-transparent"
            />
            {howItWorks.steps.map(({ icon, title, body }, i) => (
              <li
                key={title}
                style={{ "--i": i } as React.CSSProperties}
                className="reveal-item relative flex gap-4"
              >
                <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/15 text-bronze">
                  <ContentIcon name={icon} size={18} />
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white tabular-nums">
                    {i + 1}
                  </span>
                </span>
                <div className="pt-0.5">
                  <p className="font-heading text-base font-semibold text-text">
                    {title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
