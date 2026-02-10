export const VERIFIED_STORAGE_KEY = "walentynkiCaptchaVerified" as const;

export function loadVerifiedFlag(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(VERIFIED_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function saveVerifiedFlag() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(VERIFIED_STORAGE_KEY, "1");
  } catch {
    // ignore
  }
}

export function clearVerifiedFlag() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(VERIFIED_STORAGE_KEY);
  } catch {
    // ignore
  }
}
