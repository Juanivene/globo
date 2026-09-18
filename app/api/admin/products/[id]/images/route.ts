import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { getPresignedUploadUrl, extensionFromContentType } from "@/lib/r2";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { response } = await requireAdmin();
  if (response) return response;
  const { id } = await params;

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  const body = await req.json();
  const contentType = body?.contentType as string | undefined;
  if (!contentType || !ALLOWED_TYPES.includes(contentType)) {
    return NextResponse.json({ error: "Tipo de imagen no soportado" }, { status: 400 });
  }

  const ext = extensionFromContentType(contentType);
  const key = `products/${id}/${randomUUID()}.${ext}`;
  const uploadUrl = await getPresignedUploadUrl(key, contentType);
  const publicUrl = `${process.env.R2_PUBLIC_BASE_URL}/${key}`;

  return NextResponse.json({ uploadUrl, key, publicUrl });
}
