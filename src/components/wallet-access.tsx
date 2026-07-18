"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { LightningWalletSignIn } from "@/components/lightning-wallet-sign-in";

export function WalletAccess({ redirectTo }: { redirectTo: string }) {
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let active = true;
    fetch("/api/auth/session", { cache: "no-store" })
      .then((response) => {
        if (!active) return;
        if (response.ok) {
          router.replace(redirectTo);
          router.refresh();
        } else setChecking(false);
      })
      .catch(() => { if (active) setChecking(false); });
    return () => { active = false; };
  }, [redirectTo, router]);

  return checking ? <p className="wallet-sign-in__status" role="status">Verificando sua carteira…</p> : <LightningWalletSignIn redirectTo={redirectTo} />;
}
