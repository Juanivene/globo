import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { z } from "zod";
import { PROVINCES } from "@/lib/shipping/provinces";

const bodySchema = z.object({
  provinces: z.array(
    z.object({
      province: z.enum(PROVINCES as [string, ...string[]]),
      basePrice: z.coerce.number().nonnegative(),
    })
  ),
  surcharge: z.object({
    id: z.string().optional(),
    thresholdKg: z.coerce.number().nonnegative(),
    surchargePct: z.coerce.number().nonnegative(),
    active: z.boolean(),
  }),
});

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const [provinces, surcharge] = await Promise.all([
    prisma.shippingProvinceConfig.findMany({ orderBy: { province: "asc" } }),
    prisma.shippingSurchargeRule.findFirst(),
  ]);

  return NextResponse.json({ provinces, surcharge });
}

export async function PATCH(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await req.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { provinces, surcharge } = parsed.data;

  await prisma.$transaction([
    ...provinces.map((p) =>
      prisma.shippingProvinceConfig.update({
        where: { province: p.province as (typeof PROVINCES)[number] },
        data: { basePrice: p.basePrice },
      })
    ),
    surcharge.id
      ? prisma.shippingSurchargeRule.update({
          where: { id: surcharge.id },
          data: {
            thresholdKg: surcharge.thresholdKg,
            surchargePct: surcharge.surchargePct,
            active: surcharge.active,
          },
        })
      : prisma.shippingSurchargeRule.create({
          data: {
            thresholdKg: surcharge.thresholdKg,
            surchargePct: surcharge.surchargePct,
            active: surcharge.active,
          },
        }),
  ]);

  return NextResponse.json({ ok: true });
}
