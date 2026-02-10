"use client";

import React, { useMemo, useState } from "react";
import { defaultCaptchaConfig } from "@/content/captchaConfig";
import { useCaptchaConfig } from "@/app-state/useCaptchaConfig";
import { VerifyWidget } from "@/components/captcha/VerifyWidget";

function downloadJson(filename: string, json: unknown) {
  const blob = new Blob([JSON.stringify(json, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

async function saveConfigToServer(config: unknown) {
  const res = await fetch("/api/captcha-config", {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(config),
  });
  const json = await res.json();
  if (!res.ok || !json?.ok) throw new Error("save_failed");
  return json as { ok: true; config: unknown; hadErrors: boolean };
}

export default function AdminPage() {
  const { config, setConfig } = useCaptchaConfig();
  const t = config.texts;
  const [saving, setSaving] = useState(false);
  const [saveInfo, setSaveInfo] = useState<null | { kind: "ok" | "err"; msg: string }>(null);

  const idCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const tile of config.challenge.tiles) counts[tile.id] = (counts[tile.id] ?? 0) + 1;
    return counts;
  }, [config.challenge.tiles]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="w-full lg:w-[560px]">
            <div className="rounded-[12px] border border-slate-200 bg-white shadow-[0_1px_0_rgba(15,23,42,0.04)]">
              <div className="border-b border-slate-200 px-4 py-3">
                <div className="text-[14px] font-semibold text-slate-900">{t.adminTitle}</div>
                <div className="mt-0.5 text-[12px] text-slate-500">{t.adminSubtitle}</div>
              </div>

              <div className="p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    className="rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-[12px] font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-200"
                    onClick={() => {
                      setConfig(defaultCaptchaConfig);
                      setSaveInfo({ kind: "ok", msg: "Przywrócono domyślne (pamiętaj zapisać na serwer)." });
                    }}
                  >
                    {t.adminResetButton}
                  </button>

                  <button
                    type="button"
                    className="rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-[12px] font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-200"
                    onClick={() => downloadJson("captcha-config.json", config)}
                  >
                    {t.adminExportButton}
                  </button>

                  <button
                    type="button"
                    className="rounded-[10px] bg-sky-600 px-3 py-2 text-[12px] font-semibold text-white shadow-[0_8px_20px_rgba(2,132,199,0.25)] transition hover:bg-sky-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-200 disabled:opacity-60"
                    disabled={saving}
                    onClick={async () => {
                      setSaving(true);
                      setSaveInfo(null);
                      try {
                        const saved = await saveConfigToServer(config);
                        setConfig(saved.config);
                        setSaveInfo({ kind: "ok", msg: saved.hadErrors ? "Zapisano, ale wykryto błędy — zastosowano bezpieczne wartości." : "Zapisano na serwerze." });
                      } catch {
                        setSaveInfo({ kind: "err", msg: "Nie udało się zapisać na serwerze." });
                      } finally {
                        setSaving(false);
                      }
                    }}
                  >
                    {saving ? "Zapisywanie…" : "Zapisz na serwerze"}
                  </button>
                </div>

                {saveInfo ? (
                  <div
                    className={
                      "mt-3 rounded-[10px] border px-3 py-2 text-[12px] " +
                      (saveInfo.kind === "ok"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                        : "border-rose-200 bg-rose-50 text-rose-900")
                    }
                    role="status"
                  >
                    {saveInfo.msg}
                  </div>
                ) : null}

                <div className="mt-5 grid gap-6">
                  <Section title={t.adminSectionTexts}>
                    {Object.entries(config.texts).map(([key, value]) => (
                      <Field
                        key={key}
                        label={key}
                        value={value}
                        onChange={(next) =>
                          setConfig({
                            ...config,
                            texts: {
                              ...config.texts,
                              [key]: next,
                            },
                          })
                        }
                      />
                    ))}
                  </Section>

                  <Section title={t.adminSectionBranding}>
                    {Object.entries(config.branding).map(([key, value]) => (
                      <Field
                        key={key}
                        label={key}
                        value={value}
                        onChange={(next) =>
                          setConfig({
                            ...config,
                            branding: {
                              ...config.branding,
                              [key]: next,
                            },
                          })
                        }
                      />
                    ))}
                  </Section>

                  <Section title={t.adminSectionUi}>
                    <NumberField
                      label="tilesPerRowDesktop"
                      value={config.ui.tilesPerRowDesktop}
                      min={2}
                      max={6}
                      onChange={(next) => setConfig({ ...config, ui: { ...config.ui, tilesPerRowDesktop: next } })}
                    />
                    <NumberField
                      label="tileGapPx"
                      value={config.ui.tileGapPx}
                      min={2}
                      max={16}
                      onChange={(next) => setConfig({ ...config, ui: { ...config.ui, tileGapPx: next } })}
                    />
                    <NumberField
                      label="modalWidthPx"
                      value={config.ui.modalWidthPx}
                      min={280}
                      max={520}
                      onChange={(next) => setConfig({ ...config, ui: { ...config.ui, modalWidthPx: next } })}
                    />
                  </Section>

                  <Section title={t.adminSectionChallenge}>
                    <Field
                      label="gridAriaLabel"
                      value={config.challenge.gridAriaLabel}
                      onChange={(next) =>
                        setConfig({
                          ...config,
                          challenge: {
                            ...config.challenge,
                            gridAriaLabel: next,
                          },
                        })
                      }
                    />

                    <div className="mt-2">
                      <div className="mb-2 text-[12px] font-semibold text-slate-700">{t.adminSectionTiles}</div>
                      <div className="grid gap-2">
                        {config.challenge.tiles.map((tile) => {
                          const isCorrect = config.challenge.correctTileIds.includes(tile.id);
                          return (
                            <div key={tile.id} className="rounded-[10px] border border-slate-200 p-3">
                              <div className="flex items-center justify-between gap-2">
                                <div className="text-[12px] font-semibold text-slate-800">{tile.id}</div>
                                <label className="flex items-center gap-2 text-[12px] text-slate-700">
                                  <input
                                    type="checkbox"
                                    checked={isCorrect}
                                    onChange={(e) => {
                                      const next = e.target.checked
                                        ? Array.from(new Set([...config.challenge.correctTileIds, tile.id]))
                                        : config.challenge.correctTileIds.filter((x) => x !== tile.id);
                                      setConfig({
                                        ...config,
                                        challenge: { ...config.challenge, correctTileIds: next },
                                      });
                                    }}
                                  />
                                  {t.adminTileCorrectLabel}
                                </label>
                              </div>

                              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                                <Field
                                  label="src"
                                  value={tile.src}
                                  onChange={(next) => {
                                    const tiles = config.challenge.tiles.map((x) => (x.id === tile.id ? { ...x, src: next } : x));
                                    setConfig({ ...config, challenge: { ...config.challenge, tiles } });
                                  }}
                                />
                                <Field
                                  label="alt"
                                  value={tile.alt}
                                  onChange={(next) => {
                                    const tiles = config.challenge.tiles.map((x) => (x.id === tile.id ? { ...x, alt: next } : x));
                                    setConfig({ ...config, challenge: { ...config.challenge, tiles } });
                                  }}
                                />
                              </div>

                              {idCounts[tile.id] > 1 ? (
                                <div className="mt-2 text-[12px] text-rose-700">{t.adminDuplicateTileId}</div>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-3 text-[12px] text-slate-500">{t.adminTilesTip}</div>
                    </div>
                  </Section>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex-1">
            <div className="rounded-[12px] border border-slate-200 bg-white shadow-[0_1px_0_rgba(15,23,42,0.04)]">
              <div className="border-b border-slate-200 px-4 py-3">
                <div className="text-[14px] font-semibold text-slate-900">{t.adminLivePreviewTitle}</div>
                <div className="mt-0.5 text-[12px] text-slate-500">{t.adminLivePreviewSubtitle}</div>
              </div>
              <div className="p-6">
                <VerifyWidget />
              </div>
            </div>

            <div className="mt-6 rounded-[12px] border border-slate-200 bg-white p-4 text-[12px] text-slate-600">
              <div className="font-semibold text-slate-800">{t.adminNotesTitle}</div>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>{t.adminNotesNoAuth}</li>
                <li>{t.adminNotesOriginal}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="text-[12px] font-semibold text-slate-800">{title}</div>
      <div className="mt-2 grid gap-2">{children}</div>
    </section>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (next: string) => void }) {
  return (
    <label className="grid gap-1">
      <span className="text-[11px] font-medium text-slate-600">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 rounded-[10px] border border-slate-200 bg-white px-3 text-[12px] text-slate-900 outline-none focus:ring-4 focus:ring-sky-200"
      />
    </label>
  );
}

function NumberField({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
}) {
  return (
    <label className="grid gap-1">
      <span className="text-[11px] font-medium text-slate-600">{label}</span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-9 rounded-[10px] border border-slate-200 bg-white px-3 text-[12px] text-slate-900 outline-none focus:ring-4 focus:ring-sky-200"
      />
    </label>
  );
}
