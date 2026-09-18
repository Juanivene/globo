import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

const createSchema = z.object({
  thresholdKg: z.coerce.number().nonnegative(),
  surchargePct: z.coerce.number().nonnegative(),
  active: z.boolean().default(true),
});

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const rules = await prisma.shippingSurchargeRule.findMany({
    orderBy: { thresholdKg: "asc" },
  });
  return NextResponse.json(rules);
}

export async function POST(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const rule = await prisma.shippingSurchargeRule.create({ data: parsed.data });
  return NextResponse.json(rule, { status: 201 });
}
