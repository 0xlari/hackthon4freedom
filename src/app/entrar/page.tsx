import type { Metadata } from "next";
import { WalletCards } from "lucide-react";

import { WalletAccess } from "@/components/wallet-access";

export const metadata: Metadata = { title: "Entrar", description: "Acesso privado com carteira Lightning." };

function safeRedirect(value: string | string[] | undefined) {
  const candidate = Array.isArray(value) ? value[0] : value;
  return candidate?.startsWith("/") && !candidate.startsWith("//") ? candidate : "/painel";
}

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ next?: string | string[]; trocar?: string | string[] }> }) {
  const params = await searchParams;
  const redirectTo = safeRedirect(params.next);
  const forceSwitch = (Array.isArray(params.trocar) ? params.trocar[0] : params.trocar) === "1";
  return <div className="inner-page auth-page"><section className="auth-card" aria-labelledby="auth-title">
    <span className="auth-card__icon"><WalletCards aria-hidden="true" /></span>
    <span className="kicker">Acesso à plataforma</span>
    <h1 id="auth-title">Entre com sua carteira.</h1>
    <p>Escaneie e confirme. Esta assinatura serve somente para reconhecer seu perfil: não movimenta sats, não revela saldo e não entrega sua frase-semente.</p>
    <WalletAccess redirectTo={redirectTo} forceSwitch={forceSwitch} />
  </section></div>;
}
