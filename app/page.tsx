"use client";

import React, { useState } from "react";
import { VerifyWidget } from "@/components/captcha/VerifyWidget";
import { SuccessScreen } from "@/components/captcha/SuccessScreen";
import { clearVerifiedFlag, loadVerifiedFlag, saveVerifiedFlag } from "@/lib/verificationStore";

export default function Home() {
  const [done, setDone] = useState(() => loadVerifiedFlag());

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_15%_10%,rgba(244,63,94,0.18),transparent_55%),radial-gradient(circle_at_85%_15%,rgba(236,72,153,0.16),transparent_55%),radial-gradient(circle_at_40%_95%,rgba(14,165,233,0.10),transparent_60%),linear-gradient(to_bottom,#fff,#f8fafc)]">
      <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center p-6">
        {!done ? (
          <div className="w-full">
            <VerifyWidget
              onVerified={() => {
                saveVerifiedFlag();
                setDone(true);
              }}
            />
          </div>
        ) : (
          <SuccessScreen
            onReset={() => {
              clearVerifiedFlag();
              setDone(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
