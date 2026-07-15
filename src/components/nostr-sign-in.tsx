"use client";
import { useState } from "react";
import { KeyRound, LoaderCircle, Radio } from "lucide-react";
import type { Event, EventTemplate } from "nostr-tools";

declare global { interface Window { nostr?: { getPublicKey(): Promise<string>; signEvent(event: EventTemplate): Promise<Event>; }; } }
type State = "idle" | "working" | "success" | "error";

export function NostrSignIn() {
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("Sua chave privada permanece no seu signer.");
  async function signIn() {
    setState("working"); setMessage("Aguardando autorização no signer…");
    try {
      if (!window.nostr) throw new Error("NIP07_MISSING");
      const pubkey = await window.nostr.getPublicKey();
      const challengeResponse = await fetch("/api/nostr-auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "challenge", pubkey }) });
      if (!challengeResponse.ok) throw new Error("CHALLENGE_FAILED");
      const challenge = (await challengeResponse.json()) as { challengeId: string; event: EventTemplate };
      const signedEvent = await window.nostr.signEvent(challenge.event);
      const verifyResponse = await fetch("/api/nostr-auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "verify", challengeId: challenge.challengeId, event: signedEvent }) });
      if (!verifyResponse.ok) throw new Error("VERIFY_FAILED");
      setState("success"); setMessage(`Conectada com ${pubkey.slice(0, 8)}…${pubkey.slice(-8)}.`);
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error && error.message === "NIP07_MISSING" ? "Nenhum signer NIP-07 foi encontrado neste navegador. Instale ou ative um signer e tente novamente." : "Não foi possível validar a assinatura. Nenhuma chave privada foi enviada; tente de novo.");
    }
  }
  return <div className="nostr-sign-in">
    <button className="nostr-sign-in__button" type="button" onClick={signIn} disabled={state === "working" || state === "success"}>{state === "working" ? <LoaderCircle className="spin" aria-hidden="true" size={19} /> : <KeyRound aria-hidden="true" size={19} />}{state === "success" ? "Signer conectado" : "Entrar com signer Nostr"}</button>
    <p className={`nostr-sign-in__status nostr-sign-in__status--${state}`} role="status">{message}</p>
    <div className="nostr-sign-in__remote" aria-disabled="true"><Radio aria-hidden="true" size={17} /> Signer remoto NIP-46 — preparado, ainda não configurado</div>
    <small>Nunca cole ou envie sua chave privada nsec para esta plataforma.</small>
  </div>;
}
