import { PackageOpen } from "lucide-react";
import { ProductCard, type ProductCardData } from "@/components/shop/ProductCard";
import { WhatsAppButton } from "@/components/shop/WhatsAppButton";
import { whatsapp } from "@/lib/content/site";

export function ProductGrid({
  products,
  query,
}: {
  products: ProductCardData[];
  /** Búsqueda que dio 0 resultados: se usa para prearmar el mensaje de WhatsApp. */
  query?: string;
}) {
  if (products.length === 0) {
    return (
      <div className="card-globo animate-rise flex flex-col items-center gap-4 px-6 py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/5 text-muted">
          <PackageOpen size={28} />
        </span>
        <div>
          <p className="font-heading text-lg font-semibold text-primary">
            No encontramos productos con ese criterio
          </p>
          <p className="mt-1 text-sm text-muted">
            Probá con otra palabra, o pedínoslo y te lo tramitamos.
          </p>
        </div>
        {/* Si no hay número configurado, el botón no se muestra. */}
        <WhatsAppButton
          message={query ? whatsapp.missingSearch(query) : whatsapp.missing.message}
          className="mt-1"
        >
          {whatsapp.missing.cta}
        </WhatsAppButton>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product, i) => (
        // El desfasaje va por posición en la fila (`i % 4`), no por índice
        // absoluto: así cada fila entra con la misma ondita de izquierda a
        // derecha, en vez de llegar cada vez más tarde a medida que se baja.
        <ProductCard key={product.id} product={product} index={i % 4} />
      ))}
    </div>
  );
}
