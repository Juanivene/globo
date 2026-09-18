import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export interface NewSaleAdminNoticeProps {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  total: string;
}

export default function NewSaleAdminNotice({
  orderId,
  customerName,
  customerEmail,
  customerPhone,
  total,
}: NewSaleAdminNoticeProps) {
  return (
    <Html>
      <Head />
      <Preview>Nueva venta confirmada — {total}</Preview>
      <Body style={{ backgroundColor: "#f7f7f5", fontFamily: "sans-serif" }}>
        <Container
          style={{
            backgroundColor: "#ffffff",
            margin: "0 auto",
            padding: "32px",
            borderRadius: "12px",
            maxWidth: "480px",
          }}
        >
          <Section
            style={{
              backgroundColor: "#e8b34d",
              borderRadius: "8px",
              padding: "20px",
              textAlign: "center" as const,
              marginBottom: "24px",
            }}
          >
            <Text
              style={{
                color: "#1a2f5c",
                fontSize: "20px",
                fontWeight: "bold",
                margin: 0,
              }}
            >
              Nueva venta 🎉
            </Text>
          </Section>
          <Heading style={{ fontSize: "20px", color: "#141824" }}>
            Pago confirmado por Mercado Pago
          </Heading>
          <Text style={{ fontSize: "15px", color: "#141824" }}>
            Total: <strong>{total}</strong>
          </Text>
          <Hr style={{ borderColor: "#e5e5e2", margin: "24px 0" }} />
          <Text style={{ fontSize: "13px", color: "#6b7280" }}>
            Pedido #{orderId.slice(-8).toUpperCase()}
          </Text>
          <Text style={{ fontSize: "13px", color: "#6b7280" }}>
            Cliente: {customerName}
          </Text>
          <Text style={{ fontSize: "13px", color: "#6b7280" }}>
            Email: {customerEmail}
          </Text>
          <Text style={{ fontSize: "13px", color: "#6b7280" }}>
            Teléfono: {customerPhone}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
