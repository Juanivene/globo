/**
 * Textos del sitio de Globo Arg — TODO EL COPY EN UN SOLO LUGAR.
 *
 * ⚠️ BORRADOR. Lo redacté a partir de lo que sabemos de la tienda (productos
 * importados de EE.UU., venta por encargo, envíos a todo el país, pago con
 * Mercado Pago o transferencia). Falta que lo revise el dueño del negocio.
 *
 * Para cambiar un texto alcanza con editar este archivo: los componentes solo
 * lo muestran. Las URLs de las fotos están en `lib/images.ts`.
 *
 * Puntos a confirmar con el dueño antes de publicar:
 *  1. ¿"Por encargo" es la forma correcta de decirlo?
 *  2. ¿Se puede prometer envío "a todo el país" sin excepciones?
 *  3. No afirmo plazos de entrega, precios menores, garantías ni seguimiento
 *     del envío a propósito: si el negocio los ofrece, conviene agregarlos.
 *  4. ¿Perfumes y gadgets son de verdad lo que más venden?
 *  5. "Te lo tramitamos": ¿es un servicio real (buscar un producto que no está
 *     en la tienda)? Es lo que se pidió, pero define qué se promete por WhatsApp.
 */

/** Nombres de íconos disponibles (los mapea ContentIcon a lucide-react). */
export type IconName = "plane" | "truck" | "wallet" | "package" | "message" | "sparkles" | "search" | "heart";

export interface Highlight {
  icon: IconName;
  title: string;
  body: string;
}

// ------------------------------------------------------------ Navegación
/** Links del header. "Inicio" es el logo. */
export const nav = [
  { label: "Productos", href: "/products" },
  { label: "Quiénes somos", href: "/quienes-somos" },
];

// ------------------------------------------------------------------ Hero
export const hero = {
  badge: "Importaciones Globo Arg",
  titleStart: "Productos importados,",
  titleAccent: "directo a tu puerta",
  subtitle: "Perfumes, gadgets y más, traídos de USA.",
  primaryCta: "Ver productos",
  secondaryCta: "Quiénes somos",
  /** Tres datos cortos debajo de los botones. */
  chips: [
    { icon: "plane", label: "Traído de USA" },
    { icon: "truck", label: "Envío a todo el país" },
    { icon: "wallet", label: "Mercado Pago o transferencia" },
  ] satisfies { icon: IconName; label: string }[],
  imageAlt:
    "Una caja de envío recién abierta con productos importados sobre una mesa, con el Obelisco de fondo",
};

// ------------------------------------------------ Últimos productos (home)
export const latest = {
  eyebrow: "Novedades",
  title: "Últimos productos",
  cta: "Ver todos",
  ctaLong: "Ver todos los productos",
};

// -------------------------------------------------------------- Cómo funciona
export const howItWorks = {
  eyebrow: "Cómo funciona",
  title: "De USA a tu casa en tres pasos",
  steps: [
    {
      icon: "search",
      title: "Elegís tu producto",
      body: "Sumá al carrito lo que te guste y confirmá el pedido.",
    },
    {
      icon: "wallet",
      title: "Coordinamos el pedido",
      body: "Pagás con Mercado Pago o por transferencia, y nosotros hacemos el encargo.",
    },
    {
      icon: "package",
      title: "Te llega a tu casa",
      body: "Lo despachamos a cualquier punto de Argentina.",
    },
  ] satisfies Highlight[],
  imageAlt: "Un paquete siendo abierto",
};

// ------------------------------------------------------------- WhatsApp
export const whatsapp = {
  /** "No ves lo que buscás". */
  missing: {
    title: "¿No ves el producto que estás buscando?",
    body: "Mandanos un mensaje y te lo tramitamos.",
    cta: "Pedirlo por WhatsApp",
    message: "Hola! No encontré un producto en Globo Arg y quería consultar si pueden tramitármelo.",
  },
  /** Igual que `missing`, pero se usa cuando una búsqueda no dio resultados. */
  missingSearch: (query: string) =>
    `Hola! Busqué "${query}" en Globo Arg y no lo encontré. ¿Pueden tramitármelo?`,
  /** Dudas generales (también va en el footer). */
  doubt: {
    title: "¿Tenés alguna duda?",
    body: "Escribinos y te respondemos por WhatsApp.",
    cta: "Escribinos",
    message: "Hola! Tengo una duda sobre Globo Arg.",
  },
};

// -------------------------------------------------------------- Footer
export const footer = {
  tagline: "Productos importados de USA, a tu puerta.",
  contactTitle: "¿Tenés una duda?",
  contactBody: "Escribinos por WhatsApp.",
};

// --------------------------------------------------------- Quiénes somos
export const about = {
  eyebrow: "Quiénes somos",
  title: "Lo que buscás en Estados Unidos, lo traemos a tu puerta",
  /** Cada string es un párrafo. */
  paragraphs: [
    "Globo Arg es una tienda de productos importados de Estados Unidos: perfumes, gadgets y todo eso que allá está a mano y acá cuesta conseguir.",
    "Trabajamos por encargo. Vos elegís lo que te gusta, coordinamos el pedido con vos y lo despachamos a cualquier punto del país.",
  ],
  /** "Por qué comprar acá". */
  reasonsTitle: "Por qué comprar acá",
  reasons: [
    {
      icon: "sparkles",
      title: "Variedad",
      body: "Perfumes, tecnología, accesorios y más, en una selección que va cambiando.",
    },
    {
      icon: "search",
      title: "Difíciles de conseguir",
      body: "Productos que en Argentina cuesta encontrar.",
    },
    {
      icon: "heart",
      title: "Trato directo",
      body: "Te acompañamos en todo el pedido, de la elección a la entrega.",
    },
  ] satisfies Highlight[],
  imageAlt: "Perfumes de distintas marcas apilados junto a una ventana",
  /** Banner ancho con la foto de tecnología. */
  banner: {
    title: "Perfumes, tecnología y lo que se te ocurra",
    body: "Preguntanos por lo que estés buscando y te lo tramitamos.",
    imageAlt: "Auriculares y un celular sobre un escritorio, junto a una caja de envío de USA a Argentina",
  },
};
