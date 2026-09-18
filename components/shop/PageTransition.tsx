import { ViewTransition } from "react";

const DIRECTIONAL = {
  "nav-forward": "nav-forward",
  "nav-back": "nav-back",
  default: "none",
} as const;

/**
 * Directional page wrapper.
 *
 * Links tagged `nav-forward` slide content left on the way in; `nav-back`
 * slides it right. Untyped navigations (browser back/forward, refresh, Suspense
 * reveals) get `default: "none"` so they stay still.
 *
 * This must live in each `page.tsx`, never in a layout — layouts persist across
 * navigations, so enter/exit would never fire there.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter={DIRECTIONAL} exit={DIRECTIONAL} default="none">
      {children}
    </ViewTransition>
  );
}
