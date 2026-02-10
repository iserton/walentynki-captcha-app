"use client";

import React, { createContext, useCallback, useMemo, useState } from "react";
import type { CaptchaConfig } from "@/content/captchaConfig";
import { getSafeCaptchaConfig } from "@/content/captchaConfig";

type CaptchaConfigContextValue = {
  config: CaptchaConfig;
  setConfig: (next: CaptchaConfig) => void;
  hadConfigErrors: boolean;
};

export const CaptchaConfigContext = createContext<CaptchaConfigContextValue | null>(null);

export function CaptchaConfigProvider({
  children,
  initialConfig,
  initialHadErrors,
}: {
  children: React.ReactNode;
  initialConfig: CaptchaConfig;
  initialHadErrors: boolean;
}) {
  const [config, setConfigState] = useState<CaptchaConfig>(initialConfig);
  const [hadConfigErrors, setHadConfigErrors] = useState<boolean>(initialHadErrors);

  const setConfig = useCallback((next: CaptchaConfig) => {
    const safe = getSafeCaptchaConfig(next);
    setConfigState(safe.config);
    setHadConfigErrors(safe.hadErrors);
  }, []);

  const value = useMemo(
    () => ({
      config,
      setConfig,
      hadConfigErrors,
    }),
    [config, hadConfigErrors, setConfig]
  );

  return <CaptchaConfigContext.Provider value={value}>{children}</CaptchaConfigContext.Provider>;
}
