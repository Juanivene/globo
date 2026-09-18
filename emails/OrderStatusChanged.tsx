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

export interface OrderStatusChangedProps {
  customerName: string;
  orderId: string;
  status: "CONFIRMADO" | "ENVIADO" | "ENTREGADO" | "CANCELADO";
  total: string;
}

const STATUS_COPY: Record<
  OrderStatusChangedProps["status"],
  { title: string; body: string }
> = {
  CONFIRMADO: {
    title: "¡Confirmamos tu pago!",
    body: "Recibimos tu pago y ya estamos preparando tu pedido para el envío.",
  },
  ENVIADO: {
    title: "Tu pedido está en camino",
    body: "Tu pedido fue despachado. En breve lo vas a tener en tu domicilio.",
  },
  ENTREGADO: {
    title: "¡Pedido entregado!",
    body: "Tu pedido fue entregado. Gracias por comprar en Globo Arg.",
  },
  CANCELADO: {
    title: "Tu pedido fue cancelado",
    body: "Tu pedido fue cancelado. Si no lo esperabas, respondé este mail y te ayudamos.",
  },
};

export default function OrderStatusChanged({
  customerName,
  orderId,
  status,
  total,
}: OrderStatusChangedProps) {
  const copy = STATUS_COPY[status];
  return (
    <Html>
      <Head />
      <Preview>{copy.title} — Pedido #{orderId.slice(-8).toUpperCase()}</Preview>
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
              backgroundColor: "#1a2f5c",
              borderRadius: "8px",
              padding: "20px",
              textAlign: "center" as const,
              marginBottom: "24px",
            }}
          >
            <Text
              style={{
                color: "#e8b34d",
                fontSize: "20px",
                fontWeight: "bold",
                margin: 0,
              }}
            >
              Globo Arg
            </Text>
          </Section>
          <Heading style={{ fontSize: "20px", color: "#141824" }}>
            {copy.title}
          </Heading>
          <Text style={{ fontSize: "15px", color: "#141824" }}>
            Hola {customerName}, {copy.body}
          </Text>
          <Hr style={{ borderColor: "#e5e5e2", margin: "24px 0" }} />
          <Text style={{ fontSize: "13px", color: "#6b7280" }}>
            Pedido #{orderId.slice(-8).toUpperCase()}
          </Text>
          <Text style={{ fontSize: "13px", color: "#6b7280" }}>
            Total: {total}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
