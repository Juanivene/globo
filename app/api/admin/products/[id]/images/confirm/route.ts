import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { response } = await requireAdmin();
  if (response) return response;
  const { id } = await params;

  const body = await req.json();
  const key = body?.key as string | undefined;
  const url = body?.url as string | undefined;
  if (!key || !url) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  const count = await prisma.productImage.count({ where: { productId: id } });

  const image = await prisma.productImage.create({
    data: { productId: id, key, url, position: count },
  });

  return NextResponse.json(image, { status: 201 });
}
