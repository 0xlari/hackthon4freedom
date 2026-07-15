import type { Metadata } from "next";
import { ArrowRight, Bitcoin, CheckCircle2, CircleDollarSign, ShieldCheck } from "lucide-react";
import { ButtonLink } from "@/components/button-link";

export const metadata: Metadata = {
  title: "Como funciona",
  description: "Conheça o fluxo demonstrativo do recebível até a liquidação em Bitcoin.",
};

const stages = [
  {
    icon: CircleDollarSign,
    title: "1. Cadastre o recebível",
    body: "Informe a origem do pagamento, a descrição, o valor em USD, o pagador e o vencimento.",
  },
  {
    icon: CheckCircle2,
    title: "2. Peça a confirmação",
    body: "O pagador confere origem, descrição, valor e data, e aceita pagar em BTC. Se recusar, o fluxo termina antes da pool.",
  },
  {
    icon: ShieldCheck,
    title: "3. Passe pela validação",
    body: "A plataforma analisa identidade, evidências, limite, duplicidade e histórico com regras explicáveis.",
  },
  {
    icon: Bitcoin,
    title: "4. Receba em Bitcoin",
    body: "Depois que a pool fechar, a antecipação líquida segue por Lightning para a carteira da solicitante.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="inner-page">
      <section className="page-hero">
        <div className="shell page-hero__inner">
          <span className="eyebrow">Fluxo demonstrativo</span>
          <h1>Do trabalho entregue ao Bitcoin na carteira.</h1>
          <p>
            A plataforma não recebe dólares. O valor em USD registra o contrato; o
            pagador adquire BTC fora da plataforma e paga uma invoice Lightning.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="shell timeline">
          {stages.map(({ icon: Icon, title, body }) => (
            <article className="timeline__item" key={title}>
              <span className="timeline__icon">
                <Icon aria-hidden="true" />
              </span>
              <div>
                <h2>{title}</h2>
                <p>{body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="section section--tinted">
        <div className="shell split-callout">
          <div>
            <span className="kicker">Regra essencial</span>
            <h2>Sem aceite em BTC, sem pool.</h2>
          </div>
          <div>
            <p>
              O aceite fica registrado junto à confirmação do recebível. A cotação,
              validade da invoice e quantidade de sats são apresentadas antes do
              pagamento.
            </p>
            <ButtonLink href="/pools" variant="secondary">
              Conhecer as modalidades <ArrowRight aria-hidden="true" size={18} />
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
