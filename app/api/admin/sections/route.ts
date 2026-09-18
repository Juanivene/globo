import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { sectionSchema } from "@/lib/validations/product";
import { slugify } from "@/lib/utils";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const sections = await prisma.section.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return NextResponse.json(sections);
}

export async function POST(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await req.json();
  const parsed = sectionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const baseSlug = slugify(parsed.data.name);
  let slug = baseSlug;
  let attempt = 1;
  while (await prisma.section.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${++attempt}`;
  }

  const section = await prisma.section.create({
    data: { name: parsed.data.name, slug },
  });
  return NextResponse.json(section, { status: 201 });
}
