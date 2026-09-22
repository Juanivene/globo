import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/**
 * "Volver a…" — la misma pieza en ficha de producto, sección, carrito y
 * checkout. Estaba copiada cuatro veces con diferencias mínimas de tamaño y
 * color; unificada, el camino de vuelta se ve y se comporta igual en todas.
 *
 * Siempre navega con el tipo `nav-back`, que hace que la página entre desde el
 * lado contrario al de "entrar": el gesto acompaña el sentido del viaje.
 */
export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      transitionTypes={["nav-back"]}
      className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors duration-200 hover:text-primary"
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/6 transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-x-0.5 group-hover:bg-primary/12">
        <ArrowLeft size={14} />
      </span>
      {children}
    </Link>
  );
}
