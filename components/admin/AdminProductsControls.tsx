"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SectionOption {
  slug: string;
  name: string;
}

export function AdminProductsControls({ sections }: { sections: SectionOption[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQ = searchParams.get("q") ?? "";
  const currentSection = searchParams.get("seccion") ?? "";
  const [q, setQ] = useState(currentQ);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (q === currentQ) return;
      const params = new URLSearchParams(searchParams.toString());
      if (q) params.set("q", q);
      else params.delete("q");
      startTransition(() => router.push(`/admin/productos?${params.toString()}`));
    }, 350);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  function selectSection(slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) params.set("seccion", slug);
    else params.delete("seccion");
    startTransition(() => router.push(`/admin/productos?${params.toString()}`));
  }

  const chips = [{ slug: "", name: "Todas" }, ...sections];

  return (
    <div className="space-y-3">
      <div className="relative max-w-sm">
        <Search
          size={16}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por título o descripción..."
          aria-label="Buscar productos"
          className="w-full rounded-full border border-border bg-card py-2 pl-10 pr-9 text-sm shadow-(--shadow-card) outline-none transition-[border-color,box-shadow] duration-200 focus:border-link focus:ring-2 focus:ring-link/25"
        />
        {q && (
          <button
            type="button"
            onClick={() => setQ("")}
            aria-label="Limpiar búsqueda"
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full p-1 text-muted transition-colors hover:bg-black/5 hover:text-text"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {sections.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {chips.map((s) => {
            const active = currentSection === s.slug;
            return (
              <button
                key={s.slug || "all"}
                type="button"
                onClick={() => selectSection(s.slug)}
                aria-pressed={active}
                className={cn(
                  "cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-white"
                    : "bg-white text-muted hover:bg-black/5"
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
