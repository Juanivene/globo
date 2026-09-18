"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SectionOption {
  slug: string;
  name: string;
}

export function CatalogControls({ sections }: { sections: SectionOption[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQ = searchParams.get("q") ?? "";
  const currentSection = searchParams.get("seccion") ?? "";
  const [q, setQ] = useState(currentQ);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (q === currentQ) return;
      const params = new URLSearchParams(searchParams.toString());
      if (q) params.set("q", q);
      else params.delete("q");
      router.push(`/?${params.toString()}`);
    }, 350);
    return () => clearTimeout(timeout);
    // Only re-run the debounce timer when the typed query changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  function selectSection(slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) params.set("seccion", slug);
    else params.delete("seccion");
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar productos..."
          className="w-full rounded-full border border-border bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-glow focus:ring-1 focus:ring-glow"
        />
      </div>
      {sections.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => selectSection("")}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer",
              !currentSection
                ? "bg-primary text-white"
                : "bg-white text-muted hover:bg-black/5"
            )}
          >
            Todos
          </button>
          {sections.map((s) => (
            <button
              key={s.slug}
              onClick={() => selectSection(s.slug)}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer",
                currentSection === s.slug
                  ? "bg-primary text-white"
                  : "bg-white text-muted hover:bg-black/5"
              )}
            >
              {s.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
