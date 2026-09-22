"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { nav } from "@/lib/content/site";

/**
 * Links principales del header. Marca la página actual (también para las
 * sub-rutas: `/products?...` y `/productos/[slug]` cuentan como "Productos").
 */
export function HeaderNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Principal" className={className}>
      <ul className="flex items-center gap-1">
        {nav.map(({ label, href }) => {
          const active =
            pathname === href ||
            (href === "/products" &&
              (pathname.startsWith("/productos") || pathname.startsWith("/secciones")));
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative block rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-200",
                  active ? "bg-white/12 text-white" : "text-white/70 hover:text-white"
                )}
              >
                {/* Fondo que crece desde el centro al pasar por encima, en vez
                    de un cambio seco de color. */}
                {!active && (
                  <span
                    aria-hidden
                    className="absolute inset-0 origin-center scale-75 rounded-full bg-white/10 opacity-0 transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100 group-hover:opacity-100"
                  />
                )}
                <span className="relative">{label}</span>
                {active && (
                  <span
                    aria-hidden
                    className="absolute inset-x-3.5 -bottom-px h-0.5 rounded-full bg-accent"
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
