import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { deleteR2Object } from "@/lib/r2";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  const { response } = await requireAdmin();
  if (response) return response;
  const { imageId } = await params;

  const image = await prisma.productImage.findUnique({ where: { id: imageId } });
  if (!image) return NextResponse.json({ error: "No encontrada" }, { status: 404 });

  await deleteR2Object(image.key);
  await prisma.productImage.delete({ where: { id: imageId } });

  return NextResponse.json({ ok: true });
}
