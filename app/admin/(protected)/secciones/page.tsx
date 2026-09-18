import { prisma } from "@/lib/prisma";
import { SectionsManager } from "@/components/admin/SectionsManager";

export default async function AdminSectionsPage() {
  const sections = await prisma.section.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return <SectionsManager initial={sections} />;
}
