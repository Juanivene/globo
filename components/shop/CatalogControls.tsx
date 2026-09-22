"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SectionOption {
  slug: string;
  name: string;
}

/**
 * Buscador + filtro por sección del catálogo.
 *
 * Los dos controles van juntos dentro de una misma tarjeta: son una sola
 * decisión ("qué quiero ver"), y agrupados se leen como un panel de filtros en
 * vez de como dos elementos sueltos flotando sobre el fondo.
 *
 * En el celular las secciones no se apilan en varias filas: corren en una tira
 * horizontal, así los filtros nunca empujan la grilla fuera de la pantalla.
 */
export function CatalogControls({
  sections,
  /**
   * Which chip to mark active. Needed on `/secciones/[slug]`, where the section
   * lives in the path instead of the `?seccion` param — without it that page
   * would highlight "Todos".
   */
  activeSection,
}: {
  sections: SectionOption[];
  activeSection?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQ = searchParams.get("q") ?? "";
  const currentSection = activeSection ?? searchParams.get("seccion") ?? "";
  const [q, setQ] = useState(currentQ);
  // Marks the navigation as a Transition so the grid keeps showing previous
  // results (and stays interactive) while the new ones are fetched.
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (q === currentQ) return;
      const params = new URLSearchParams(searchParams.toString());
      if (q) params.set("q", q);
      else params.delete("q");
      startTransition(() => router.push(`/products?${params.toString()}`));
    }, 350);
    return () => clearTimeout(timeout);
    // Only re-run the debounce timer when the typed query changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  function selectSection(slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) params.set("seccion", slug);
    else params.delete("seccion");
    startTransition(() => router.push(`/products?${params.toString()}`));
  }

  const chips = [{ slug: "", name: "Todos" }, ...sections];

  return (
    <div className="card-globo space-y-4 p-3 sm:p-4">
      <div className="group relative">
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted transition-colors duration-200 group-focus-within:text-link"
        />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar productos..."
          aria-label="Buscar productos"
          className="w-full rounded-xl border border-border bg-surface-light py-3 pl-12 pr-10 text-sm text-text outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-muted/80 focus:border-link focus:bg-card focus:ring-2 focus:ring-link/20"
        />
        {q && (
          <button
            type="button"
            onClick={() => setQ("")}
            aria-label="Limpiar búsqueda"
            className="animate-fade-in absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full p-1.5 text-muted transition-colors hover:bg-primary/8 hover:text-text"
          >
            <X size={15} />
          </button>
        )}
        {/* Hilo de progreso metido dentro del propio radio del input. */}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-4 bottom-0 h-0.5 overflow-hidden rounded-full transition-opacity duration-200",
            isPending ? "opacity-100" : "opacity-0"
          )}
        >
          <span className="block h-full w-1/4 animate-[indeterminate_1s_ease-in-out_infinite] bg-accent" />
        </span>
      </div>

      {sections.length > 0 && (
        <div
          role="group"
          aria-label="Filtrar por sección"
          className="-mx-3 flex gap-2 overflow-x-auto px-3 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden"
        >
          {chips.map((s) => {
            const active = currentSection === s.slug;
            return (
              <button
                key={s.slug || "all"}
                onClick={() => selectSection(s.slug)}
                aria-pressed={active}
                className={cn(
                  "shrink-0 cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-95",
                  active
                    ? "bg-primary text-white shadow-(--shadow-chip-active)"
                    : "border border-border bg-surface-light text-muted hover:-translate-y-0.5 hover:border-primary/30 hover:bg-card hover:text-primary"
                )}
              >
                {s.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
