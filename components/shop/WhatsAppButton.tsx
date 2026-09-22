import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { whatsappUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

/**
 * Botón verde de WhatsApp. Server component: lee el número del servidor.
 * Sin número configurado no renderiza nada.
 */
export function WhatsAppButton({
  message,
  children,
  className,
}: {
  message: string;
  children: React.ReactNode;
  className?: string;
}) {
  const href = whatsappUrl(message);
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "sheen inline-flex items-center justify-center gap-2 rounded-xl bg-whatsapp px-5 py-3 text-sm font-semibold text-primary",
        "transition-[background-color,transform,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:-translate-y-0.5 hover:bg-whatsapp-hover hover:shadow-lg hover:shadow-whatsapp/30 active:translate-y-0 active:scale-[0.98]",
        className
      )}
    >
      <WhatsAppIcon size={20} />
      {children}
    </a>
  );
}
