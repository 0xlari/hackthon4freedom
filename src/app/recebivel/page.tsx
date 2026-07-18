import type { Metadata } from "next";
import { BadgeCheck, FileCheck2, Link2, ShieldCheck } from "lucide-react";
import { ReceivableAccessAction } from "@/components/receivable-access-action";

export const metadata: Metadata = { title: "Criar recebível", description: "Cadastre um pagamento internacional para avaliação da plataforma." };

export default function ReceivablePage() {
  return <div className="inner-page">
    <section className="page-hero page-hero--compact"><div className="shell page-hero__inner"><span className="eyebrow">Novo recebível</span><h1>Cadastre o pagamento que você tem a receber.</h1><p>Salário, venda, comissão, serviço ou outro pagamento legítimo do exterior. Você pode manter somente um recebível ativo por vez.</p></div></section>
    <section className="section"><div className="shell receivable-flow">
      <div className="receivable-requirements">
        <article><FileCheck2 aria-hidden="true" /><div><h2>Dados e comprovantes</h2><p>Valor, moeda, vencimento, origem do pagamento e arquivos PDF, JPG ou PNG ficam privados.</p></div></article>
        <article><Link2 aria-hidden="true" /><div><h2>Assinatura do pagador</h2><p>Você envia um link. O pagador confirma com a carteira; a assinatura não movimenta sats.</p></div></article>
        <article><BadgeCheck aria-hidden="true" /><div><h2>Avaliação da plataforma</h2><p>Identidade, documento, duplicidade, limite e histórico são avaliados antes da pool BTC.</p></div></article>
      </div>
      <aside className="receivable-start"><ShieldCheck aria-hidden="true" /><span className="kicker">Critérios iniciais</span><h2>Prepare seu cadastro</h2><ul><li>Documento do recebível</li><li>Valor e data combinados</li><li>Contato do pagador</li><li>Confirmação de pagamento em BTC</li></ul><ReceivableAccessAction /></aside>
    </div></section>
  </div>;
}
