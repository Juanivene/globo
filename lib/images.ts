/**
 * Fotos de ambiente: las tomas de "clima" de la página, no fotos de producto.
 *
 * Viven en `public/images/`, no en el bucket de R2. R2 queda para las fotos de
 * producto, que las carga el admin; estas dos son parte del diseño, cambian
 * sólo cuando cambia el diseño, y alojarlas acá las vuelve inmunes a que falte
 * un objeto en el bucket o a un deploy con otra `R2_PUBLIC_BASE_URL`.
 *
 * Se sirven por `next/image`, así que el navegador recibe AVIF/WebP al ancho
 * que necesite en vez del JPEG original.
 */

/** Una caja de USPS recién abierta — el momento en que el pedido llega. */
export const bannerImageUrl = () => "/images/paquete-abierto.jpg";

/** Productos importados sobre una mesa — la idea de "variedad". */
export const aboutImageUrl = () => "/images/variedad-productos.jpg";
