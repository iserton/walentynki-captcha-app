# walentynki-captcha-app

Autorska aplikacja w **Next.js** skoncentrowana wyłącznie na realistycznym komponencie **captcha-like UI** (checkbox → modal → grid obrazków → instrukcja → walidacja).

## Ważne (uczciwość i inspiracje)

- Ten projekt jest **oryginalnym** systemem „human verification” typu captcha-like.
- UX-flow i ogólna struktura (checkbox + modal z kafelkami) są **świadomie inspirowane** popularnymi systemami weryfikacji użytkownika.
- Projekt **NIE** używa żadnych assetów Google (ikon, fontów, tekstów, grafik) i **NIE** jest Google reCAPTCHA.

## Uruchomienie

```bash
npm install
npm run dev
```

## Konfiguracja (teksty + obrazy)

Krytyczne założenie: **komponenty UI nie mają na stałe żadnych treści** — wszystko pochodzi z konfiguracji.

### Gdzie trzymana jest konfiguracja

- **Na serwerze** w pliku: `data/captcha-config.json`
- Jeśli plik nie istnieje, używane są wartości domyślne z: `src/content/captchaConfig.ts` (`defaultCaptchaConfig`)

Aplikacja czyta konfigurację po stronie serwera (w `app/layout.tsx`).

### Jak edytować konfigurację

Route:

- `/admin` (bez logowania)

Panel umożliwia:

- edycję wszystkich tekstów,
- edycję kafelków (`src` + `alt`),
- ustawienie poprawnych kafelków (`correctTileIds`),
- **eksport** aktualnej konfiguracji do JSON.

Żeby zmiany były widoczne dla **każdego** użytkownika, kliknij:

- **„Zapisz na serwerze”**

To zapisuje config przez API:

- `GET /api/captcha-config`
- `PUT /api/captcha-config`

### Placeholder / brak obrazka

Jeśli `src` jest błędny lub obraz się nie wczyta, UI pokaże bezpieczny placeholder (z zachowaniem rozmiaru kafelka — bez „skakania” modala).

## Walidacja i odporność

- Schemat walidacji konfiguracji: `src/content/captchaConfig.ts` (Zod).
- Błędna konfiguracja **nie wywala UI** — aplikacja stosuje bezpieczne wartości.

