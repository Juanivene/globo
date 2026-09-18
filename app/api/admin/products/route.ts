import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { productSchema } from "@/lib/validations/product";
import { slugify } from "@/lib/utils";
import type { ArgentinaProvince } from "@/app/generated/prisma/enums";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { images: { orderBy: { position: "asc" } }, sections: { include: { section: true } } },
  });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await req.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { sectionIds, freeShippingProvinces, ...data } = parsed.data;

  const baseSlug = slugify(data.title);
  let slug = baseSlug;
  let attempt = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${++attempt}`;
  }

  const product = await prisma.product.create({
    data: {
      ...data,
      freeShippingProvinces: freeShippingProvinces as ArgentinaProvince[],
      slug,
      sections: {
        create: sectionIds.map((sectionId) => ({ sectionId })),
      },
    },
  });

  return NextResponse.json(product, { status: 201 });
}
