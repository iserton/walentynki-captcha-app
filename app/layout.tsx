import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CaptchaConfigProvider } from "@/app-state/CaptchaConfigProvider";
import { readCaptchaConfigFile } from "@/lib/serverCaptchaConfig";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Walentynki — Human Verification",
  description: "Autorski captcha-like UI inspirowany popularnymi systemami weryfikacji użytkownika.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { config, hadErrors } = await readCaptchaConfigFile();

  return (
    <html lang="pl">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CaptchaConfigProvider initialConfig={config} initialHadErrors={hadErrors}>
          {children}
        </CaptchaConfigProvider>
      </body>
    </html>
  );
}
