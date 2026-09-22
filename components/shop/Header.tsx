import Link from "next/link";
import Image from "next/image";
import { CartBadge } from "@/components/shop/CartBadge";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { HeaderNav } from "@/components/shop/HeaderNav";

export function Header() {
  return (
    <>
      {/*
        `site-header` está anclado en globals.css para que quede quieto mientras
        el contenido se desliza por debajo: el usuario conserva una referencia.
      */}
      <header
        style={{ viewTransitionName: "site-header" }}
        className="night-panel meridians sticky top-0 z-30"
      >
        {/*
          Sombra que aparece sola al bajar. Va por scroll-driven animation sobre
          la opacidad de una capa (propiedad compuesta por la GPU), no por un
          listener de scroll: no hay JS escuchando ni trabajo por frame.
        */}
        <span
          aria-hidden
          className="scroll-shadow pointer-events-none absolute inset-x-0 -bottom-6 h-6 bg-linear-to-b from-bg/25 to-transparent"
        />

        <div className="shell flex items-center justify-between gap-3 py-3">
          <Link
            href="/"
            transitionTypes={["nav-back"]}
            className="group flex items-center gap-2.5"
          >
            <span className="relative flex h-10 w-10 items-center justify-center">
              {/* Anillo punteado que orbita el globo, como el halo del logo. */}
              <span
                aria-hidden
                className="absolute -inset-1 rounded-full border border-dashed border-accent/35 transition-[inset,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-inset-1.5 group-hover:border-accent/70 motion-safe:animate-[orbit_40s_linear_infinite]"
              />
              <Image
                src="/logo.png"
                alt="Globo Arg"
                width={40}
                height={40}
                className="rounded-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                priority
              />
            </span>
            <span className="font-heading text-xl font-bold tracking-tight text-white">
              Globo <span className="text-gold-gradient">Arg</span>
            </span>
          </Link>

          <HeaderNav className="hidden sm:block" />
          <CartBadge />
        </div>

        {/* En el celular la navegación baja a su propia fila: el logo, los dos
            links y el carrito no entran juntos en 360 px. */}
        <HeaderNav className="flex justify-center px-4 pb-2.5 sm:hidden" />

        {/* Hilo dorado que cierra el header, el mismo que abre el footer. */}
        <div
          aria-hidden
          className="h-px bg-linear-to-r from-transparent via-accent/55 to-transparent"
        />
      </header>

      <CartDrawer />
    </>
  );
}
