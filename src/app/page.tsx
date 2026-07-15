import {
  ArrowRight,
  BadgeCheck,
  Bitcoin,
  FileCheck2,
  Globe2,
  LockKeyhole,
  Radio,
  Sparkles,
} from "lucide-react";
import { ButtonLink } from "@/components/button-link";
import { PoolCard } from "@/components/pool-card";

const steps = [
  {
    number: "01",
    title: "Você apresenta o recebível",
    body: "Cadastre o salário, venda, comissão, serviço ou outro pagamento, com valor e data combinados com o pagador no exterior.",
  },
  {
    number: "02",
    title: "O pagador confirma e aceita BTC",
    body: "Por um link seguro, ele confirma os dados e concorda em pagar uma invoice Lightning no vencimento.",
  },
  {
    number: "03",
    title: "A plataforma valida",
    body: "Identidade, evidências, duplicidade e histórico passam por regras claras antes da pool existir.",
  },
  {
    number: "04",
    title: "Você recebe hoje",
    body: "Aportadoras completam a pool e a antecipação é enviada para sua carteira em Bitcoin.",
  },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="shell hero__grid">
          <div className="hero__copy">
            <div className="eyebrow">
              <Sparkles aria-hidden="true" size={16} />
              Liquidez para quem tem a receber do exterior
            </div>
            <h1>
              Seu pagamento já tem data. <em>Seu dinheiro não precisa esperar.</em>
            </h1>
            <p className="hero__lead">
              Antecipe pagamentos de pagadores no exterior com uma pool financiada em
              Bitcoin — de forma clara, comunitária e focada em mulheres
              no centro.
            </p>
            <div className="hero__actions">
              <ButtonLink href="/como-funciona">
                Entenda como funciona <ArrowRight aria-hidden="true" size={18} />
              </ButtonLink>
              <ButtonLink href="/pools" variant="secondary">
                Ver pools demonstrativas
              </ButtonLink>
            </div>
            <ul className="trust-list" aria-label="Princípios da plataforma">
              <li>
                <BadgeCheck aria-hidden="true" size={17} /> Validação da plataforma
              </li>
              <li>
                <Bitcoin aria-hidden="true" size={17} /> BTC via Lightning
              </li>
              <li>
                <Radio aria-hidden="true" size={17} /> Reputação portátil
              </li>
            </ul>
          </div>

          <div className="hero-board" aria-label="Exemplo demonstrativo de recebível">
            <div className="hero-board__halo" aria-hidden="true" />
            <div className="receipt-card">
              <div className="receipt-card__head">
                <span className="tag tag--success">
                  <FileCheck2 aria-hidden="true" size={15} /> Recebível aprovado
                </span>
                <span className="receipt-card__id">#ERH-024</span>
              </div>
              <p>Pagamento internacional confirmado</p>
              <strong>US$ 2.000</strong>
              <div className="receipt-card__rows">
                <span>
                  <small>Antecipação</small>
                  US$ 1.900 em BTC
                </span>
                <span>
                  <small>Vencimento</small>
                  Dia 30
                </span>
              </div>
            </div>
            <div className="floating-note floating-note--client">
              <Globe2 aria-hidden="true" size={18} />
              <span>
                Pagador no exterior
                <strong>Pagamento em BTC aceito</strong>
              </span>
            </div>
            <div className="floating-note floating-note--wallet">
              <Bitcoin aria-hidden="true" size={18} />
              <span>
                Para sua carteira
                <strong>Liquidação Lightning</strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="signal-strip" aria-label="Resumo do produto">
        <div className="shell signal-strip__inner">
          <span>Brasil → mundo</span>
          <span>Recebível confirmado</span>
          <span>Pool em Bitcoin</span>
          <span>Custos transparentes</span>
        </div>
      </section>

      <section className="section section--steps">
        <div className="shell">
          <div className="section-heading">
            <div>
              <span className="kicker">Da entrega à liquidez</span>
              <h2>Quatro passos. Nenhuma promessa escondida.</h2>
            </div>
            <p>
              O pagador precisa aceitar pagar em BTC. Sem esse aceite, nenhuma pool é
              aberta e nenhum dinheiro entra na plataforma.
            </p>
          </div>
          <div className="steps-grid">
            {steps.map((step) => (
              <article className="step-card" key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--pools">
        <div className="shell pools-layout">
          <div className="pools-copy">
            <span className="kicker">Duas formas de participar</span>
            <h2>Escolha como a variação do Bitcoin entra na história.</h2>
            <p>
              A Full BTC acompanha a variação em sats. A pareada em dólar protege a
              obrigação da pool em USDT, mas a solicitante continua recebendo BTC.
            </p>
            <div className="notice">
              <LockKeyhole aria-hidden="true" size={20} />
              <span>
                <strong>Dados fictícios.</strong> Estas pools existem para explicar o
                produto; nenhuma está aberta para aporte nesta etapa.
              </span>
            </div>
            <ButtonLink href="/pools" variant="secondary">
              Comparar modalidades
            </ButtonLink>
          </div>
          <div className="pools-stack">
            <PoolCard
              label="Full BTC"
              title="Identidade visual para estúdio"
              amount="1.840.000 sats"
              funded={72}
              due="em 24 dias"
              mode="btc"
            />
            <PoolCard
              label="Pareada em dólar"
              title="Pesquisa para pagador internacional"
              amount="US$ 950 em referência"
              funded={41}
              due="em 18 dias"
              mode="usd"
            />
          </div>
        </div>
      </section>

      <section className="section section--reputation">
        <div className="shell reputation-card">
          <div>
            <span className="kicker kicker--light">Confiança que acompanha você</span>
            <h2>Reputação não é uma nota misteriosa.</h2>
            <p>
              Identidade, recebíveis concluídos, pagamentos e histórico aparecem como
              sinais separados. Atestados Nostr usam somente referências não sensíveis.
            </p>
          </div>
          <div className="reputation-signals">
            <span>
              <BadgeCheck aria-hidden="true" /> Identidade verificada
            </span>
            <span>
              <FileCheck2 aria-hidden="true" /> 3 operações concluídas
            </span>
            <span>
              <Radio aria-hidden="true" /> Atestado portátil
            </span>
          </div>
        </div>
      </section>

      <section className="section final-cta">
        <div className="shell final-cta__inner">
          <span className="kicker">Elas recebem hoje</span>
          <h2>O futuro do trabalho já chegou. O pagamento também pode chegar.</h2>
          <p>
            Conheça o fluxo antes do lançamento. Nenhuma operação financeira está
            habilitada nesta versão.
          </p>
          <ButtonLink href="/como-funciona">
            Explorar o produto <ArrowRight aria-hidden="true" size={18} />
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
