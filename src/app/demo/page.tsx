import type { Metadata } from "next";

import { DemoRehearsal } from "@/components/demo-rehearsal";

export const metadata: Metadata = { title: "Ensaio da demo controlada", description: "Reprodução offline e sem fundos do fluxo da demonstração mainnet." };

export default function DemoPage() {
  return (
    <div className="inner-page">
      <section className="page-hero page-hero--compact">
        <div className="shell page-hero__inner">
          <span className="eyebrow">Fase 9 · preparação técnica</span>
          <h1>Ensaie a história inteira sem depender da rede.</h1>
          <p>A movimentação real permanece bloqueada até existirem auditoria GO, aprovação vigente, operadora presente, flags e credenciais no cofre.</p>
        </div>
      </section>
      <section className="section demo-page-section"><div className="shell"><DemoRehearsal /></div></section>
    </div>
  );
}
