import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { sectionSchema } from "@/lib/validations/product";
import { slugify } from "@/lib/utils";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { response } = await requireAdmin();
  if (response) return response;
  const { id } = await params;

  const body = await req.json();
  const parsed = sectionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const baseSlug = slugify(parsed.data.name);
  let slug = baseSlug;
  let attempt = 1;
  while (
    await prisma.section.findFirst({ where: { slug, NOT: { id } } })
  ) {
    slug = `${baseSlug}-${++attempt}`;
  }

  const section = await prisma.section.update({
    where: { id },
    data: { name: parsed.data.name, slug },
  });
  return NextResponse.json(section);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { response } = await requireAdmin();
  if (response) return response;
  const { id } = await params;

  await prisma.section.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
