"use client";

import { useContext } from "react";
import { CaptchaConfigContext } from "@/app-state/CaptchaConfigProvider";

export function useCaptchaConfig() {
  const ctx = useContext(CaptchaConfigContext);
  if (!ctx) throw new Error("useCaptchaConfig must be used within CaptchaConfigProvider");
  return ctx;
}
