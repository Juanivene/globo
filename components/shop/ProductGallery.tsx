"use client";

import { useRef, useState } from "react";
import { ViewTransition } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface GalleryImage {
  id: string;
  url: string;
}

/**
 * Swipeable product gallery.
 *
 * Uses a native scroll-snap track rather than a JS carousel: swipe physics,
 * momentum and accessibility come from the browser, and the whole thing costs
 * no animation runtime on mid-range phones.
 */
export function ProductGallery({
  images,
  title,
  transitionName,
}: {
  images: GalleryImage[];
  title: string;
  transitionName: string;
}) {
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  if (images.length === 0) {
    return (
      <div className="card-globo flex aspect-square items-center justify-center text-6xl">
        🎁
      </div>
    );
  }

  function scrollTo(index: number) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: track.clientWidth * index, behavior: "smooth" });
  }

  /** Derive the active slide from scroll position — keeps dots in sync with swipes. */
  function handleScroll() {
    const track = trackRef.current;
    if (!track) return;
    const index = Math.round(track.scrollLeft / track.clientWidth);
    if (index !== active) setActive(index);
  }

  return (
    <div className="space-y-3">
      <div className="card-globo relative overflow-hidden">
        <div
          ref={trackRef}
          onScroll={handleScroll}
          className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((img, i) => {
            const image = (
              <Image
                src={img.url}
                alt={i === 0 ? title : `${title} — imagen ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={i === 0}
              />
            );

            return (
              <div
                key={img.id}
                className="relative aspect-square w-full shrink-0 snap-center bg-black/5"
              >
                {/*
                  Only the first image carries the shared name: it is the one
                  that was on screen in the grid, so it is the one that morphs.
                */}
                {i === 0 ? (
                  <ViewTransition name={transitionName} share="morph" default="none">
                    {image}
                  </ViewTransition>
                ) : (
                  image
                )}
              </div>
            );
          })}
        </div>

        {images.length > 1 && (
          <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
            {images.map((img, i) => (
              <span
                key={img.id}
                className={cn(
                  "h-1.5 rounded-full bg-white/60 shadow transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  i === active ? "w-5 bg-accent" : "w-1.5"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => scrollTo(i)}
              aria-label={`Ver imagen ${i + 1} de ${images.length}`}
              className={cn(
                "relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-card transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
                i === active
                  ? "ring-2 ring-accent ring-offset-2 ring-offset-surface-light"
                  : "opacity-60 hover:-translate-y-0.5 hover:opacity-100"
              )}
            >
              <Image src={img.url} alt="" fill className="object-cover" sizes="100px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
