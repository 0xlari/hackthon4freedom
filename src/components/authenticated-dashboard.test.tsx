import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AuthenticatedDashboard } from "./authenticated-dashboard";

const replace = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace }) }));

describe("AuthenticatedDashboard", () => {
  afterEach(() => { cleanup(); vi.restoreAllMocks(); replace.mockReset(); });

  it("shows the two primary flows and the profile history for an active session", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ authenticated: true, profile: { id: "profile-a", label: "Perfil profile-a" } }), { status: 200 }));
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
});
