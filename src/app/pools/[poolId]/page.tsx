import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bitcoin, Clock3, MessageCircle, ShieldCheck, TrendingUp, Users } from "lucide-react";

import { findPublicPool, publicPools } from "@/data/public-pools";

export function generateStaticParams() { return publicPools.map(({ id }) => ({ poolId: id })); }

export async function generateMetadata({ params }: { params: Promise<{ poolId: string }> }): Promise<Metadata> {
  const pool = findPublicPool((await params).poolId);
  if (!pool) return {};
  return { title: pool.title, description: `Pool BTC ${pool.funded}% financiada, com ${pool.coverage}% de cobertura do principal.` };
}

export default async function PoolDetailsPage({ params }: { params: Promise<{ poolId: string }> }) {
  const pool = findPublicPool((await params).poolId);
  if (!pool) notFound();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const shareUrl = `${siteUrl}/pools/${pool.id}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`Ajude esta pool BTC a fechar. Veja prazo, riscos e cobertura: ${shareUrl}`)}`;

  return <div className="inner-page"><div className="shell pool-detail">
    <header className="pool-detail__header"><span className="eyebrow"><Bitcoin aria-hidden="true" size={16} /> Pool BTC avaliada</span><h1>{pool.title}</h1><p>Dados pessoais, documentos e informações do pagador permanecem privados.</p></header>
    <div className="pool-detail__layout"><main>
      <section className="pool-detail__amount"><span>Meta da pool</span><strong>{pool.amount}</strong><div className="progress" role="progressbar" aria-label={`${pool.funded}% financiado`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={pool.funded}><span style={{ width: `${pool.funded}%` }} /></div><small>{pool.funded}% financiado · prazo para completar: {pool.fundingDeadline}</small></section>
      <section className="pool-detail__facts" aria-label="Condições da pool">
        <article><Clock3 aria-hidden="true" /><span>Vencimento</span><strong>{pool.due}</strong></article>
        <article><TrendingUp aria-hidden="true" /><span>Desconto</span><strong>{pool.discount}</strong></article>
        <article><ShieldCheck aria-hidden="true" /><span>Cobertura do principal</span><strong>{pool.coverage}%</strong></article>
        <article><Users aria-hidden="true" /><span>Reputação</span><strong>{pool.reputation}</strong></article>
      </section>
      <section className="risk-card"><h2>O que está coberto</h2><p>Garantia em BTC e tesouraria reservada cobrem {pool.coverage}% do principal. Rendimentos esperados e variação do Bitcoin não são cobertos. O risco restante é de quem aporta.</p></section>
    </main><aside className="pool-detail__action"><span className="kicker">Participar</span><h2>Ajude esta pool a fechar</h2><p>Você poderá escolher qualquer valor disponível ou financiar toda a parte restante.</p><Link className="button button--primary" href={`/entrar?next=/pools/${pool.id}`}>Entrar para aportar</Link><a className="share-link share-link--large" href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" size={18} /> Compartilhar no WhatsApp</a><small>Aporte em contrato DLC será habilitado na etapa financeira.</small></aside></div>
  </div></div>;
}
