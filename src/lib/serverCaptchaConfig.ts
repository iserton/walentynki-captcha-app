import { promises as fs } from "fs";
import path from "path";
import { defaultCaptchaConfig, getSafeCaptchaConfig } from "@/content/captchaConfig";
import type { CaptchaConfig } from "@/content/captchaConfig";

const CONFIG_PATH = path.join(process.cwd(), "data", "captcha-config.json");

export async function readCaptchaConfigFile(): Promise<{ config: CaptchaConfig; hadErrors: boolean }> {
  try {
    const raw = await fs.readFile(CONFIG_PATH, "utf8");
    const json = JSON.parse(raw);
    return getSafeCaptchaConfig(json);
  } catch {
    return { config: defaultCaptchaConfig, hadErrors: false };
  }
}

export async function writeCaptchaConfigFile(input: unknown): Promise<{ config: CaptchaConfig; hadErrors: boolean }> {
  const safe = getSafeCaptchaConfig(input);
  await fs.mkdir(path.dirname(CONFIG_PATH), { recursive: true });
  await fs.writeFile(CONFIG_PATH, JSON.stringify(safe.config, null, 2), "utf8");
  return safe;
}
