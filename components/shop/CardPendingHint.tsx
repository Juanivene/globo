"use client";

import { useLinkStatus } from "next/link";

/**
 * Inline pending feedback for a product card.
 *
 * Product pages are dynamic and intentionally have no `loading.tsx` — a
 * Suspense fallback there would break the thumbnail -> hero morph, because the
 * destination would render a fallback first and never pair with the thumbnail.
 * This hairline covers that gap: the tap is acknowledged instantly, and nothing
 * about it delays the navigation.
 */
export function CardPendingHint() {
  const { pending } = useLinkStatus();

  if (!pending) return null;

  return (
    <span
      aria-hidden
      className="absolute inset-x-0 top-0 h-0.5 overflow-hidden bg-accent/25"
    >
      <span className="block h-full w-1/4 animate-[indeterminate_1s_ease-in-out_infinite] bg-accent" />
    </span>
  );
}
