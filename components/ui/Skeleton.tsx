import { cn } from "@/lib/utils";

/** Brand-tinted loading placeholder — the shop never shows a generic spinner. */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("skeleton rounded-lg", className)} {...props} />;
}

/**
 * Espejo exacto de `ProductGrid`: mismas columnas, mismo gap y misma altura de
 * tarjeta. Si los dos no coinciden, al llegar los productos reales la grilla
 * salta, que es justo lo que el skeleton viene a evitar.
 */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4"
      role="status"
      aria-label="Cargando productos"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{ "--i": i % 4 } as React.CSSProperties}
          className="stagger-rise card-globo overflow-hidden"
        >
          <Skeleton className="aspect-square rounded-none" />
          <div className="space-y-2 p-3.5">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
