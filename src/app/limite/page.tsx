import type { Metadata } from "next";
import {
  BadgeCheck,
  BriefcaseBusiness,
  History,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import {
  availableCreditLimit,
  calculateCreditLimit,
} from "@/domain/credit-limit";

export const metadata: Metadata = {
  title: "Meu limite demonstrativo",
  description: "Entenda de forma transparente como o limite pode evoluir.",
};

const demonstration = calculateCreditLimit({
  identityVerified: true,
  professionalAccountsVerified: 1,
  paidOperations: 1,
  eligibleCollateralUsdCents: 0n,
});
const usedUsdCents = 20_000n;
const availableUsdCents = availableCreditLimit(
  demonstration.totalUsdCents,
  usedUsdCents,
);

function formatUsd(usdCents: bigint) {
  const dollars = usdCents / 100n;
  const cents = (usdCents % 100n).toString().padStart(2, "0");
  return `US$ ${dollars.toLocaleString("pt-BR")},${cents}`;
}

const breakdown = [
  {
    label: "Limite inicial",
    detail: "Disponível para todo perfil",
    value: demonstration.baseUsdCents,
  },
  {
    label: "Identidade verificada",
    detail: "Evidência válida e consentida",
    value: demonstration.identityUsdCents,
  },
  {
    label: "Conta profissional",
    detail: "Controle da conta comprovado",
    value: demonstration.professionalAccountsUsdCents,
  },
  {
    label: "Primeira operação quitada",
    detail: "Histórico interno da plataforma",
    value: demonstration.paidHistoryUsdCents,
  },
];

export default function LimitPage() {
  return (
    <div className="inner-page limit-page">
      <section className="page-hero page-hero--compact">
        <div className="shell page-hero__inner">
          <span className="eyebrow">Regra demonstrativa v0.1</span>
          <h1>Seu limite cresce com provas, não com popularidade.</h1>
          <p>
            Cada aumento tem uma regra visível. Seguidores, gênero e conteúdo
            publicado nunca entram no cálculo.
          </p>
        </div>
      </section>

      <section className="section limit-section">
        <div className="shell">
          <div className="demo-banner" role="status">
            <ShieldCheck aria-hidden="true" />
            <span>
              <strong>Perfil e garantia fictícios.</strong> Esta tela não consulta
              redes sociais, não recebe documentos e não bloqueia ativos reais.
            </span>
          </div>

          <div className="limit-layout">
            <article className="limit-summary" aria-labelledby="limit-title">
              <span className="limit-summary__label">Limite total</span>
              <h2 id="limit-title">{formatUsd(demonstration.totalUsdCents)}</h2>
              <div className="limit-amounts">
                <span>
                  <small>Em uso</small>
                  <strong>{formatUsd(usedUsdCents)}</strong>
                </span>
                <span>
                  <small>Disponível</small>
                  <strong>{formatUsd(availableUsdCents)}</strong>
                </span>
              </div>
              <label className="limit-progress">
                <span>Uso do limite</span>
                <progress
                  max={Number(demonstration.totalUsdCents)}
                  value={Number(usedUsdCents)}
                >
                  57%
                </progress>
              </label>
              <p className="limit-summary__note">
                Se uma evidência expirar, o limite pode cair. Valores já utilizados
                continuam registrados e novos pedidos ficam bloqueados até haver saldo.
              </p>
            </article>

            <article className="limit-breakdown" aria-labelledby="breakdown-title">
              <div className="limit-breakdown__heading">
                <span className="eyebrow">Composição</span>
                <h2 id="breakdown-title">Como chegamos a esse valor</h2>
              </div>
              <ul>
                {breakdown.map((item) => (
                  <li key={item.label}>
                    <span>
                      <strong>{item.label}</strong>
                      <small>{item.detail}</small>
                    </span>
                    <b>+ {formatUsd(item.value)}</b>
                  </li>
                ))}
              </ul>
              <div className="rule-stamp">
                Regra registrada: <strong>credit-limit-v0.1</strong>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="shell">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Caminhos transparentes</span>
              <h2>O que pode aumentar seu limite</h2>
            </div>
            <p>
              Sinais são consentidos, têm validade e podem ser revogados. Nenhum deles
              autoriza automaticamente um recebível.
            </p>
          </div>
          <div className="limit-paths">
            <article>
              <BadgeCheck aria-hidden="true" />
              <span className="status-pill status-pill--done">Concluído</span>
              <h3>Verificar identidade</h3>
              <p>Libera US$ 100 enquanto a evidência estiver válida.</p>
            </article>
            <article>
              <BriefcaseBusiness aria-hidden="true" />
              <span className="status-pill status-pill--done">1 de 2</span>
              <h3>Contas profissionais</h3>
              <p>US$ 50 por conta verificada, com máximo de US$ 100.</p>
            </article>
            <article>
              <History aria-hidden="true" />
              <span className="status-pill status-pill--done">1 quitada</span>
              <h3>Construir histórico</h3>
              <p>Operações pagas aumentam o componente sem garantia.</p>
            </article>
            <article>
              <LockKeyhole aria-hidden="true" />
              <span className="status-pill">Somente simulação</span>
              <h3>Apresentar garantia</h3>
              <p>US$ 500 elegíveis demonstram um limite total de US$ 1.000.</p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
