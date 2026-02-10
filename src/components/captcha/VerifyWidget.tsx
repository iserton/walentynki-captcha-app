"use client";

import React, { useMemo, useState } from "react";
import { useCaptchaConfig } from "@/app-state/useCaptchaConfig";
import { ChallengeModal } from "@/components/captcha/ChallengeModal";

type VerifyState = "idle" | "verifying" | "verified";

export function VerifyWidget({ onVerified }: { onVerified?: () => void }) {
  const { config, hadConfigErrors } = useCaptchaConfig();
  const t = config.texts;
  const b = config.branding;

  const [state, setState] = useState<VerifyState>("idle");
  const [modalOpen, setModalOpen] = useState(false);

  const statusText = useMemo(() => {
    if (state === "verified") return t.checkboxStatusVerified;
    if (state === "verifying") return t.checkboxStatusVerifying;
    return t.checkboxStatusIdle;
  }, [state, t.checkboxStatusIdle, t.checkboxStatusVerified, t.checkboxStatusVerifying]);

  return (
    <div className="w-full max-w-[420px]">
      <div className="rounded-[10px] border border-slate-200 bg-white/95 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur">
        <div className="flex items-center gap-4 px-4 py-4">
          <button
            type="button"
            className={
              "relative h-7 w-7 shrink-0 rounded-[4px] border transition focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-200 " +
              (state === "verified"
                ? "border-emerald-500 bg-emerald-50"
                : state === "verifying"
                  ? "border-sky-400 bg-white"
                  : "border-slate-300 bg-white hover:border-slate-400")
            }
            aria-label={t.checkboxLabel}
            disabled={state === "verified"}
            onClick={() => {
              if (state === "verified") return;
              setModalOpen(true);
              setState("verifying");
            }}
          >
            {state === "verified" ? (
              <svg
                viewBox="0 0 20 20"
                className="absolute inset-0 m-auto h-4 w-4 text-emerald-600"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M7.7 13.6 4.4 10.3a1 1 0 0 1 1.4-1.4l2.1 2.1 6.1-6.1a1 1 0 1 1 1.4 1.4l-6.8 7a1 1 0 0 1-.9.3 1 1 0 0 1-1.1-.0Z"
                />
              </svg>
            ) : state === "verifying" ? (
              <div className="absolute inset-0 grid place-items-center">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-sky-500" />
              </div>
            ) : null}
          </button>

          <div className="min-w-0 flex-1">
            <div className="text-[15px] font-medium text-slate-900">{t.checkboxLabel}</div>
            <div className="mt-0.5 text-[12px] text-slate-500">{statusText}</div>
            {hadConfigErrors ? (
              <div className="mt-1 text-[12px] text-amber-700">{t.toastConfigError}</div>
            ) : null}
          </div>

          <div className="flex flex-col items-end gap-1 pl-2 text-right">
            <div className="text-[12px] font-semibold tracking-wide text-slate-700">{b.cornerLabel}</div>
            <div className="text-[11px] text-slate-500">{b.cornerSubLabel}</div>
            <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
              <span className="underline decoration-slate-300 underline-offset-2">{b.privacyLabel}</span>
              <span className="text-slate-300">·</span>
              <span className="underline decoration-slate-300 underline-offset-2">{b.termsLabel}</span>
            </div>
          </div>
        </div>
      </div>

      {modalOpen ? (
        <ChallengeModal
          onClose={() => {
            setModalOpen(false);
            if (state === "verifying") setState("idle");
          }}
          onVerified={() => {
            setModalOpen(false);
            setState("verified");
            onVerified?.();
          }}
          onFailed={() => {
            setState("verifying");
          }}
        />
      ) : null}
    </div>
  );
}
