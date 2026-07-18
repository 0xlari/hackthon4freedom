"use client";

import { useEffect, useState, type FormEvent } from "react";
import { BadgeCheck, CircleAlert, LockKeyhole } from "lucide-react";
import { confirmDemoReceivable, findDemoReceivableByToken } from "@/lib/demo-store";

type Details = {
  paymentDescription: string;
  paymentPurpose: "SERVICE" | "SALARY" | "SALE" | "COMMISSION" | "OTHER";
  nominalUsdCents: string;
  dueAt: string;
  termsVersion: string;
};

const purposeLabels: Record<Details["paymentPurpose"], string> = {
  SERVICE: "Prestação de serviço",
  SALARY: "Salário",
  SALE: "Venda",
  COMMISSION: "Comissão",
  OTHER: "Outro pagamento",
};

function formatInputAmount(cents: string) {
  return `${BigInt(cents) / 100n}.${(BigInt(cents) % 100n).toString().padStart(2, "0")}`;
}

export function ClientConfirmationForm() {
  const [token, setToken] = useState("");
  const [details, setDetails] = useState<Details>();
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [acceptsBtc, setAcceptsBtc] = useState(true);
  const [confirmsDescription, setConfirmsDescription] = useState(true);
  const [status, setStatus] = useState<"loading" | "ready" | "sending" | "done" | "error">("loading");
  const [result, setResult] = useState("");
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    const demoToken = new URLSearchParams(window.location.search).get("demo") ?? "";
    const rawToken = demoToken || window.location.hash.slice(1);
    if (!demoToken) window.history.replaceState(null, "", window.location.pathname);
    void (async () => {
      await Promise.resolve();
      if (!rawToken) {
        setStatus("error");
        return;
      }
      setToken(rawToken);
      if (demoToken) {
        const receivable = findDemoReceivableByToken(demoToken);
        if (!receivable || receivable.status !== "AWAITING_CLIENT") {
          setStatus("error");
          return;
        }
        setDemoMode(true);
        setDetails({ paymentDescription: receivable.description, paymentPurpose: receivable.purpose, nominalUsdCents: String(Math.round(receivable.amountUsd * 100)), dueAt: `${receivable.dueDate}T12:00:00.000Z`, termsVersion: "hackathon-demo-v1" });
        setAmount(receivable.amountUsd.toFixed(2));
        setDueDate(receivable.dueDate);
        setStatus("ready");
        return;
      }
      try {
        const response = await fetch("/api/client-confirmations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "inspect", token: rawToken }),
          cache: "no-store",
        });
        if (!response.ok) throw new Error();
        const data = (await response.json()) as Details;
        setDetails(data);
        setAmount(formatInputAmount(data.nominalUsdCents));
        setDueDate(data.dueAt.slice(0, 10));
        setStatus("ready");
      } catch {
        setStatus("error");
      }
    })();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!details) return;
    setStatus("sending");
    if (demoMode) {
      try {
        confirmDemoReceivable(token, acceptsBtc && confirmsDescription);
        setResult(acceptsBtc && confirmsDescription ? "Confirmação demonstrativa registrada. O recebível já está disponível para avaliação da plataforma." : "Recusa registrada. Este recebível não poderá criar uma pool.");
        setStatus("done");
      } catch (cause) {
        setResult(cause instanceof Error ? cause.message : "Não foi possível registrar a resposta.");
        setStatus("error");
      }
      return;
    }
    const response = await fetch("/api/client-confirmations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "respond", token, acceptsBtc, confirmsDescription, amountUsd: amount, dueDate, termsVersion: details.termsVersion }),
    });
    const data = (await response.json()) as { outcome?: string; error?: string };
    if (!response.ok || !data.outcome) {
      setResult(data.error ?? "Não foi possível registrar a resposta.");
      setStatus("error");
      return;
    }
    setResult(
      data.outcome === "ACCEPTED"
        ? "Confirmação registrada. A plataforma fará a avaliação automática."
        : data.outcome === "DIVERGED"
          ? "Divergência registrada. A solicitante deverá corrigir e enviar um novo link."
          : "Recusa registrada. Este recebível não poderá criar uma pool.",
    );
    setStatus("done");
  }

  if (status === "loading") return <div className="confirmation-state">Validando o link com segurança…</div>;
  if (status === "error" && !details) {
    return <div className="confirmation-state confirmation-state--error"><CircleAlert aria-hidden="true" /><strong>Este link é inválido, expirou ou já foi usado.</strong><span>Peça à solicitante um novo link de confirmação.</span></div>;
  }
  if (status === "done") {
    return <div className="confirmation-state confirmation-state--done"><BadgeCheck aria-hidden="true" /><strong>Resposta concluída</strong><span>{result}</span></div>;
  }

  return (
    <form className="confirmation-form" onSubmit={submit}>
      <div className="confirmation-form__security"><LockKeyhole aria-hidden="true" /> {demoMode ? "Confirmação demonstrativa: a assinatura da carteira é simulada e nenhum sat é movimentado." : "Link de uso único. A aportadora não recebe nem valida estes dados."}</div>
      <label>Origem do pagamento<input value={details ? purposeLabels[details.paymentPurpose] : ""} readOnly /></label>
      <label>Descrição do pagamento<input value={details?.paymentDescription ?? ""} readOnly /></label>
      <label><input type="checkbox" checked={confirmsDescription} onChange={(event) => setConfirmsDescription(event.target.checked)} /> Confirmo que reconheço a origem e a descrição deste pagamento.</label>
      <div className="confirmation-form__grid">
        <label>Valor em USD<input inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} required /></label>
        <label>Data de pagamento<input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} required /></label>
      </div>
      <fieldset>
        <legend>Você aceita pagar este recebível em Bitcoin (BTC)?</legend>
        <label><input type="radio" name="btc" checked={acceptsBtc} onChange={() => setAcceptsBtc(true)} /> Sim, aceito pagar em BTC</label>
        <label><input type="radio" name="btc" checked={!acceptsBtc} onChange={() => setAcceptsBtc(false)} /> Não aceito pagar em BTC</label>
      </fieldset>
      <p className="confirmation-form__note">Se aceitar, o link de pagamento Lightning será enviado somente próximo ao vencimento. Nenhum dólar entra na plataforma.</p>
      {status === "error" && result ? <p className="form-error" role="alert">{result}</p> : null}
      <button className="button button--primary" disabled={status === "sending"} type="submit">{status === "sending" ? "Registrando…" : demoMode ? "Simular assinatura e confirmar" : "Registrar minha resposta"}</button>
    </form>
  );
}
