import type { Metadata } from "next";
import { WalletCards } from "lucide-react";

import { WalletAccess } from "@/components/wallet-access";

export const metadata: Metadata = { title: "Entrar", description: "Acesso privado com carteira Lightning." };

function safeRedirect(value: string | string[] | undefined) {
  const candidate = Array.isArray(value) ? value[0] : value;
  return candidate?.startsWith("/") && !candidate.startsWith("//") ? candidate : "/painel";
}

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ next?: string | string[] }> }) {
  const redirectTo = safeRedirect((await searchParams).next);
  return <div className="inner-page auth-page"><section className="auth-card" aria-labelledby="auth-title">
    <span className="auth-card__icon"><WalletCards aria-hidden="true" /></span>
    <span className="kicker">Acesso à plataforma</span>
    <h1 id="auth-title">Entre com sua carteira.</h1>
    <p>Escaneie e confirme. Esta assinatura serve somente para reconhecer seu perfil: não movimenta sats, não revela saldo e não entrega sua frase-semente.</p>
    <WalletAccess redirectTo={redirectTo} />
  </section></div>;
}
