import type { Metadata } from "next";
import { WalletCards } from "lucide-react";

import { LightningWalletSignIn } from "@/components/lightning-wallet-sign-in";

export const metadata: Metadata = { title: "Entrar", description: "Acesso privado com carteira Lightning." };

export default function SignInPage() {
  return (
    <div className="inner-page auth-page">
      <section className="auth-card" aria-labelledby="auth-title">
        <span className="auth-card__icon"><WalletCards aria-hidden="true" /></span>
        <span className="kicker">Acesso à plataforma</span>
        <h1 id="auth-title">Entre com sua carteira.</h1>
        <p>Escaneie um QR LNURL-auth e confirme na sua carteira Lightning. A carteira prova que é você sem compartilhar e-mail, saldo, endereços de pagamento ou frase-semente.</p>
        <LightningWalletSignIn />
      </section>
    </div>
  );
}
