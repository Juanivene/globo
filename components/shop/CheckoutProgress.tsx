"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type CheckoutStepId = "datos" | "envio" | "pago";

const STEPS: { id: CheckoutStepId; label: string }[] = [
  { id: "datos", label: "Datos" },
  { id: "envio", label: "Envío" },
  { id: "pago", label: "Pago" },
];

/**
 * Progress rail for the checkout.
 *
 * The form stays a single page on purpose — splitting it into a wizard would
 * add taps and risk losing typed data on a phone. This reflects how far along
 * the user already is, so they get the sense of progress without the form ever
 * hiding a field from them.
 */
export function CheckoutProgress({ done }: { done: Record<CheckoutStepId, boolean> }) {
  // The first step that is not yet complete is the one to point at.
  const currentIndex = STEPS.findIndex((s) => !done[s.id]);
  const activeIndex = currentIndex === -1 ? STEPS.length - 1 : currentIndex;
  const completedCount = STEPS.filter((s) => done[s.id]).length;

  return (
    <div className="card-globo p-4">
      <ol className="relative flex items-center justify-between">
        {/* Rail behind the markers */}
        <div
          aria-hidden
          className="absolute left-4 right-4 top-3.5 h-0.5 -translate-y-1/2 rounded-full bg-border"
        >
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              width: `${(completedCount / (STEPS.length - 1)) * 100}%`,
              maxWidth: "100%",
            }}
          />
        </div>

        {STEPS.map((step, i) => {
          const isDone = done[step.id];
          const isActive = i === activeIndex && !isDone;

          return (
            <li
              key={step.id}
              className="relative z-10 flex flex-col items-center gap-1.5"
              aria-current={isActive ? "step" : undefined}
            >
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border-2 bg-card text-xs font-bold transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  isDone && "border-accent bg-accent text-primary",
                  isActive && "scale-110 border-accent text-primary shadow-(--shadow-ring-accent)",
                  !isDone && !isActive && "border-border text-muted"
                )}
              >
                {isDone ? <Check size={14} className="animate-check-pop" /> : i + 1}
              </span>
              <span
                className={cn(
                  "text-xs font-medium transition-colors duration-300",
                  isDone || isActive ? "text-primary" : "text-muted"
                )}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
