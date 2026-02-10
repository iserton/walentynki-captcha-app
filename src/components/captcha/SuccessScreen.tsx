"use client";

import React from "react";
import { useCaptchaConfig } from "@/app-state/useCaptchaConfig";

export function SuccessScreen({ onReset }: { onReset: () => void }) {
  const { config } = useCaptchaConfig();
  const t = config.texts;

  return (
    <div className="relative w-full max-w-[720px] overflow-hidden rounded-[18px] border border-rose-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.16)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(244,63,94,0.18),transparent_55%),radial-gradient(circle_at_80%_25%,rgba(236,72,153,0.16),transparent_55%),radial-gradient(circle_at_40%_90%,rgba(14,165,233,0.10),transparent_60%)]" />
      <div className="relative px-6 py-10 sm:px-10">
        <div className="mx-auto max-w-[520px] text-center">
          <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-rose-50 ring-1 ring-rose-200">
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-rose-600" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 21s-7.2-4.6-9.6-9C.4 8.5 2.4 5.8 5.4 5.2c1.7-.3 3.4.3 4.6 1.6 1.2-1.3 2.9-1.9 4.6-1.6 3 .6 5 3.3 3 6.8C19.2 16.4 12 21 12 21z"
                opacity="0.95"
              />
            </svg>
          </div>

          <h1 className="text-balance text-[26px] font-semibold tracking-tight text-slate-900 sm:text-[32px]">
            {t.successHeadline}
          </h1>
          <p className="mt-3 text-pretty text-[14px] leading-6 text-slate-600 sm:text-[15px]">
            {t.successBody}
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              className="w-full rounded-[12px] bg-rose-600 px-4 py-3 text-[13px] font-semibold text-white shadow-[0_10px_24px_rgba(225,29,72,0.25)] transition hover:bg-rose-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-200 sm:w-auto"
              onClick={onReset}
            >
              {t.successButtonReset}
            </button>
            <div className="text-[12px] text-slate-400">{t.successFooterNote}</div>
          </div>
        </div>

        {/* Decorative "flowers" — abstract, original */}
        <svg
          className="pointer-events-none absolute -bottom-10 -left-10 h-44 w-44 opacity-40"
          viewBox="0 0 200 200"
          aria-hidden="true"
        >
          <g fill="none" stroke="rgb(244 63 94)" strokeWidth="3">
            <path d="M100 30c12 18 12 122 0 140" />
            <path d="M65 45c25 8 80 70 85 95" />
            <path d="M135 45c-25 8-80 70-85 95" />
            <circle cx="100" cy="105" r="22" fill="rgb(244 63 94 / 0.12)" />
          </g>
        </svg>

        <svg
          className="pointer-events-none absolute -top-10 -right-10 h-44 w-44 opacity-35"
          viewBox="0 0 200 200"
          aria-hidden="true"
        >
          <g fill="none" stroke="rgb(236 72 153)" strokeWidth="3">
            <path d="M100 30c10 22 10 116 0 140" />
            <path d="M60 60c30 2 95 40 98 80" />
            <path d="M140 60c-30 2-95 40-98 80" />
            <circle cx="100" cy="110" r="20" fill="rgb(236 72 153 / 0.10)" />
          </g>
        </svg>
      </div>
    </div>
  );
}
