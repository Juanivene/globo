# Globo Arg

Tienda online para productos importados de USA. Next.js (App Router) + Prisma/Neon + Cloudflare R2 + Resend + Mercado Pago Checkout Pro, pensada para plan gratuito y bajo tráfico.

## Stack

- **Next.js 16** (App Router, TypeScript, Tailwind CSS v4)
- **Prisma 7** + **Neon** (Postgres serverless) vía `@prisma/adapter-pg`
- **NextAuth** (Credentials) para el login único del admin
- **Cloudflare R2** para imágenes de producto (subida directa con URLs prefirmadas)
- **Resend** para emails transaccionales
- **Mercado Pago Checkout Pro** + transferencia con link de WhatsApp
- **Netlify** como hosting (`@netlify/plugin-nextjs`)

## Puesta en marcha local

```bash
npm install
```

### Base de datos

Para desarrollar sin depender todavía de una cuenta de Neon, se puede levantar una Postgres local con el servidor de desarrollo de Prisma:

```bash
npx prisma dev -d      # levanta una Postgres local en segundo plano
```

Copiá `.env.example` a `.env` y completá `DATABASE_URL`/`DIRECT_URL` con la connection string que te haya impreso `npx prisma dev` (o con las de tu proyecto de Neon cuando lo tengas). Notá que `prisma dev` no queda como servicio del sistema: si reiniciás la máquina hay que volver a correr `npx prisma dev -d` (o `npx prisma dev start default` si el server ya existe).

Con la base disponible:

```bash
npx prisma migrate dev   # crea las tablas
npm run seed              # crea el admin y precarga las 24 provincias + regla de recargo
npm run dev
```

El seed usa `ADMIN_EMAIL` / `ADMIN_PASSWORD` del `.env` para crear el usuario admin (hash bcrypt en la tabla `Admin`). Podés volver a correr `npm run seed` para rotar la contraseña.

### Variables de entorno

Ver `.env.example` para la lista completa. Las de Mercado Pago, R2 y Resend pueden quedar vacías durante el desarrollo — no bloquean el resto de la app, simplemente esas funciones puntuales (pago con MP, subida de imágenes, envío de emails) van a fallar de forma controlada hasta que se completen.

- **Neon**: `DATABASE_URL` (pooled, con `pgbouncer`) y `DIRECT_URL` (directa, para migraciones).
- **R2**: bucket público (o dominio `r2.dev`) para que las imágenes se sirvan directo — `R2_PUBLIC_BASE_URL` tiene que apuntar ahí.
- **Mercado Pago**: `MERCADOPAGO_ACCESS_TOKEN` y `MERCADOPAGO_WEBHOOK_SECRET` salen de la cuenta de Mercado Pago Developers del dueño de la tienda (Checkout Pro → credenciales + firma del webhook).
- **WhatsApp**: `ADMIN_WHATSAPP_NUMBER` en formato internacional sin `+` ni espacios (ej. `5491122334455`).

## Estructura

- `app/(shop)/**` — catálogo público, carrito, checkout.
- `app/admin/**` — panel de administración (protegido por `proxy.ts`, el reemplazo de `middleware.ts` en Next 16).
- `app/api/**` — rutas de API (admin CRUD, checkout, webhook de Mercado Pago).
- `lib/shipping/` — tabla de códigos postales → provincia y cálculo de envío.
- `prisma/schema.prisma` — modelo de datos. `prisma/seed.ts` — datos iniciales.
- `emails/` — plantillas de email (React Email) usadas por `lib/email.ts`.

## Limitaciones conocidas

- La tabla de códigos postales (`lib/shipping/cpTable.ts`) es una aproximación por rangos numéricos — el sistema real de Correo Argentino define esto por localidad y tiene algunas zonas superpuestas. Si una provincia queda mal resuelta, se puede corregir a mano desde el detalle del pedido en el admin.
- El diseño usa una paleta placeholder derivada del logo (navy + dorado) hasta tanto se integre el archivo de logo definitivo en `public/`.

## Deploy en Netlify

1. Conectar el repo en Netlify (usa `netlify.toml`, que ya define `@netlify/plugin-nextjs` y corre `prisma generate` en el build).
2. Cargar todas las variables de `.env.example` en Site settings → Environment variables (con los valores reales de Neon, R2, Resend, Mercado Pago y WhatsApp).
3. `NEXTAUTH_URL` y `NEXT_PUBLIC_BASE_URL` deben apuntar al dominio de Netlify (`https://<sitio>.netlify.app`).
4. El webhook de Mercado Pago necesita una URL pública — probar la integración recién contra el sitio deployado (con credenciales de sandbox primero).
5. Cuando se compre un dominio propio, sólo hay que actualizar `NEXTAUTH_URL` / `NEXT_PUBLIC_BASE_URL` y el dominio en Netlify.
