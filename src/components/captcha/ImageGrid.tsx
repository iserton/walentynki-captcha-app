"use client";

import React, { useMemo, useState } from "react";

export type CaptchaTile = {
  id: string;
  src: string;
  alt: string;
};

export function ImageGrid({
  ariaLabel,
  tiles,
  selectedIds,
  onToggle,
  tilesPerRowDesktop,
  tileGapPx,
  placeholderLabel,
}: {
  ariaLabel: string;
  tiles: CaptchaTile[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  tilesPerRowDesktop: number;
  tileGapPx: number;
  placeholderLabel: string;
}) {
  const [broken, setBroken] = useState<Record<string, boolean>>({});

  const style = useMemo(() => {
    return {
      gridTemplateColumns: `repeat(${Math.max(2, Math.min(6, tilesPerRowDesktop))}, minmax(0, 1fr))`,
      gap: `${tileGapPx}px`,
    } as React.CSSProperties;
  }, [tileGapPx, tilesPerRowDesktop]);

  return (
    <div aria-label={ariaLabel} role="group" className="select-none">
      <div className="grid rounded-[10px] border border-slate-200 bg-white p-[6px]" style={style}>
        {tiles.map((tile) => {
          const selected = selectedIds.includes(tile.id);
          const isBroken = !!broken[tile.id];

          return (
            <button
              key={tile.id}
              type="button"
              className={
                "group relative overflow-hidden rounded-[8px] bg-slate-100 outline-none focus-visible:ring-4 focus-visible:ring-sky-200 " +
                (selected ? "ring-2 ring-sky-500" : "ring-1 ring-slate-200 hover:ring-slate-300")
              }
              onClick={() => onToggle(tile.id)}
            >
              <div className="aspect-square w-full">
                {!isBroken ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={tile.src}
                    alt={tile.alt}
                    className="h-full w-full object-cover"
                    loading="eager"
                    onError={() => setBroken((prev) => ({ ...prev, [tile.id]: true }))}
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-slate-200">
                    <div className="text-center text-[11px] font-medium text-slate-600">
                      <div className="mx-auto mb-1 h-6 w-6 rounded-full border border-slate-400/70" />
                      <div>{placeholderLabel}</div>
                    </div>
                  </div>
                )}
              </div>

              <div
                className={
                  "pointer-events-none absolute inset-0 transition " +
                  (selected ? "bg-sky-500/18" : "bg-transparent group-hover:bg-slate-950/5")
                }
              />

              <div className="pointer-events-none absolute right-2 top-2">
                <div
                  className={
                    "grid h-5 w-5 place-items-center rounded-full border transition " +
                    (selected
                      ? "border-sky-500 bg-sky-500 text-white"
                      : "border-white/90 bg-slate-950/20 text-transparent")
                  }
                >
                  <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M7.7 13.6 4.4 10.3a1 1 0 0 1 1.4-1.4l2.1 2.1 6.1-6.1a1 1 0 1 1 1.4 1.4l-6.8 7a1 1 0 0 1-.9.3 1 1 0 0 1-1.1-.0Z"
                    />
                  </svg>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
