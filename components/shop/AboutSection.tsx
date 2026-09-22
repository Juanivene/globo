import Image from "next/image";
import { about } from "@/lib/content/site";
import { aboutImageUrl } from "@/lib/images";
import { ContentIcon } from "@/components/shop/ContentIcon";
import { SectionHeading } from "@/components/shop/SectionHeading";

/**
 * Bloque principal de "Quiénes somos": presentación con foto y las razones para
 * comprar acá. El texto vive en `lib/content/site.ts`.
 */
export function AboutSection() {
  const photo = aboutImageUrl();

  return (
    <div className="space-y-12">
      <section className="card-globo overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-5">
          {/* Igual que en la franja de "cómo funciona": el panel noche queda
              debajo mientras la foto carga. */}
          <div className="night-panel relative h-60 md:col-span-2 md:h-auto md:min-h-88">
            <Image
              src={photo}
              alt={about.imageAlt}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover object-center"
            />
          </div>

          <div className="flex flex-col justify-center gap-5 p-6 md:col-span-3 md:p-10">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-bronze">
                <span aria-hidden className="h-px w-6 bg-bronze/50" />
                {about.eyebrow}
              </p>
              <h1 className="mt-1.5 font-heading text-2xl font-bold leading-tight text-primary sm:text-3xl">
                {about.title}
              </h1>
            </div>
            <div className="space-y-3.5 text-base leading-relaxed text-muted">
              {about.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="reasons-title" className="space-y-5">
        <SectionHeading id="reasons-title" title={about.reasonsTitle} />
        <ul className="grid gap-4 sm:grid-cols-3">
          {about.reasons.map((r, i) => (
            <li
              key={r.title}
              style={{ "--i": i } as React.CSSProperties}
              className="reveal-item card-globo flex gap-4 p-5 sm:flex-col sm:gap-4 sm:p-6"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/15 text-bronze ring-1 ring-accent/20">
                <ContentIcon name={r.icon} size={20} />
              </span>
              <div>
                <p className="font-heading text-base font-semibold text-text">
                  {r.title}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{r.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
