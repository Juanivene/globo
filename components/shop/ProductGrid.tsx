import { PackageOpen } from "lucide-react";
import { ProductCard, type ProductCardData } from "@/components/shop/ProductCard";
import { WhatsAppButton } from "@/components/shop/WhatsAppButton";
import { whatsapp } from "@/lib/content/site";
import { staggerIndex } from "@/lib/utils";

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
      <div className="card-globo animate-rise flex flex-col items-center gap-3 p-12 text-center">
        <PackageOpen size={36} className="text-muted/50" />
        <p className="text-muted">No encontramos productos con ese criterio.</p>
        {/* Si no hay número configurado, el botón no se muestra. */}
        <WhatsAppButton
          message={query ? whatsapp.missingSearch(query) : whatsapp.missing.message}
          className="mt-2"
        >
          {whatsapp.missing.cta}
        </WhatsAppButton>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} index={staggerIndex(i)} />
      ))}
    </div>
  );
}
