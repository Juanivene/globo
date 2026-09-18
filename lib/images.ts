/**
 * Ambience photography, self-hosted on the same R2 bucket as the product images.
 *
 * These are the "mood" shots for the page chrome, not product photos. They are
 * served through `next/image`, so the browser gets AVIF/WebP at its own width
 * rather than the source JPEG.
 *
 * If `R2_PUBLIC_BASE_URL` is unset the getters return `null` and every consumer
 * falls back to its gradient-only version, so a missing env var softens the
 * design instead of breaking the page.
 */
function ambienteUrl(file: string): string | null {
  const base = process.env.R2_PUBLIC_BASE_URL;
  return base ? `${base.replace(/\/$/, "")}/ambiente/${file}` : null;
}

/** Hands opening a taped parcel — the moment the package arrives. */
export const bannerImageUrl = () => ambienteUrl("banner-paquete.jpg");

/** Perfumes apilados junto a una ventana — la idea de "variedad". */
export const aboutImageUrl = () => ambienteUrl("variedad-perfumes.jpg");
