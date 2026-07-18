import type { Metadata } from "next";
import { Bitcoin } from "lucide-react";

import { PoolCard } from "@/components/pool-card";
import { publicPools } from "@/data/public-pools";

export const metadata: Metadata = { title: "Pools BTC", description: "Pools BTC avaliadas pela plataforma, com prazo, cobertura e risco transparentes." };

export default function PoolsPage() {
  return (
    <div className="inner-page">
      <section className="page-hero page-hero--compact"><div className="shell page-hero__inner">
        <span className="eyebrow"><Bitcoin aria-hidden="true" size={16} /> Pools abertas</span>
        <h1>Escolha uma pool. Entenda o risco. Aporte em BTC.</h1>
        <p>Todos os recebíveis foram confirmados pelo pagador e avaliados pela plataforma. A aportadora decide apenas se quer participar.</p>
      </div></section>
      <section className="section"><div className="shell">
        <div className="pool-list-intro"><div><span className="kicker">Full BTC</span><h2>Pools buscando financiamento</h2></div><p>O principal, a cobertura disponível e a parte não coberta aparecem antes do aporte. Rendimentos não são garantidos.</p></div>
        <div className="pool-grid">{publicPools.map((pool) => <PoolCard key={pool.id} pool={pool} />)}</div>
      </div></section>
    </div>
  );
}
