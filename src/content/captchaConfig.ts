import { z } from "zod";

export const CAPTCHA_STORAGE_KEY = "walentynkiCaptchaConfig" as const;

export const captchaTileSchema = z.object({
  id: z.string().min(1),
  src: z.string().min(1),
  alt: z.string().default(""),
});

export const captchaTextsSchema = z.object({
  // Checkbox
  checkboxLabel: z.string().default(""),
  checkboxStatusIdle: z.string().default(""),
  checkboxStatusVerifying: z.string().default(""),
  checkboxStatusVerified: z.string().default(""),

  // Modal
  modalTitle: z.string().default(""),
  modalSubtitle: z.string().default(""),
  instructionPrefix: z.string().default(""),
  instructionTarget: z.string().default(""),
  instructionSuffix: z.string().default(""),

  buttonVerify: z.string().default(""),
  buttonRefresh: z.string().default(""),
  buttonClose: z.string().default(""),

  hintSelectMultiple: z.string().default(""),

  // Feedback
  toastSuccessTitle: z.string().default(""),
  toastSuccessBody: z.string().default(""),
  toastErrorTitle: z.string().default(""),
  toastErrorBody: z.string().default(""),
  toastConfigError: z.string().default(""),

  // Tiles
  tilePlaceholder: z.string().default(""),

  // Success screen
  successHeadline: z.string().default(""),
  successBody: z.string().default(""),
  successButtonReset: z.string().default(""),
  successFooterNote: z.string().default(""),

  // /admin UI
  adminTitle: z.string().default(""),
  adminSubtitle: z.string().default(""),
  adminSectionTexts: z.string().default(""),
  adminSectionBranding: z.string().default(""),
  adminSectionUi: z.string().default(""),
  adminSectionChallenge: z.string().default(""),
  adminSectionTiles: z.string().default(""),
  adminLivePreviewTitle: z.string().default(""),
  adminLivePreviewSubtitle: z.string().default(""),
  adminNotesTitle: z.string().default(""),
  adminNotesNoAuth: z.string().default(""),
  adminNotesOriginal: z.string().default(""),
  adminTileCorrectLabel: z.string().default(""),
  adminTilesTip: z.string().default(""),
  adminDuplicateTileId: z.string().default(""),

  // Admin buttons
  adminResetButton: z.string().default(""),
  adminExportButton: z.string().default(""),
});

export const captchaChallengeSchema = z.object({
  gridAriaLabel: z.string().default(""),
  tiles: z.array(captchaTileSchema).min(1),
  correctTileIds: z.array(z.string()).default([]),
});

export const captchaBrandingSchema = z.object({
  cornerLabel: z.string().default(""),
  cornerSubLabel: z.string().default(""),
  privacyLabel: z.string().default(""),
  termsLabel: z.string().default(""),
});

export const captchaUiSchema = z.object({
  tilesPerRowDesktop: z.number().int().min(2).max(6).default(3),
  tileGapPx: z.number().int().min(2).max(16).default(4),
  modalWidthPx: z.number().int().min(280).max(520).default(414),
});

export const captchaConfigSchema = z.object({
  version: z.number().int().default(1),
  texts: captchaTextsSchema,
  branding: captchaBrandingSchema,
  challenge: captchaChallengeSchema,
  ui: captchaUiSchema,
});

export type CaptchaConfig = z.infer<typeof captchaConfigSchema>;

export const defaultCaptchaConfig: CaptchaConfig = {
  version: 1,
  texts: {
    checkboxLabel: "Nie jestem robotem",
    checkboxStatusIdle: "Weryfikacja",
    checkboxStatusVerifying: "Sprawdzanie…",
    checkboxStatusVerified: "Zweryfikowano",

    modalTitle: "Weryfikacja",
    modalSubtitle: "Wykonaj zadanie, aby kontynuować",
    instructionPrefix: "Zaznacz wszystkie obrazy z",
    instructionTarget: "Twoją walentynką",
    instructionSuffix: "",

    buttonVerify: "Potwierdź",
    buttonRefresh: "Wyczyść",
    buttonClose: "Zamknij",

    hintSelectMultiple: "Kliknij wszystkie pasujące obrazy. Jeśli żaden nie pasuje, kliknij Potwierdź.",

    toastSuccessTitle: "Weryfikacja zakończona",
    toastSuccessBody: "Dziękujemy.",
    toastErrorTitle: "Spróbuj ponownie",
    toastErrorBody: "Zaznaczenie nie pasuje. Spróbuj jeszcze raz.",
    toastConfigError: "Błąd konfiguracji: użyto bezpiecznych ustawień domyślnych.",

    tilePlaceholder: "Brak obrazu",

    successHeadline: "Udało się — to Ty.",
    successBody: "Wszystko się zgadza. Miłego walentynkowego wieczoru.",
    successButtonReset: "Wróć do weryfikacji",
    successFooterNote: "(autorski system captcha-like)",

    adminTitle: "Panel /admin",
    adminSubtitle: "Edytuj teksty, branding i kafelki. Zmiany zapisują się w localStorage.",
    adminSectionTexts: "Teksty",
    adminSectionBranding: "Branding",
    adminSectionUi: "UI",
    adminSectionChallenge: "Zadanie",
    adminSectionTiles: "Kafelki",
    adminLivePreviewTitle: "Podgląd na żywo",
    adminLivePreviewSubtitle: "Podgląd używa tej samej konfiguracji, którą edytujesz.",
    adminNotesTitle: "Notatki",
    adminNotesNoAuth: "Brak logowania na /admin (celowo — zgodnie z wymaganiem).",
    adminNotesOriginal: "UI jest autorskie i nie używa żadnych assetów Google.",
    adminTileCorrectLabel: "poprawny",
    adminTilesTip: "Wskazówka: src może być /tiles/… (public/) albo dowolnym URL.",

    adminDuplicateTileId: "Wykryto zduplikowane id kafelka.",

    adminResetButton: "Reset do domyślnych",
    adminExportButton: "Eksportuj konfigurację (JSON)",
  },
  branding: {
    cornerLabel: "Human Check",
    cornerSubLabel: "Bezpieczeństwo",
    privacyLabel: "Prywatność",
    termsLabel: "Warunki",
  },
  ui: {
    tilesPerRowDesktop: 3,
    tileGapPx: 4,
    modalWidthPx: 414,
  },
  challenge: {
    gridAriaLabel: "Siatka wyboru obrazów",
    tiles: [
      { id: "t1", src: "/tiles/tile-1.svg", alt: "" },
      { id: "t2", src: "/tiles/tile-2.svg", alt: "" },
      { id: "t3", src: "/tiles/tile-3.svg", alt: "" },
      { id: "t4", src: "/tiles/tile-4.svg", alt: "" },
      { id: "t5", src: "/tiles/tile-5.svg", alt: "" },
      { id: "t6", src: "/tiles/tile-6.svg", alt: "" },
      { id: "t7", src: "/tiles/tile-7.svg", alt: "" },
      { id: "t8", src: "/tiles/tile-8.svg", alt: "" },
      { id: "t9", src: "/tiles/tile-9.svg", alt: "" },
    ],
    // Walentynkowe założenie: wszystkie obrazki to Twoje zdjęcia,
    // więc domyślnie poprawną odpowiedzią jest zaznaczenie wszystkich.
    correctTileIds: ["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "t9"],
  },
};

function safeString(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
}

/**
 * Never throw. Always return a usable config.
 */
export function getSafeCaptchaConfig(input: unknown): {
  config: CaptchaConfig;
  hadErrors: boolean;
} {
  const parsed = captchaConfigSchema.safeParse(input);
  if (!parsed.success) {
    return { config: defaultCaptchaConfig, hadErrors: true };
  }

  const cfg = parsed.data;

  // Extra resilience: ensure key text fields never end up empty.
  const texts = cfg.texts;
  cfg.texts = {
    ...texts,
    checkboxLabel: safeString(texts.checkboxLabel, defaultCaptchaConfig.texts.checkboxLabel),
    modalTitle: safeString(texts.modalTitle, defaultCaptchaConfig.texts.modalTitle),
    instructionPrefix: safeString(texts.instructionPrefix, defaultCaptchaConfig.texts.instructionPrefix),
    instructionTarget: safeString(texts.instructionTarget, defaultCaptchaConfig.texts.instructionTarget),
    buttonVerify: safeString(texts.buttonVerify, defaultCaptchaConfig.texts.buttonVerify),
    tilePlaceholder: safeString(texts.tilePlaceholder, defaultCaptchaConfig.texts.tilePlaceholder),
    successHeadline: safeString(texts.successHeadline, defaultCaptchaConfig.texts.successHeadline),
  };

  // Ensure correct ids exist in tiles.
  const tileIds = new Set(cfg.challenge.tiles.map((t) => t.id));
  cfg.challenge.correctTileIds = cfg.challenge.correctTileIds.filter((id) => tileIds.has(id));

  return { config: cfg, hadErrors: false };
}
