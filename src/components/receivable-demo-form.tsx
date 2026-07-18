"use client";

import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle2, Copy, ExternalLink, FlaskConical } from "lucide-react";

import { createDemoReceivable, getDemoState, type DemoReceivable } from "@/lib/demo-store";

const DEMO_MIN_DATE = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);
const DEMO_MAX_DATE = new Date(Date.now() + 90 * 86_400_000).toISOString().slice(0, 10);

export function ReceivableDemoForm() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [created, setCreated] = useState<DemoReceivable>();
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session", { cache: "no-store" }).then((response) => setAuthenticated(response.ok)).catch(() => setAuthenticated(false));
    queueMicrotask(() => setCreated(getDemoState().receivables[0]));
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const data = new FormData(event.currentTarget);
    try {
      const receivable = createDemoReceivable({
        purpose: String(data.get("purpose")) as DemoReceivable["purpose"],
        description: String(data.get("description")),
        amountUsd: Number(data.get("amountUsd")),
        dueDate: String(data.get("dueDate")),
        payerName: String(data.get("payerName")),
        payerCountry: String(data.get("payerCountry")),
        evidenceName: (data.get("evidence") as File | null)?.name || "comprovante-demo.pdf",
      });
      setCreated(receivable);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível criar o recebível.");
    }
  }

  const confirmationUrl = created && typeof window !== "undefined"
    ? `${window.location.origin}/confirmar?demo=${created.token}`
    : "";

  if (authenticated === null) return <div className="dashboard-loading">Confirmando sua carteira…</div>;
  if (!authenticated) return <div className="demo-callout"><strong>Conecte sua carteira para continuar.</strong><a className="button button--primary" href="/entrar?next=/recebivel">Entrar com a carteira</a></div>;

  if (created && !["AWAITING_CLIENT", "REJECTED"].includes(created.status)) {
    const pool = getDemoState().pools.find((item) => item.title === created.description);
    const underReview = created.status === "UNDER_REVIEW";
    return <section className="demo-success">
      <CheckCircle2 aria-hidden="true" />
      <span className="kicker">Recebível ativo</span>
      <h2>{underReview ? "Aguardando avaliação da plataforma." : "Sua pool BTC foi criada."}</h2>
      <p>{underReview ? "O pagador já confirmou os dados e o aceite de BTC. Abra a administração do hackathon para aprovar ou rejeitar." : "O recebível aprovado já aparece nas pools abertas e pode receber aportes demonstrativos."}</p>
      <div className="demo-actions"><a className="button button--primary" href={underReview ? "/administracao" : pool ? `/pools/${pool.id}` : "/pools"}>{underReview ? "Abrir avaliação" : "Ver pool"}</a><a className="button button--secondary" href="/painel">Voltar ao painel</a></div>
    </section>;
  }

  if (created?.status === "AWAITING_CLIENT") {
    return <section className="demo-success">
      <CheckCircle2 aria-hidden="true" />
      <span className="kicker">Recebível cadastrado</span>
      <h2>Agora envie o link ao pagador.</h2>
      <p>Ele verá valor, data e origem, e confirmará que aceita pagar em BTC. Nesta demonstração, a assinatura da carteira é simulada e não movimenta sats.</p>
      <label>Link de confirmação<input value={confirmationUrl} readOnly /></label>
      <div className="demo-actions">
        <button className="button button--secondary" type="button" onClick={() => { void navigator.clipboard.writeText(confirmationUrl); setCopied(true); }}><Copy size={17} /> {copied ? "Copiado" : "Copiar link"}</button>
        <a className="button button--primary" href={confirmationUrl} target="_blank" rel="noreferrer">Abrir como pagador <ExternalLink size={17} /></a>
      </div>
      <a href="/painel">Voltar ao painel</a>
    </section>;
  }

  return <form className="receivable-demo-form" onSubmit={submit}>
    <div className="demo-mode-banner"><FlaskConical aria-hidden="true" /><span><strong>Modo demonstração do hackathon</strong> Os dados ficam neste navegador. Limite demonstrativo: US$ 5.000. Nenhum fundo é movimentado.</span></div>
    <div className="form-grid">
      <label>Origem do pagamento<select name="purpose" required defaultValue="SERVICE"><option value="SERVICE">Serviço</option><option value="SALARY">Salário</option><option value="SALE">Venda</option><option value="COMMISSION">Comissão</option><option value="OTHER">Outro</option></select></label>
      <label>Valor em USD<input name="amountUsd" type="number" min="10" max="5000" step="0.01" defaultValue="100" required /></label>
      <label className="form-grid__wide">Descrição do pagamento<input name="description" minLength={3} maxLength={90} defaultValue="Projeto internacional de design" required /></label>
      <label>Data combinada<input name="dueDate" type="date" min={DEMO_MIN_DATE} max={DEMO_MAX_DATE} required /></label>
      <label>País do pagador<select name="payerCountry" defaultValue="US" required><option value="US">Estados Unidos</option><option value="CA">Canadá</option><option value="GB">Reino Unido</option><option value="PT">Portugal</option><option value="OTHER">Outro</option></select></label>
      <label className="form-grid__wide">Nome ou empresa do pagador<input name="payerName" defaultValue="Cliente internacional" required /></label>
      <label className="form-grid__wide">Comprovante do recebível<input name="evidence" type="file" accept=".pdf,.png,.jpg,.jpeg" /></label>
    </div>
    {error ? <p className="form-error" role="alert">{error}</p> : null}
    <button className="button button--primary" type="submit">Cadastrar e gerar link</button>
  </form>;
}
