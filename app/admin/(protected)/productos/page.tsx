import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import { ProductsTable } from "@/components/admin/ProductsTable";
import { Plus } from "lucide-react";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      images: { orderBy: { position: "asc" }, take: 1 },
      sections: { include: { section: true } },
    },
  });

  const rows = products.map((p) => ({
    ...p,
    price: p.price.toString(),
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Productos</h1>
        <Link href="/admin/productos/nuevo">
          <Button size="sm">
            <Plus size={16} /> Nuevo producto
          </Button>
        </Link>
      </div>
      <ProductsTable initial={rows} />
    </div>
  );
}
