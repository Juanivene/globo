import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { orderStatusSchema } from "@/lib/validations/order";
import { sendOrderStatusEmail } from "@/lib/email";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { response } = await requireAdmin();
  if (response) return response;
  const { id } = await params;

  const body = await req.json();
  const parsed = orderStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const order = await prisma.order.update({
    where: { id },
    data: { status: parsed.data.status },
  });

  if (parsed.data.status !== "PENDIENTE") {
    try {
      await sendOrderStatusEmail({
        orderId: order.id,
        status: parsed.data.status,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        total: order.total.toString(),
      });
    } catch (err) {
      console.error("Failed to send order status email", err);
    }
  }

  return NextResponse.json(order);
}
