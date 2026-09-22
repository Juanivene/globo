import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { hero } from "@/lib/content/site";

/**
 * Portada de la home.
 *
 * Es la escena del logo hecha sección: espacio navy, las luces doradas arriba
 * y el halo celeste abajo. A la izquierda el mensaje y los dos botones; a la
 * derecha la foto, que cuenta la historia (un pedido de USA que llegó).
 *
 * Los datos de confianza ("envío a todo el país", etc.) ya no viven acá: se
 * fueron a `TrustBar`, justo debajo, para que la portada tenga un solo foco —
 * el título y el botón — y no cinco cosas compitiendo.
 */
export function ShopHero() {
  return (
    <section className="night-panel aurora meridians relative isolate overflow-hidden rounded-3xl shadow-(--shadow-panel)">
      {/* Anillos concéntricos que recuerdan la órbita del logo. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-28 -top-32 h-80 w-80 rounded-full border border-accent/20" />
        <div className="absolute -left-14 -top-20 h-56 w-56 rounded-full border border-accent/10" />
        <div className="absolute -bottom-36 left-1/3 h-72 w-72 rounded-full border border-glow/25" />
      </div>

      {/* La ruta del pedido: un arco punteado que baja de Norteamérica al sur,
          igual que las luces del logo. Se dibuja solo, una vez. */}
      <svg
        aria-hidden
        viewBox="0 0 600 300"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
      >
        <path
          d="M40 40 C 220 20, 360 120, 560 260"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          strokeDasharray="5 9"
          strokeLinecap="round"
          className="opacity-45 motion-safe:animate-[dash-travel_9s_linear_infinite]"
        />
      </svg>

      <div className="relative grid items-center gap-9 px-5 py-9 sm:px-10 sm:py-14 md:grid-cols-[1.05fr_0.95fr] md:gap-12 lg:px-14 lg:py-18">
        <div>
          <p
            style={{ "--i": 0 } as React.CSSProperties}
            className="stagger-rise inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/12 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-accent"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent motion-safe:animate-[ping-ring_2.4s_var(--ease-out-soft)_infinite]" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            {hero.badge}
          </p>

          <h1
            style={{ "--i": 1 } as React.CSSProperties}
            className="stagger-rise mt-5 font-heading text-3xl font-bold leading-[1.08] text-white sm:text-5xl lg:text-6xl"
          >
            {hero.titleStart}{" "}
            <span className="text-gold-gradient">{hero.titleAccent}</span>
          </h1>

          <p
            style={{ "--i": 2 } as React.CSSProperties}
            className="stagger-rise mt-4 max-w-md text-base leading-relaxed text-white/75 sm:text-lg"
          >
            {hero.subtitle}
          </p>

          <div
            style={{ "--i": 3 } as React.CSSProperties}
            // En el celular los dos botones van a todo el ancho: mismo tamaño,
            // mismo borde izquierdo y un área de toque cómoda. Sueltos y con
            // anchos distintos quedaban desparejos justo en la decisión más
            // importante de la portada.
            className="stagger-rise mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
          >
            <Link
              href="/products"
              transitionTypes={["nav-forward"]}
              className="sheen group inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-7 py-3.5 text-base font-semibold text-primary shadow-(--shadow-accent) transition-[background-color,box-shadow,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-(--shadow-accent-hover) active:translate-y-0 active:scale-[0.98]"
            >
              {hero.primaryCta}
              <ArrowRight
                size={18}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/quienes-somos"
              transitionTypes={["nav-forward"]}
              className="inline-flex items-center justify-center rounded-xl border border-white/25 px-6 py-3.5 text-base font-medium text-white transition-[background-color,border-color] duration-200 hover:border-white/50 hover:bg-white/10"
            >
              {hero.secondaryCta}
            </Link>
          </div>
        </div>

        <div
          style={{ "--i": 3 } as React.CSSProperties}
          className="stagger-rise relative"
        >
          {/* Resplandor dorado detrás de la foto: la despega del panel sin
              necesidad de un marco duro. */}
          <div
            aria-hidden
            className="absolute -inset-6 -z-10 rounded-[2rem] bg-accent/12 blur-2xl"
          />
          <div className="relative aspect-4/3 overflow-hidden rounded-2xl ring-1 ring-white/20 md:aspect-square">
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
      </div>
    </section>
  );
}
