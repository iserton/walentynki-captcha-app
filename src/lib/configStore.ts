import { CAPTCHA_STORAGE_KEY, defaultCaptchaConfig, getSafeCaptchaConfig } from "@/content/captchaConfig";
import type { CaptchaConfig } from "@/content/captchaConfig";

export function loadCaptchaConfigFromStorage(): { config: CaptchaConfig; hadErrors: boolean } {
  if (typeof window === "undefined") return { config: defaultCaptchaConfig, hadErrors: false };

  try {
    const raw = window.localStorage.getItem(CAPTCHA_STORAGE_KEY);
    if (!raw) return { config: defaultCaptchaConfig, hadErrors: false };
    const json = JSON.parse(raw);
    return getSafeCaptchaConfig(json);
  } catch {
    return { config: defaultCaptchaConfig, hadErrors: true };
  }
}

export function saveCaptchaConfigToStorage(config: CaptchaConfig) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CAPTCHA_STORAGE_KEY, JSON.stringify(config, null, 2));
}

export function resetCaptchaConfigStorage() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CAPTCHA_STORAGE_KEY);
}
