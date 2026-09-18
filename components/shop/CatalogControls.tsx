"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SectionOption {
  slug: string;
  name: string;
}

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
    <div className="space-y-4">
      <div className="group relative">
        <Search
          size={18}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted transition-colors group-focus-within:text-link"
        />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar productos..."
          aria-label="Buscar productos"
          className="w-full rounded-full border border-border bg-card py-2.5 pl-11 pr-10 text-sm shadow-(--shadow-card) outline-none transition-[border-color,box-shadow] duration-200 focus:border-link focus:ring-2 focus:ring-link/25"
        />
        {q && (
          <button
            type="button"
            onClick={() => setQ("")}
            aria-label="Limpiar búsqueda"
            className="animate-fade-in absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full p-1 text-muted transition-colors hover:bg-black/5 hover:text-text"
          >
            <X size={15} />
          </button>
        )}
        {/* Progress hairline tucked into the input's own border radius. */}
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
        <div className="flex flex-wrap gap-2">
          {chips.map((s) => {
            const active = currentSection === s.slug;
            return (
              <button
                key={s.slug || "all"}
                onClick={() => selectSection(s.slug)}
                aria-pressed={active}
                className={cn(
                  "cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-95",
                  active
                    ? "bg-primary text-white shadow-(--shadow-chip-active)"
                    : "border border-border bg-card text-muted hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary"
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
