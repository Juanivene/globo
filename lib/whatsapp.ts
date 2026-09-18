/**
 * Link a WhatsApp con un mensaje ya escrito.
 *
 * El número sale de ADMIN_WHATSAPP_NUMBER (el mismo que usa la confirmación de
 * transferencia). Es una variable de servidor: solo se puede usar desde server
 * components. Si falta, devuelve `null` y los componentes ocultan el botón en
 * vez de mostrar un link roto.
 */
export function whatsappUrl(message: string): string | null {
  const number = process.env.ADMIN_WHATSAPP_NUMBER?.replace(/\D/g, "");
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
