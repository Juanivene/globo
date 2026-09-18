import { z } from "zod";
import { PROVINCES } from "@/lib/shipping/provinces";

export const productSchema = z.object({
  title: z.string().trim().min(2, "El título es muy corto").max(200),
  description: z.string().trim().min(1, "La descripción es obligatoria"),
  price: z.coerce.number().positive("El precio debe ser mayor a 0"),
  weightKg: z.coerce.number().positive("El peso debe ser mayor a 0"),
  enabled: z.boolean().default(true),
  sectionIds: z.array(z.string()).default([]),
  freeShipping: z.boolean().default(false),
  freeShippingProvinces: z.array(z.enum(PROVINCES as [string, ...string[]])).default([]),
});

export type ProductInput = z.infer<typeof productSchema>;

export const sectionSchema = z.object({
  name: z.string().trim().min(2, "El nombre es muy corto").max(100),
});

export type SectionInput = z.infer<typeof sectionSchema>;
