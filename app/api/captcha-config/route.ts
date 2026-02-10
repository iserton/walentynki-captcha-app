import { NextResponse } from "next/server";
import { readCaptchaConfigFile, writeCaptchaConfigFile } from "@/lib/serverCaptchaConfig";
import { defaultCaptchaConfig } from "@/content/captchaConfig";

export async function GET() {
  const { config, hadErrors } = await readCaptchaConfigFile();
  return NextResponse.json({ ok: true, config, hadErrors });
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { config, hadErrors } = await writeCaptchaConfigFile(body);
    return NextResponse.json({ ok: true, config, hadErrors });
  } catch {
    // If body is not JSON, don’t crash.
    return NextResponse.json({ ok: false, config: defaultCaptchaConfig, hadErrors: true }, { status: 400 });
  }
}
