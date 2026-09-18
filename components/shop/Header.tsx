import Link from "next/link";
import Image from "next/image";
import { CartBadge } from "@/components/shop/CartBadge";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { HeaderNav } from "@/components/shop/HeaderNav";

export function Header() {
  return (
    <>
      {/*
        `site-header` is anchored in globals.css so it stays put while page
        content slides underneath it — the user keeps one fixed reference point.
      */}
      <header
        style={{ viewTransitionName: "site-header" }}
        className="night-panel sticky top-0 z-30 shadow-md"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link
            href="/"
            transitionTypes={["nav-back"]}
            className="group flex items-center gap-2.5"
          >
            <span className="relative flex h-9 w-9 items-center justify-center">
              {/* Gold ring that widens on hover, echoing the logo's orbit. */}
              <span
                aria-hidden
                className="absolute inset-0 rounded-full ring-1 ring-accent/40 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-inset-0.75 group-hover:ring-accent/70"
              />
              <Image
                src="/logo.png"
                alt="Globo Arg"
                width={36}
                height={36}
                className="rounded-full"
                priority
              />
            </span>
            <span className="font-heading text-xl font-bold tracking-tight text-accent">
              Globo Arg
            </span>
          </Link>
          <HeaderNav className="hidden sm:block" />
          <CartBadge />
        </div>
        {/* En el celular la navegación baja a su propia fila: el logo, los dos links
            y el carrito no entran juntos en 360 px. */}
        <HeaderNav className="flex justify-center px-4 pb-2.5 sm:hidden" />
        {/* Hairline that ties the header to the gold in the logo. */}
        <div
          aria-hidden
          className="h-px bg-linear-to-r from-transparent via-accent/50 to-transparent"
        />
      </header>

      <CartDrawer />
    </>
  );
}
