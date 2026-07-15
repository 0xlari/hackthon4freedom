import type { Metadata } from "next";
import { BadgeCheck, FileCheck2, Link2, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Novo recebível",
  description: "Entenda o cadastro e a validação de um recebível internacional.",
};

export default function ReceivablePage() {
  return (
    <div className="inner-page">
      <section className="page-hero page-hero--compact"><div className="shell page-hero__inner"><span className="eyebrow">Recebível internacional</span><h1>Você cadastra. O pagador confirma. A plataforma avalia.</h1><p>No piloto, a solicitante está no Brasil e tem um pagamento legítimo a receber do exterior — salário, venda, comissão, serviço ou outra origem comprovável. A liquidação será somente em BTC.</p></div></section>
      <section className="section"><div className="shell">
        <div className="demo-banner" role="status"><ShieldCheck aria-hidden="true" /><span><strong>Fluxo seguro demonstrativo.</strong> O cadastro público permanece bloqueado até a autenticação da participante. Documentos reais não são recebidos nesta tela.</span></div>
        <div className="receivable-preview">
          <article><span className="eyebrow">Exemplo fictício</span><h2>Pagamento internacional confirmado</h2><dl><div><dt>Origem</dt><dd>Salário, venda, comissão, serviço ou outro</dd></div><div><dt>Valor nominal</dt><dd>US$ 2.000,00</dd></div><div><dt>Vencimento</dt><dd>30 dias</dd></div><div><dt>Liquidação</dt><dd>Somente BTC</dd></div></dl><div className="disabled-action">Cadastro disponível após autenticação segura</div></article>
          <ol>
            <li><FileCheck2 aria-hidden="true" /><span><strong>Documento privado</strong>Tipo real, tamanho, malware e duplicidade são verificados.</span></li>
            <li><Link2 aria-hidden="true" /><span><strong>Link de uso único</strong>O pagador confirma origem, descrição, valor, data e aceite de BTC.</span></li>
            <li><BadgeCheck aria-hidden="true" /><span><strong>Avaliação da plataforma</strong>Regras versionadas decidem; revisão humana é excepcional e auditada.</span></li>
          </ol>
        </div>
      </div></section>
    </div>
  );
}
