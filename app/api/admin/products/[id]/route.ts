import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { productSchema } from "@/lib/validations/product";
import { slugify } from "@/lib/utils";
import { deleteR2Object } from "@/lib/r2";
import type { ArgentinaProvince } from "@/app/generated/prisma/enums";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { response } = await requireAdmin();
  if (response) return response;
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { position: "asc" } },
      sections: { include: { section: true } },
    },
  });
  if (!product) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { response } = await requireAdmin();
  if (response) return response;
  const { id } = await params;

  const body = await req.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { sectionIds, freeShippingProvinces, ...data } = parsed.data;
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  let slug = existing.slug;
  if (slugify(data.title) !== slugify(existing.title)) {
    const baseSlug = slugify(data.title);
    slug = baseSlug;
    let attempt = 1;
    while (await prisma.product.findFirst({ where: { slug, NOT: { id } } })) {
      slug = `${baseSlug}-${++attempt}`;
    }
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...data,
      freeShippingProvinces: freeShippingProvinces as ArgentinaProvince[],
      slug,
      sections: {
        deleteMany: {},
        create: sectionIds.map((sectionId) => ({ sectionId })),
      },
    },
  });

  return NextResponse.json(product);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { response } = await requireAdmin();
  if (response) return response;
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!product) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  // Un fallo al borrar en R2 (credenciales, bucket, objeto ya inexistente) no
  // debe impedir borrar el producto en la base de datos — solo lo logueamos.
  const results = await Promise.allSettled(
    product.images.map((img) => deleteR2Object(img.key))
  );
  results.forEach((result, i) => {
    if (result.status === "rejected") {
      console.error(
        `Error al borrar imagen ${product.images[i].key} de R2:`,
        result.reason
      );
    }
  });

  try {
    await prisma.product.delete({ where: { id } });
  } catch (err) {
    console.error(`Error al borrar producto ${id}:`, err);
    return NextResponse.json(
      { error: "No se pudo eliminar el producto" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
