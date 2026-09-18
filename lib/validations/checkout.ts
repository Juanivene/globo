import { z } from "zod";

export const checkoutSchema = z.object({
  customerName: z.string().trim().min(2, "Ingresá tu nombre completo"),
  customerEmail: z.email("Email inválido"),
  customerPhone: z.string().trim().min(6, "Ingresá un teléfono válido"),
  address: z.string().trim().min(5, "Ingresá tu dirección completa"),
  postalCode: z
    .string()
    .trim()
    .regex(/^\d{4}$/, "El código postal debe tener 4 dígitos"),
  paymentMethod: z.enum(["MERCADO_PAGO", "TRANSFERENCIA"]),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.coerce.number().int().positive(),
      })
    )
    .min(1, "El carrito está vacío"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const shippingQuoteSchema = z.object({
  postalCode: z
    .string()
    .trim()
    .regex(/^\d{4}$/, "El código postal debe tener 4 dígitos"),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.coerce.number().int().positive(),
      })
    )
    .min(1),
});

export type ShippingQuoteInput = z.infer<typeof shippingQuoteSchema>;
