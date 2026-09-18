import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-accent text-primary font-semibold hover:bg-accent-hover shadow-(--shadow-accent) hover:shadow-(--shadow-accent-hover)",
  secondary: "bg-primary text-text-invert hover:bg-primary-light",
  outline: "border border-border bg-card text-text hover:bg-black/5 hover:border-primary/30",
  ghost: "text-text hover:bg-black/5",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const sizeClasses: Record<Size, string> = {
  sm: "text-sm px-3 py-1.5 rounded-md",
  md: "text-sm px-4 py-2.5 rounded-lg",
  lg: "text-base px-6 py-3 rounded-xl",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex cursor-pointer items-center justify-center gap-2",
          // Transform is included so callers can add `active:scale-*` and get a
          // consistent press feel without restating the timing.
          "transition-[background-color,box-shadow,transform,border-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
