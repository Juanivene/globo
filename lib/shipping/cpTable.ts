import { ArgentinaProvince } from "@/app/generated/prisma/enums";

export interface CpRange {
  from: number;
  to: number;
  province: ArgentinaProvince;
}

/**
 * Static 4-digit CP (código postal) → province lookup, based on the legacy
 * numeric postal ranges. Argentina's real postal system (CPA) is defined at
 * locality granularity and has some overlapping/irregular boundaries that a
 * simple numeric range can't capture perfectly — this table is a best-effort
 * approximation. Known-wrong resolutions are rare and low-stakes at this
 * order volume: the admin can correct `Order.province` by hand from the
 * order detail page if a customer's shipping cost looks off.
 */
export const CP_RANGES: CpRange[] = [
  { from: 1000, to: 1499, province: "CABA" },
  { from: 1500, to: 1999, province: "BUENOS_AIRES" },
  { from: 2000, to: 2299, province: "SANTA_FE" },
  { from: 2300, to: 2599, province: "SANTA_FE" },
  { from: 2600, to: 2999, province: "BUENOS_AIRES" },
  { from: 3000, to: 3099, province: "SANTA_FE" },
  { from: 3100, to: 3299, province: "ENTRE_RIOS" },
  { from: 3300, to: 3499, province: "CORRIENTES" },
  { from: 3500, to: 3699, province: "CHACO" },
  { from: 3700, to: 3799, province: "FORMOSA" },
  { from: 3800, to: 3899, province: "CHACO" },
  { from: 3900, to: 3999, province: "ENTRE_RIOS" },
  { from: 4000, to: 4199, province: "TUCUMAN" },
  { from: 4200, to: 4399, province: "SANTIAGO_DEL_ESTERO" },
  { from: 4400, to: 4599, province: "SALTA" },
  { from: 4600, to: 4699, province: "JUJUY" },
  { from: 4700, to: 4899, province: "CATAMARCA" },
  { from: 4900, to: 4999, province: "LA_RIOJA" },
  { from: 5000, to: 5399, province: "CORDOBA" },
  { from: 5400, to: 5499, province: "SAN_LUIS" },
  { from: 5500, to: 5699, province: "MENDOZA" },
  { from: 5700, to: 5799, province: "SAN_LUIS" },
  { from: 5800, to: 5999, province: "LA_PAMPA" },
  { from: 6000, to: 6299, province: "BUENOS_AIRES" },
  { from: 6300, to: 6499, province: "LA_PAMPA" },
  { from: 6500, to: 7999, province: "BUENOS_AIRES" },
  { from: 8000, to: 8199, province: "BUENOS_AIRES" },
  { from: 8200, to: 8399, province: "RIO_NEGRO" },
  { from: 8400, to: 8599, province: "NEUQUEN" },
  { from: 8600, to: 8999, province: "RIO_NEGRO" },
  { from: 9000, to: 9199, province: "CHUBUT" },
  { from: 9200, to: 9399, province: "SANTA_CRUZ" },
  { from: 9400, to: 9999, province: "TIERRA_DEL_FUEGO" },
];

export function resolveProvinceFromCp(cp: string): ArgentinaProvince | null {
  const trimmed = cp.trim();
  if (!/^\d{4}$/.test(trimmed)) return null;
  const n = parseInt(trimmed, 10);
  const match = CP_RANGES.find((r) => n >= r.from && n <= r.to);
  return match ? match.province : null;
}
