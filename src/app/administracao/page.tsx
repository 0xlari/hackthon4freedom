import type { Metadata } from "next";

import { DemoAdministration } from "@/components/demo-administration";

export const metadata: Metadata = { title: "Administração da demonstração", robots: { index: false, follow: false } };

export default function AdministrationPage() {
  return <div className="inner-page"><section className="page-hero page-hero--compact"><div className="shell page-hero__inner"><span className="eyebrow">Plataforma</span><h1>Avaliação do recebível.</h1><p>Revise a confirmação e aprove a criação da pool BTC. Esta rota é aberta apenas para demonstrar o fluxo do hackathon.</p></div></section><section className="section"><div className="shell"><DemoAdministration /></div></section></div>;
}
