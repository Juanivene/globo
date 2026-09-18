import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { hero } from "@/lib/content/site";
import { ContentIcon } from "@/components/shop/ContentIcon";

/**
 * Portada de la home: mensaje + botones a la izquierda, foto a la derecha.
 * La foto va entera (sin filtro encima) porque cuenta la historia: un pedido
 * de USA que llegó a Buenos Aires.
 */
export function ShopHero() {
  return (
    <section className="night-panel relative overflow-hidden rounded-2xl">
      {/* Anillos concéntricos que recuerdan la órbita del logo. Estáticos a
          propósito: una animación en loop gastaría batería en gama media. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-24 -top-28 h-72 w-72 rounded-full border border-accent/20" />
        <div className="absolute -left-12 -top-16 h-52 w-52 rounded-full border border-accent/10" />
        <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full border border-glow/25" />
      </div>

      <div className="relative grid items-center gap-8 p-6 sm:p-8 md:grid-cols-[1.05fr_1fr] md:gap-10 md:p-12">
        <div>
          <p
            style={{ "--i": 0 } as React.CSSProperties}
            className="stagger-rise inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/15 px-3 py-1 text-xs font-medium text-accent"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {hero.badge}
          </p>

          <h1
            style={{ "--i": 1 } as React.CSSProperties}
            className="stagger-rise mt-4 font-heading text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl"
          >
            {hero.titleStart}{" "}
            <span className="text-accent">{hero.titleAccent}</span>
          </h1>

          <p
            style={{ "--i": 2 } as React.CSSProperties}
            className="stagger-rise mt-3 max-w-md text-base text-white/80"
          >
            {hero.subtitle}
          </p>

          <div
            style={{ "--i": 3 } as React.CSSProperties}
            className="stagger-rise mt-6 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/products"
              className="sheen inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-base font-semibold text-primary shadow-(--shadow-accent) transition-[background-color,box-shadow,transform] duration-200 hover:bg-accent-hover hover:shadow-(--shadow-accent-hover) active:scale-[0.98]"
            >
              {hero.primaryCta} <ArrowRight size={18} />
            </Link>
            <Link
              href="/quienes-somos"
              className="inline-flex items-center rounded-xl border border-white/30 px-5 py-3 text-base font-medium text-white transition-colors duration-200 hover:bg-white/10"
            >
              {hero.secondaryCta}
            </Link>
          </div>

          <ul
            style={{ "--i": 4 } as React.CSSProperties}
            className="stagger-rise mt-6 flex flex-wrap gap-x-5 gap-y-2"
          >
            {hero.chips.map(({ icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-1.5 text-xs font-medium text-white/75"
              >
                <ContentIcon name={icon} size={14} className="text-accent" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div
          style={{ "--i": 2 } as React.CSSProperties}
          className="stagger-rise relative aspect-4/3 overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/20 md:aspect-square"
        >
          <Image
            src="/images/caja-recibido.jpg"
            alt={hero.imageAlt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 45vw"
            className="object-cover object-[50%_60%]"
          />
        </div>
      </div>
    </section>
  );
}
