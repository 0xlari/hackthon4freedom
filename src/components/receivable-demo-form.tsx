"use client";

import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle2, Copy, ExternalLink, FlaskConical } from "lucide-react";

import type { ProtocolSignedEvent, ProtocolUnsignedEvent, ReceivableCreated } from "@protocol/schemas";
import { Nip07Signer, type Nip07Window } from "@nostr/signer";
import type { LrpOriginationMode } from "@/config/lrp-mode";
import { createDemoReceivable, getDemoState, type DemoReceivable } from "@/lib/demo-store";

const DEMO_MIN_DATE = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);
const DEMO_MAX_DATE = new Date(Date.now() + 90 * 86_400_000).toISOString().slice(0, 10);

type LrpDraft = { draftId: string; receivableId: string; status: string; confirmationUrl?: string; candidate?: ProtocolUnsignedEvent; publicEventId?: string };

async function saltedEvidence(file: File | null, requestKey: string) {
  const salt = crypto.getRandomValues(new Uint8Array(32));
  const source = file ? new Uint8Array(await file.arrayBuffer()) : new TextEncoder().encode(`no-evidence:${requestKey}`);
  const bytes = new Uint8Array(salt.length + source.length); bytes.set(salt); bytes.set(source, salt.length);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  const sha256 = [...new Uint8Array(digest)].map((value) => value.toString(16).padStart(2, "0")).join("");
  const extension = file?.name.toLowerCase().match(/\.(pdf|png|jpe?g)$/)?.[0] ?? ".pdf";
  const declaredMimeType = extension === ".pdf" ? "application/pdf" : extension === ".png" ? "image/png" : "image/jpeg";
  return { sha256, extension, declaredMimeType, byteSize: file?.size || source.length };
}

export function ReceivableDemoForm({ lrpMode = "LEGACY" }: { lrpMode?: LrpOriginationMode }) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [profileId, setProfileId] = useState("");
  const [sessionPubkey, setSessionPubkey] = useState<string>();
  const [created, setCreated] = useState<DemoReceivable>();
  const [lrpDraft, setLrpDraft] = useState<LrpDraft>();
  const [lrpSigner, setLrpSigner] = useState<Nip07Signer>();
  const [lrpStatus, setLrpStatus] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session", { cache: "no-store" }).then(async (response) => {
      if (!response.ok) return setAuthenticated(false);
      const body = await response.json() as { profile?: { id: string; nostrPubkey?: string | null } };
      if (!body.profile?.id) return setAuthenticated(false);
      setProfileId(body.profile.id);
      setSessionPubkey(body.profile.nostrPubkey ?? undefined);
      setCreated(getDemoState(body.profile.id).receivables[0]);
      setAuthenticated(true);
    }).catch(() => setAuthenticated(false));
  }, []);

  async function linkSigner(signer: Nip07Signer) {
    const pubkey = await signer.getPublicKey();
    if (sessionPubkey === pubkey) return pubkey;
    const challengeResponse = await fetch("/api/protocol/identity/challenge", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pubkey }) });
    const challenge = await challengeResponse.json() as { challengeId?: string; event?: ProtocolUnsignedEvent; error?: string };
    if (!challengeResponse.ok || !challenge.challengeId || !challenge.event) throw new Error(challenge.error ?? "Não foi possível vincular o signer.");
    const proof = await signer.signEvent(challenge.event);
    const completeResponse = await fetch("/api/protocol/identity/complete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ challengeId: challenge.challengeId, event: proof }) });
    const complete = await completeResponse.json() as { error?: string };
    if (!completeResponse.ok) throw new Error(complete.error ?? "Assinatura de vínculo inválida.");
    setSessionPubkey(pubkey);
    return pubkey;
  }

  async function prepareWithSigner(draftId: string) {
    try {
      setLrpStatus("Draft privado salvo. Solicitando seu signer Nostr…");
      const signer = Nip07Signer.fromWindow(window as unknown as Nip07Window);
      await linkSigner(signer);
      const response = await fetch("/api/receivables", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "prepare_candidate", draftId }) });
      const body = await response.json() as LrpDraft & { error?: string };
      if (!response.ok || !body.candidate) throw new Error(body.error ?? "Não foi possível preparar o evento público.");
      setLrpSigner(signer); setLrpDraft((current) => ({ ...current!, ...body }));
      setLrpStatus("Revise abaixo os dados públicos antes de assinar.");
    } catch (cause) {
      setLrpStatus("Seu draft privado foi salvo. Conecte um signer Nostr para continuar.");
      setError(cause instanceof Error ? cause.message : "Signer indisponível.");
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const data = new FormData(event.currentTarget);
    try {
      if (lrpMode !== "LEGACY") {
        const requestKey = crypto.randomUUID();
        const evidenceFile = data.get("evidence") instanceof File ? data.get("evidence") as File : null;
        const evidence = await saltedEvidence(evidenceFile?.size ? evidenceFile : null, requestKey);
        const shadowLegacyReceivable = lrpMode === "SHADOW" ? createDemoReceivable(profileId, {
          purpose: String(data.get("purpose")) as DemoReceivable["purpose"], description: String(data.get("description")),
          amountUsd: Number(data.get("amountUsd")), dueDate: String(data.get("dueDate")), payerName: String(data.get("payerName")),
          payerCountry: String(data.get("payerCountry")), evidenceName: evidenceFile?.name || "comprovante-demo.pdf",
        }) : undefined;
        if (shadowLegacyReceivable) setCreated(shadowLegacyReceivable);
        const response = await fetch("/api/receivables", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
          action: "create_private", requestKey,
          paymentPurpose: String(data.get("purpose")), paymentDescription: String(data.get("description")),
          nominalUsdCents: String(Math.round(Number(data.get("amountUsd")) * 100)), dueDate: String(data.get("dueDate")),
          payerName: String(data.get("payerName")), payerCountry: String(data.get("payerCountry")),
          evidenceName: evidenceFile?.name || "não informado", evidence,
          publicPseudonym: String(data.get("publicPseudonym") || "Prestadora LRP"),
        }) });
        const body = await response.json() as LrpDraft & { error?: string };
        if (!response.ok || !body.draftId) throw new Error(body.error ?? "Não foi possível salvar o recebível privado.");
        setLrpDraft(body);
        if (lrpMode === "SHADOW") return;
        await prepareWithSigner(body.draftId);
        return;
      }
      const receivable = createDemoReceivable(profileId, {
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

  async function signAndPublish() {
    if (!lrpDraft?.candidate) return;
    setError(""); setLrpStatus("Aguardando sua assinatura e dois ACKs dos relays…");
    try {
      const signer = lrpSigner ?? Nip07Signer.fromWindow(window as unknown as Nip07Window);
      await linkSigner(signer);
      const signed = await signer.signEvent(lrpDraft.candidate);
      const response = await fetch("/api/receivables", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "publish", draftId: lrpDraft.draftId, event: signed }) });
      const body = await response.json() as LrpDraft & { publicationStatus?: string; event?: ProtocolSignedEvent; error?: string };
      if (!response.ok && response.status !== 202) throw new Error(body.error ?? "Publicação falhou.");
      setLrpDraft((current) => ({ ...current!, ...body }));
      setLrpStatus(body.publicationStatus === "CONFIRMED" ? "Recebível confirmado por pelo menos dois relays." : "Um ACK foi registrado. O mesmo evento poderá ser reenviado.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Não foi possível publicar o recebível."); }
  }

  async function retryPublication() {
    if (!lrpDraft) return;
    setError(""); setLrpStatus("Reenviando exatamente o mesmo evento assinado…");
    try {
      const response = await fetch("/api/receivables", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "retry", draftId: lrpDraft.draftId }) });
      const body = await response.json() as LrpDraft & { publicationStatus?: string; error?: string };
      if (!response.ok && response.status !== 202) throw new Error(body.error ?? "Retry falhou.");
      setLrpDraft((current) => ({ ...current!, ...body }));
      setLrpStatus(body.publicationStatus === "CONFIRMED" ? "Recebível confirmado por pelo menos dois relays." : "Publicação ainda aguarda quórum.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Não foi possível repetir a publicação."); }
  }

  const confirmationUrl = created && typeof window !== "undefined"
    ? `${window.location.origin}/confirmar?demo=${created.token}`
    : "";

  if (authenticated === null) return <div className="dashboard-loading">Confirmando sua carteira…</div>;
  if (!authenticated) return <div className="demo-callout"><strong>Conecte sua carteira para continuar.</strong><a className="button button--primary" href="/entrar?next=/recebivel">Entrar com a carteira</a></div>;

  if (lrpMode === "LRP" && (lrpDraft?.status === "PUBLISHED" || lrpDraft?.status === "PROJECTION_PENDING")) {
    return <section className="demo-success">
      <CheckCircle2 aria-hidden="true" />
      <span className="kicker">Recebível LRP publicado</span>
      <h2>Sua assinatura recebeu quórum.</h2>
      <p>O recebível privado foi vinculado ao evento público <code>{lrpDraft.publicEventId}</code>. {lrpDraft.status === "PROJECTION_PENDING" ? "A projeção será restaurada pelo rebuild." : "A projeção reconstruível foi persistida."} Confirmação, avaliação e pool ainda continuam fora deste corte.</p>
      {lrpDraft.confirmationUrl ? <label>Link privado para a próxima etapa<input value={lrpDraft.confirmationUrl} readOnly /></label> : null}
      <div className="demo-actions"><a className="button button--secondary" href="/painel">Voltar ao painel</a></div>
    </section>;
  }

  if (lrpMode === "LRP" && lrpDraft?.candidate) {
    const publicContent = JSON.parse(lrpDraft.candidate.content) as ReceivableCreated;
    return <section className="confirmation-form">
      <span className="kicker">Revisão antes da assinatura</span>
      <h2>Somente estes dados serão públicos.</h2>
      <p>Nome do pagador, nome do arquivo e documento não entram no evento. A plataforma nunca solicita sua nsec.</p>
      <dl className="authorization-review">
        <div><dt>Título público</dt><dd>{publicContent.title}</dd></div>
        <div><dt>Pseudônimo</dt><dd>{publicContent.provider_pseudonym}</dd></div>
        <div><dt>Valor e moeda</dt><dd>{publicContent.nominal_amount_minor} unidades menores de {publicContent.original_currency}</dd></div>
        <div><dt>Vencimento</dt><dd>{new Date(publicContent.due_at * 1000).toLocaleDateString("pt-BR")}</dd></div>
        <div><dt>Categoria e país</dt><dd>{publicContent.category} · {publicContent.country}</dd></div>
        <div><dt>Compromisso da evidência</dt><dd><code>{publicContent.private_evidence_hash}</code></dd></div>
        <div><dt>Pubkey autora</dt><dd><code>{publicContent.provider_pubkey}</code></dd></div>
      </dl>
      <p role="status">{lrpStatus}</p>{error ? <p className="form-error" role="alert">{error}</p> : null}
      <div className="demo-actions">
        {lrpDraft.status === "PUBLICATION_PENDING"
          ? <button className="button button--primary" type="button" onClick={() => void retryPublication()}>Repetir o mesmo evento</button>
          : <button className="button button--primary" type="button" onClick={() => void signAndPublish()}>Assinar com minha pubkey e publicar</button>}
      </div>
    </section>;
  }

  if (lrpMode === "LRP" && lrpDraft) {
    return <section className="demo-success">
      <span className="kicker">Draft privado salvo</span><h2>Conecte seu signer Nostr para continuar.</h2>
      <p>Nada foi publicado. Seus dados privados permanecem no PostgreSQL e você pode tentar novamente sem criar outro recebível.</p>
      <p role="status">{lrpStatus}</p>{error ? <p className="form-error" role="alert">{error}</p> : null}
      <button className="button button--primary" type="button" onClick={() => void prepareWithSigner(lrpDraft.draftId)}>Conectar signer e revisar evento</button>
    </section>;
  }

  if (created && !["AWAITING_CLIENT", "REJECTED"].includes(created.status)) {
    const pool = getDemoState(profileId).pools.find((item) => item.title === created.description);
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
    <div className="demo-mode-banner"><FlaskConical aria-hidden="true" /><span><strong>{lrpMode === "LRP" ? "Modo LRP experimental" : "Modo demonstração do hackathon"}</strong> {lrpMode === "LRP" ? "Os dados privados serão salvos no PostgreSQL. Só os campos identificados como públicos serão enviados aos relays depois da sua assinatura." : "Os dados ficam neste navegador. Limite demonstrativo: US$ 5.000. Nenhum fundo é movimentado."}</span></div>
    <div className="form-grid">
      <label>Origem do pagamento<select name="purpose" required defaultValue="SERVICE"><option value="SERVICE">Serviço</option><option value="SALARY">Salário</option><option value="SALE">Venda</option><option value="COMMISSION">Comissão</option><option value="OTHER">Outro</option></select></label>
      <label>Valor em USD<input name="amountUsd" type="number" min="10" max="5000" step="0.01" defaultValue="100" required /></label>
      <label className="form-grid__wide">Descrição do pagamento<input name="description" minLength={3} maxLength={90} defaultValue="Projeto internacional de design" required /></label>
      {lrpMode === "LRP" ? <label className="form-grid__wide">Pseudônimo público<input name="publicPseudonym" minLength={2} maxLength={60} defaultValue="Prestadora LRP" required /><small>Será publicado no evento junto com descrição, valor, moeda, vencimento, categoria, país e hash da evidência.</small></label> : null}
      <label>Data combinada<input name="dueDate" type="date" min={DEMO_MIN_DATE} max={DEMO_MAX_DATE} required /></label>
      <label>País do pagador<select name="payerCountry" defaultValue="US" required><option value="US">Estados Unidos</option><option value="CA">Canadá</option><option value="GB">Reino Unido</option><option value="PT">Portugal</option><option value="OTHER">Outro</option></select></label>
      <label className="form-grid__wide">Nome ou empresa do pagador<input name="payerName" defaultValue="Cliente internacional" required /></label>
      <label className="form-grid__wide">Comprovante do recebível<input name="evidence" type="file" accept=".pdf,.png,.jpg,.jpeg" /></label>
    </div>
    {error ? <p className="form-error" role="alert">{error}</p> : null}
    <button className="button button--primary" type="submit">{lrpMode === "LRP" ? "Salvar e revisar evento público" : "Cadastrar e gerar link"}</button>
  </form>;
}
