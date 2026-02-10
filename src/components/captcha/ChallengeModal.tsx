"use client";

import React, { useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useCaptchaConfig } from "@/app-state/useCaptchaConfig";
import { ImageGrid } from "@/components/captcha/ImageGrid";
import { validateSelection } from "@/lib/validateSelection";

export function ChallengeModal({
  onClose,
  onVerified,
  onFailed,
}: {
  onClose: () => void;
  onVerified: () => void;
  onFailed: () => void;
}) {
  const { config } = useCaptchaConfig();
  const t = config.texts;
  const ui = config.ui;
  const challenge = config.challenge;

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toast, setToast] = useState<null | { kind: "success" | "error"; title: string; body: string }>(null);

  const panelRef = useRef<HTMLDivElement | null>(null);

  const modalWidthStyle = useMemo(() => {
    const w = ui.modalWidthPx;
    return { width: `min(${w}px, calc(100vw - 28px))` } as React.CSSProperties;
  }, [ui.modalWidthPx]);

  const instruction = useMemo(() => {
    const parts = [t.instructionPrefix, t.instructionTarget, t.instructionSuffix].filter((x) => x && x.trim().length > 0);
    return parts.join(" ");
  }, [t.instructionPrefix, t.instructionTarget, t.instructionSuffix]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px]"
        aria-label={t.buttonClose}
        onClick={onClose}
      />

      <div className="absolute inset-0 grid place-items-center p-3">
        <div
          ref={panelRef}
          tabIndex={-1}
          style={modalWidthStyle}
          className="outline-none animate-[fadeIn_.14s_ease-out]"
          onAnimationEnd={() => panelRef.current?.focus()}
        >
          <div className="overflow-hidden rounded-[12px] border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.22)]">
            <div className="bg-slate-900 px-4 py-3 text-white">
              <div className="text-[13px] font-semibold tracking-wide">{t.modalTitle}</div>
              <div className="mt-0.5 text-[12px] text-slate-200/90">{t.modalSubtitle}</div>
            </div>

            <div className="px-4 py-3">
              <div className="rounded-[10px] border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-[12px] font-medium text-slate-700">{instruction}</div>
                <div className="mt-1 text-[11px] text-slate-500">{t.hintSelectMultiple}</div>
              </div>

              <div className="mt-3">
                <ImageGrid
                  ariaLabel={challenge.gridAriaLabel}
                  tiles={challenge.tiles}
                  selectedIds={selectedIds}
                  onToggle={(id) => {
                    setToast(null);
                    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
                  }}
                  tilesPerRowDesktop={ui.tilesPerRowDesktop}
                  tileGapPx={ui.tileGapPx}
                  placeholderLabel={t.tilePlaceholder}
                />
              </div>

              {toast ? (
                <div
                  className={
                    "mt-3 rounded-[10px] border px-3 py-2 text-[12px] " +
                    (toast.kind === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                      : "border-rose-200 bg-rose-50 text-rose-900")
                  }
                  role="status"
                >
                  <div className="font-semibold">{toast.title}</div>
                  <div className="mt-0.5 opacity-90">{toast.body}</div>
                </div>
              ) : null}

              <div className="mt-4 flex items-center justify-between gap-2">
                <button
                  type="button"
                  className="rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-[12px] font-medium text-slate-700 shadow-[0_1px_0_rgba(15,23,42,0.04)] transition hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-200"
                  onClick={() => {
                    setSelectedIds([]);
                    setToast(null);
                  }}
                >
                  {t.buttonRefresh}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-[12px] font-medium text-slate-700 shadow-[0_1px_0_rgba(15,23,42,0.04)] transition hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-200"
                    onClick={onClose}
                  >
                    {t.buttonClose}
                  </button>
                  <button
                    type="button"
                    className="rounded-[10px] bg-sky-600 px-3 py-2 text-[12px] font-semibold text-white shadow-[0_8px_20px_rgba(2,132,199,0.25)] transition hover:bg-sky-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-200"
                    onClick={() => {
                      const ok = validateSelection(selectedIds, challenge.correctTileIds);
                      if (ok) {
                        setToast({ kind: "success", title: t.toastSuccessTitle, body: t.toastSuccessBody });
                        window.setTimeout(() => onVerified(), 420);
                      } else {
                        setToast({ kind: "error", title: t.toastErrorTitle, body: t.toastErrorBody });
                        onFailed();
                      }
                    }}
                  >
                    {t.buttonVerify}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px) scale(0.99);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>,
    document.body
  );
}
