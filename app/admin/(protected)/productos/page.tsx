import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import { ProductsTable } from "@/components/admin/ProductsTable";
import { AdminProductsControls } from "@/components/admin/AdminProductsControls";
import { Plus } from "lucide-react";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; seccion?: string }>;
}) {
  const { q, seccion } = await searchParams;

  const [products, sections] = await Promise.all([
    prisma.product.findMany({
      where: {
        ...(q
          ? {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
        ...(seccion ? { sections: { some: { section: { slug: seccion } } } } : {}),
      },
      orderBy: { createdAt: "desc" },
      include: {
        images: { orderBy: { position: "asc" }, take: 1 },
        sections: { include: { section: true } },
      },
    }),
    prisma.section.findMany({ orderBy: { name: "asc" }, select: { slug: true, name: true } }),
  ]);

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
      <AdminProductsControls sections={sections} />
      <ProductsTable initial={rows} />
    </div>
  );
}
