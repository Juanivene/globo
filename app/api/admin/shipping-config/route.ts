import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { z } from "zod";
import { PROVINCES } from "@/lib/shipping/provinces";
import type { ArgentinaProvince } from "@/app/generated/prisma/enums";

const bodySchema = z.object({
  provinces: z.array(
    z.object({
      province: z.enum(PROVINCES as [string, ...string[]]),
      basePrice: z.coerce.number().nonnegative(),
    })
  ),
});

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const provinces = await prisma.shippingProvinceConfig.findMany({
    orderBy: { province: "asc" },
  });

  return NextResponse.json({ provinces });
}

export async function PATCH(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await req.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { provinces } = parsed.data;

  await prisma.$transaction(
    provinces.map((p) =>
      prisma.shippingProvinceConfig.upsert({
        where: { province: p.province as ArgentinaProvince },
        create: { province: p.province as ArgentinaProvince, basePrice: p.basePrice },
        update: { basePrice: p.basePrice },
      })
    )
  );

  return NextResponse.json({ ok: true });
}
