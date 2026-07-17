import type { Metadata } from "next";
import { BadgeCheck } from "lucide-react";

export const metadata: Metadata = { title: "Reputação", description: "Histórico privado e atestados Nostr não sensíveis." };

export default function ReputationPage() {
  return (
    <div className="inner-page auth-page">
      <section className="auth-card" aria-labelledby="reputation-title">
        <span className="auth-card__icon"><BadgeCheck aria-hidden="true" /></span>
        <span className="kicker">Reputação portável</span>
        <h1 id="reputation-title">Sua reputação cresce com operações reais.</h1>
        <p>Pagamentos concluídos, recebíveis liquidados e outros sinais positivos formam seu histórico. A plataforma publica automaticamente apenas atestados pseudônimos e não sensíveis; sua carteira de login e seus dados de pagamento não são publicados no Nostr.</p>
      </section>
    </div>
  );
}
