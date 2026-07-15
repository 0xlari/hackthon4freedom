"use client";

import { useState } from "react";
import { CircleCheck, CircleDashed, ShieldAlert } from "lucide-react";

const stages = [
  { title: "Recebível avaliado", detail: "Pagamento internacional em BTC, com aceite do cliente confirmado pela plataforma." },
  { title: "Pool quase completa", detail: "Exemplo Full BTC com 92% da meta demonstrativa preenchida." },
  { title: "Invoice Lightning", detail: "Invoice fictícia de 750 sats, abaixo do teto controlado de 1.000 sats." },
  { title: "Confirmação e ledger", detail: "Evento simulado entra uma vez e os lançamentos permanecem balanceados." },
  { title: "Atestação Nostr", detail: "Reputação positiva simulada, sem valor, pagador ou documento no evento." },
];

export function DemoRehearsal() {
  const [step, setStep] = useState(0);
  const [fallback, setFallback] = useState(false);
  const current = stages[step];

  return (
    <div className="demo-rehearsal">
      <div className="demo-rehearsal__warning" role="status">
        <ShieldAlert aria-hidden="true" />
        <strong>DEMONSTRAÇÃO — nenhum fundo movimentado</strong>
      </div>
      <div className="demo-rehearsal__toolbar" aria-label="Controles do ensaio">
        <button type="button" aria-pressed={!fallback} onClick={() => setFallback(false)}>Ensaio guiado</button>
        <button type="button" aria-pressed={fallback} onClick={() => setFallback(true)}>Fallback offline</button>
      </div>

      {fallback ? (
        <section className="demo-fallback" aria-live="polite">
          <span className="eyebrow">Plano alternativo pronto</span>
          <h2>O fluxo continua visível, mesmo sem rede.</h2>
          <p>Esta reprodução local usa somente dados fictícios. Não cria invoice, não conecta ao Breez SDK e não solicita chave.</p>
          <dl>
            <div><dt>Pool</dt><dd>92% preenchida</dd></div>
            <div><dt>Invoice</dt><dd>750 sats · fictícia</dd></div>
            <div><dt>Resultado</dt><dd>ledger conciliado · simulação</dd></div>
          </dl>
        </section>
      ) : (
        <section className="demo-rehearsal__stage" aria-live="polite">
          <div>
            <span className="eyebrow">Etapa {step + 1} de {stages.length}</span>
            <h2>{current.title}</h2>
            <p>{current.detail}</p>
          </div>
          <ol aria-label="Progresso do ensaio">
            {stages.map((stage, index) => (
              <li key={stage.title} data-state={index < step ? "done" : index === step ? "current" : "pending"}>
                {index <= step ? <CircleCheck aria-hidden="true" /> : <CircleDashed aria-hidden="true" />}
                <span>{stage.title}</span>
              </li>
            ))}
          </ol>
          <button className="button button--primary" type="button" onClick={() => setStep((value) => Math.min(value + 1, stages.length - 1))} disabled={step === stages.length - 1}>
            {step === stages.length - 1 ? "Ensaio concluído" : "Avançar ensaio"}
          </button>
        </section>
      )}
    </div>
  );
}
