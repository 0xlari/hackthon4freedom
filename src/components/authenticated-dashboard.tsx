"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BadgeCheck, Bitcoin, BriefcaseBusiness, FilePlus2, Fingerprint, FlaskConical, Link2, Radio, ShieldCheck, Users } from "lucide-react";

import { ButtonLink } from "@/components/button-link";
import { DEMO_CHANGED_EVENT, getDemoState, type DemoContribution, type DemoReceivable } from "@/lib/demo-store";

type AccessState = "checking" | "authenticated" | "anonymous";

const missions = [
  { icon: Fingerprint, title: "Confirmar identidade", detail: "Aumenta a confiança sem expor seus documentos." },
  { icon: Link2, title: "Conectar LinkedIn", detail: "Autorize a verificação da sua trajetória profissional." },
  { icon: Radio, title: "Conectar rede profissional", detail: "Adicione outro sinal consentido ao seu perfil." },
  { icon: BriefcaseBusiness, title: "Concluir um recebível", detail: "Operações pagas fortalecem seu histórico interno." },
  { icon: Bitcoin, title: "Adicionar garantia em BTC", detail: "Cada US$ 1 elegível pode sustentar até US$ 2 de limite." },
];

export function AuthenticatedDashboard() {
  const [access, setAccess] = useState<AccessState>("checking");
  const [profile, setProfile] = useState<{ id: string; label: string }>();
  const [receivables, setReceivables] = useState<DemoReceivable[]>([]);
  const [contributions, setContributions] = useState<DemoContribution[]>([]);
  const router = useRouter();

  useEffect(() => {
    let active = true;
    fetch("/api/auth/session", { cache: "no-store" })
      .then(async (response) => {
        if (!active) return;
        if (response.ok) {
          const body = await response.json() as { profile?: { id: string; label: string } };
          if (!body.profile?.id) throw new Error("SESSION_PROFILE_MISSING");
          setProfile(body.profile);
          setAccess("authenticated");
        }
        else {
          setAccess("anonymous");
          router.replace("/entrar?next=/painel");
        }
      })
      .catch(() => {
        if (!active) return;
        setAccess("anonymous");
        router.replace("/entrar?next=/painel");
      });
    return () => { active = false; };
  }, [router]);

  useEffect(() => {
    if (!profile) return;
    const refresh = () => {
      const state = getDemoState(profile.id);
      setReceivables(state.receivables);
      setContributions(state.contributions);
    };
    queueMicrotask(refresh);
    window.addEventListener(DEMO_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(DEMO_CHANGED_EVENT, refresh);
  }, [profile]);

  if (access !== "authenticated") {
    return <div className="dashboard-loading" role="status">{access === "checking" ? "Confirmando sua carteira…" : "Redirecionando para o acesso…"}</div>;
  }

  return (
    <div className="dashboard">
      <section className="dashboard-hero">
        <div>
          <span className="eyebrow"><BadgeCheck aria-hidden="true" size={16} /> Carteira conectada · {profile?.label}</span>
          <h1>O que você quer fazer hoje?</h1>
          <p>Crie um recebível para antecipar ou encontre uma pool BTC para aportar.</p>
        </div>
        <div className="dashboard-limit" aria-label="Limite atual">
          <span>Seu limite inicial</span>
          <strong>US$ 100</strong>
          <small>Complete missões para chegar a US$ 5 mil. Garantias em BTC podem elevar o limite além disso.</small>
        </div>
      </section>

      <section className="dashboard-actions" aria-label="Ações principais">
        <article>
          <FilePlus2 aria-hidden="true" />
          <span className="kicker">Tenho a receber</span>
          <h2>Criar recebível</h2>
          <p>Cadastre salário, venda, comissão, serviço ou outro pagamento legítimo do exterior.</p>
          <ButtonLink href="/recebivel">Começar cadastro</ButtonLink>
        </article>
        <article>
          <Users aria-hidden="true" />
          <span className="kicker">Quero aportar</span>
          <h2>Ver pools abertas</h2>
          <p>Compare prazo, cobertura e risco antes de assumir uma participação em BTC.</p>
          <ButtonLink href="/pools" variant="secondary">Explorar pools</ButtonLink>
        </article>
      </section>

      <section className="profile-history" aria-label="Seu histórico na plataforma">
        <article>
          <div><span className="kicker">Meus recebíveis</span>{receivables.length ? <div className="profile-items">{receivables.map((item) => <div key={item.id}><strong>{item.description}</strong><span>US$ {item.amountUsd.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} · {item.status === "AWAITING_CLIENT" ? "aguardando pagador" : item.status === "UNDER_REVIEW" ? "em avaliação" : item.status === "POOLED" ? "pool criada" : item.status.toLowerCase()}</span></div>)}</div> : <><h2>Nenhum recebível ativo</h2><p>Você pode manter um recebível ativo por vez. Ao concluir, cancelar ou ter a solicitação rejeitada, poderá criar outro.</p></>}</div>
          <ButtonLink href={receivables.some((item) => item.status === "UNDER_REVIEW") ? "/administracao" : "/recebivel"} variant="secondary">{receivables.some((item) => item.status === "UNDER_REVIEW") ? "Abrir avaliação" : "Criar recebível"}</ButtonLink>
        </article>
        <article>
          <div><span className="kicker">Meus aportes</span>{contributions.length ? <div className="profile-items">{contributions.map((item) => <div key={item.id}><strong>{item.poolTitle}</strong><span>{item.amountSats.toLocaleString("pt-BR")} sats aportados · retorno central ≈ {item.expectedSats.toLocaleString("pt-BR")} sats</span></div>)}</div> : <><h2>Nenhuma participação ainda</h2><p>As pools financiadas por esta carteira aparecerão aqui com principal, cobertura, vencimento e distribuição.</p></>}</div>
          <ButtonLink href="/pools" variant="secondary">Encontrar uma pool</ButtonLink>
        </article>
      </section>

      <section className="dashboard-privacy dashboard-admin-demo"><FlaskConical aria-hidden="true" /><div><h2>Aprovação da plataforma no hackathon</h2><p>A área administrativa está aberta e sem senha somente para demonstrar a avaliação e a criação automática da pool.</p></div><ButtonLink href="/administracao" variant="secondary">Abrir administração</ButtonLink></section>

      <section className="dashboard-privacy"><Radio aria-hidden="true" /><div><h2>Lightning Receivables Protocol</h2><p>A LRP v0.1 permite assinar um recebível com seu signer Nostr e acompanhar o grafo público reconstruível. Nenhum fundo real é movimentado.</p></div><ButtonLink href="/protocolo" variant="secondary">Abrir LRP v0.1</ButtonLink></section>

      <section className="dashboard-section" aria-labelledby="missions-title">
        <div className="dashboard-section__heading">
          <div><span className="kicker">Limite e reputação</span><h2 id="missions-title">Missões para avançar</h2></div>
          <p>Somente sinais consentidos e verificáveis contam. Popularidade e gênero não alteram seu limite.</p>
        </div>
        <div className="mission-grid">
          {missions.map(({ icon: Icon, title, detail }) => (
            <article key={title}><Icon aria-hidden="true" /><div><h3>{title}</h3><p>{detail}</p></div><span>Começar</span></article>
          ))}
        </div>
      </section>

      <section className="dashboard-privacy">
        <ShieldCheck aria-hidden="true" />
        <div><h2>Reputação sem exposição</h2><p>O histórico cresce com operações reais. Atestados Nostr positivos são publicados automaticamente sem documentos, valores ou dados do pagador.</p></div>
      </section>
    </div>
  );
}
