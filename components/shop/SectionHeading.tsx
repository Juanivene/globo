/**
 * Encabezado de sección, uno solo para toda la tienda.
 *
 * Antes cada página armaba el suyo y el resultado eran tamaños y espaciados
 * apenas distintos entre home, catálogo y "quiénes somos". Con una sola pieza
 * la jerarquía es la misma en todas: volanta chica en bronce, título en el
 * tipo de los títulos, y una acción opcional alineada a la derecha.
 */
export function SectionHeading({
  eyebrow,
  title,
  id,
  action,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: string;
  id?: string;
  action?: React.ReactNode;
  as?: "h1" | "h2";
}) {
  return (
    <div className="reveal flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
      <div>
        {eyebrow && (
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-bronze">
            <span aria-hidden className="h-px w-6 bg-bronze/50" />
            {eyebrow}
          </p>
        )}
        <Tag
          id={id}
          className="mt-1.5 font-heading text-2xl font-bold text-primary sm:text-3xl"
        >
          {title}
        </Tag>
      </div>
      {action}
    </div>
  );
}
