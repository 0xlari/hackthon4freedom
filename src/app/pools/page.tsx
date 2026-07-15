import type { Metadata } from "next";
import { AlertCircle, Bitcoin, ShieldCheck } from "lucide-react";
import { PoolCard } from "@/components/pool-card";
import { PoolSimulator } from "@/components/pool-simulator";

export const metadata: Metadata = {
  title: "Pools demonstrativas",
  description: "Compare as modalidades Full BTC e pareada em dólar.",
};

export default function PoolsPage() {
  return (
    <div className="inner-page">
      <section className="page-hero page-hero--compact">
        <div className="shell page-hero__inner">
          <span className="eyebrow">Ambiente demonstrativo</span>
          <h1>Pools com riscos que você consegue enxergar.</h1>
          <p>
            Compare exposição, referência e vencimento. Aportadoras não validam
            recebíveis; elas decidem participar depois da validação da plataforma.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="shell">
          <div className="demo-banner" role="status">
            <AlertCircle aria-hidden="true" />
            <span>
              <strong>Nenhum aporte está habilitado.</strong> Valores e operações desta
              página são fictícios.
            </span>
          </div>
          <PoolSimulator />
          <div className="section-heading pool-list-heading">
            <div>
              <span className="eyebrow">Pools aprovadas</span>
              <h2>Compare antes de aportar</h2>
            </div>
            <p>Os exemplos abaixo usam recebíveis já avaliados pela plataforma. Documentos e dados privados nunca são mostrados.</p>
          </div>
          <div className="pool-grid">
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
            <PoolCard
              label="Full BTC"
              title="Campanha para marca global"
              amount="2.110.000 sats"
              funded={88}
              due="em 11 dias"
              mode="btc"
            />
          </div>
          <div className="mode-comparison">
            <article>
              <Bitcoin aria-hidden="true" />
              <h2>Full BTC</h2>
              <p>
                A quantidade final de sats varia conforme a equivalência do recebível no
                vencimento. A aportadora assume essa oscilação.
              </p>
            </article>
            <article>
              <ShieldCheck aria-hidden="true" />
              <h2>Pareada em dólar</h2>
              <p>
                A obrigação é protegida exclusivamente em USDt Liquid e acompanhada em
                USD. A solicitante ainda recebe BTC de uma tesouraria separada.
              </p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
