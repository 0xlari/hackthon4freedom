import type { Metadata } from "next";
import { Radio } from "lucide-react";

import { NostrSignIn } from "@/components/nostr-sign-in";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Acesso seguro com signer Nostr, sem compartilhar chave privada.",
};

export default function SignInPage() {
  return (
    <div className="inner-page auth-page">
      <section className="auth-card" aria-labelledby="auth-title">
        <span className="auth-card__icon">
          <Radio aria-hidden="true" />
        </span>
        <span className="kicker">Identidade portátil</span>
        <h1 id="auth-title">Entre sem entregar sua chave privada.</h1>
        <p>
          Assine um desafio único e temporário no seu signer. A assinatura confirma sua
          identidade Nostr; ela não autoriza pagamentos.
        </p>
        <NostrSignIn />
      </section>
    </div>
  );
}
