import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AuthenticatedDashboard } from "./authenticated-dashboard";
import { createDemoReceivable, recordDemoContribution, resetDemoState } from "@/lib/demo-store";
import { publicPools } from "@/data/public-pools";

const replace = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace }) }));

describe("AuthenticatedDashboard", () => {
  afterEach(() => { cleanup(); vi.restoreAllMocks(); replace.mockReset(); resetDemoState(); });

  it("shows the two primary flows and the profile history for an active session", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
      return url === "/api/auth/session"
        ? new Response(JSON.stringify({ authenticated: true, profile: { id: "profile-a", label: "Perfil profile-a" } }), { status: 200 })
        : new Response(JSON.stringify({ source: "LEGACY", history: [] }), { status: 200 });
    });
    render(<AuthenticatedDashboard />);
    expect(await screen.findByRole("heading", { name: /o que você quer fazer hoje/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /começar cadastro/i })).toHaveAttribute("href", "/recebivel");
    expect(screen.getByRole("link", { name: /explorar pools/i })).toHaveAttribute("href", "/pools");
    expect(screen.getByText("Meus recebíveis")).toBeInTheDocument();
    expect(screen.getByText("Meus aportes")).toBeInTheDocument();
    expect(screen.getByText(/um recebível ativo por vez/i)).toBeInTheDocument();
    expect(screen.getByText(/perfil profile-a/i)).toBeInTheDocument();
  });

  it("redirects an anonymous visitor to wallet access", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("{}", { status: 401 }));
    render(<AuthenticatedDashboard />);
    await waitFor(() => expect(replace).toHaveBeenCalledWith("/entrar?next=/painel"));
  });

  it("mostra o recebível PostgreSQL e ignora recebíveis e aportes locais em LRP", async () => {
    createDemoReceivable("profile-a", { purpose: "SERVICE", description: "Somente no navegador", amountUsd: 80, dueDate: "2026-08-20", payerName: "Local", payerCountry: "US", evidenceName: "local.pdf" });
    recordDemoContribution("profile-a", publicPools[0]!, 1_000, 1_050);
    const real = { receivableId: "real-1", draftId: "draft-1", privateStatus: "AWAITING_CLIENT", originationStatus: "PUBLISHED", canonicalSource: "LRP", title: "Salário internacional real", nominalUsdCents: "250000", dueAt: "2026-08-20T12:00:00.000Z", publicationStatus: "CONFIRMED", confirmationUrl: "https://produto.test/confirmar?token=private", nextStep: "SHARE_CONFIRMATION" };
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
      return url === "/api/auth/session"
        ? new Response(JSON.stringify({ authenticated: true, profile: { id: "profile-a", label: "Perfil profile-a" } }), { status: 200 })
        : new Response(JSON.stringify({ source: "LRP", active: real, history: [real] }), { status: 200 });
    });
    render(<AuthenticatedDashboard lrpMode="LRP" />);
    expect(await screen.findByText("Salário internacional real")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /enviar confirmação ao pagador/i })).toHaveAttribute("href", "/recebivel");
    expect(screen.getByText(/aportes ainda não estão disponíveis/i)).toBeInTheDocument();
    expect(screen.queryByText("Somente no navegador")).not.toBeInTheDocument();
    expect(screen.queryByText(publicPools[0]!.title)).not.toBeInTheDocument();
  });

  it("não oferece fallback local quando o histórico LRP está indisponível", async () => {
    createDemoReceivable("profile-a", { purpose: "SERVICE", description: "Somente no navegador", amountUsd: 80, dueDate: "2026-08-20", payerName: "Local", payerCountry: "US", evidenceName: "local.pdf" });
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
      return url === "/api/auth/session"
        ? new Response(JSON.stringify({ authenticated: true, profile: { id: "profile-a", label: "Perfil profile-a" } }), { status: 200 })
        : new Response("{}", { status: 503 });
    });
    render(<AuthenticatedDashboard lrpMode="LRP" />);
    expect(await screen.findByRole("heading", { name: /histórico indisponível/i })).toBeInTheDocument();
    expect(screen.queryByText("Somente no navegador")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /criar recebível/i })).not.toBeInTheDocument();
  });
});
