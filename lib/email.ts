import { Resend } from "resend";
import OrderStatusChanged from "@/emails/OrderStatusChanged";
import NewSaleAdminNotice from "@/emails/NewSaleAdminNotice";
import { formatCurrency } from "@/lib/utils";
import { OrderStatus } from "@/app/generated/prisma/enums";

let resendClient: Resend | null = null;

function getResend(): Resend {
  if (!resendClient) resendClient = new Resend(process.env.RESEND_API_KEY);
  return resendClient;
}

const FROM = process.env.RESEND_FROM_EMAIL ?? "Globo Arg <onboarding@resend.dev>";

type NotifiableStatus = Extract<
  OrderStatus,
  "CONFIRMADO" | "ENVIADO" | "ENTREGADO" | "CANCELADO"
>;

export async function sendOrderStatusEmail(params: {
  orderId: string;
  status: NotifiableStatus;
  customerName: string;
  customerEmail: string;
  total: number | string;
}) {
  const statusSubjects: Record<NotifiableStatus, string> = {
    CONFIRMADO: "Confirmamos tu pago",
    ENVIADO: "Tu pedido fue enviado",
    ENTREGADO: "Tu pedido fue entregado",
    CANCELADO: "Tu pedido fue cancelado",
  };

  await getResend().emails.send({
    from: FROM,
    to: params.customerEmail,
    subject: `${statusSubjects[params.status]} — Globo Arg`,
    react: OrderStatusChanged({
      customerName: params.customerName,
      orderId: params.orderId,
      status: params.status,
      total: formatCurrency(params.total),
    }),
  });
}

export async function sendNewSaleAdminEmail(params: {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  total: number | string;
}) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!adminEmail) return;

  await getResend().emails.send({
    from: FROM,
    to: adminEmail,
    subject: `Nueva venta — ${formatCurrency(params.total)}`,
    react: NewSaleAdminNotice({
      orderId: params.orderId,
      customerName: params.customerName,
      customerEmail: params.customerEmail,
      customerPhone: params.customerPhone,
      total: formatCurrency(params.total),
    }),
  });
}
