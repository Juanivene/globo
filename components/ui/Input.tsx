import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Un solo recuadro de campo para toda la app. El foco se marca con el azul de
 * enlace y un halo suave, nunca con el oro: el oro es del botón que confirma,
 * y si además lo usaran los campos dejaría de señalar lo importante.
 */
const fieldClasses =
  "w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-text outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted/70 focus:border-link focus:ring-2 focus:ring-link/20 disabled:opacity-50";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn(fieldClasses, className)} {...props} />
));
Input.displayName = "Input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn(fieldClasses, className)} {...props} />
));
Textarea.displayName = "Textarea";

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select ref={ref} className={cn(fieldClasses, className)} {...props}>
    {children}
  </select>
));
Select.displayName = "Select";

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("mb-1.5 block text-sm font-medium text-text", className)}
      {...props}
    />
  );
}
