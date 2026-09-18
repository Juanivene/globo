import Image from "next/image";
import { about } from "@/lib/content/site";
import { aboutImageUrl } from "@/lib/images";
import { ContentIcon } from "@/components/shop/ContentIcon";

/**
 * Bloque principal de "Quiénes somos": presentación con foto y las razones para
 * comprar acá. El texto vive en `lib/content/site.ts`.
 */
export function AboutSection() {
  const photo = aboutImageUrl();

  return (
    <div className="space-y-8">
      <section className="card-globo overflow-hidden">
        <div className={photo ? "grid grid-cols-1 md:grid-cols-5" : ""}>
          {photo && (
            <div className="relative h-56 md:col-span-2 md:h-auto md:min-h-80">
              <Image
                src={photo}
                alt={about.imageAlt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover object-[50%_35%]"
              />
            </div>
          )}

          <div className="flex flex-col justify-center gap-4 p-6 md:col-span-3 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-bronze">
              {about.eyebrow}
            </p>
            <h1 className="font-heading text-2xl font-bold text-primary sm:text-3xl">
              {about.title}
            </h1>
            <div className="space-y-3 text-base leading-relaxed text-muted">
              {about.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="reasons-title" className="space-y-4">
        <h2
          id="reasons-title"
          className="font-heading text-xl font-bold text-primary sm:text-2xl"
        >
          {about.reasonsTitle}
        </h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          {about.reasons.map((r, i) => (
            <li
              key={r.title}
              style={{ "--i": i } as React.CSSProperties}
              className="stagger-rise card-globo flex gap-3 p-5 sm:flex-col sm:gap-4"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/20 text-bronze">
                <ContentIcon name={r.icon} size={19} />
              </span>
              <div>
                <p className="font-heading text-base font-semibold text-text">{r.title}</p>
                <p className="mt-1 text-sm text-muted">{r.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
