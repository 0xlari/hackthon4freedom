import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { PoolSimulator } from "./pool-simulator";

describe("PoolSimulator", () => {
  afterEach(cleanup);

  it("mostra custos e split sem prometer retorno", () => {
    render(<PoolSimulator />);
    expect(
      screen.getByText((content, element) =>
        element?.tagName === "STRONG" && content.includes("1.940,00"),
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Plataforma — 30%")).toBeInTheDocument();
    expect(screen.getByText("Aportadoras — 70%")).toBeInTheDocument();
    expect(screen.getByText(/Nenhuma invoice, swap ou promessa de retorno/i)).toBeInTheDocument();
  });

  it("explica o USDt Liquid sem habilitar movimentação real", () => {
    render(<PoolSimulator />);
    fireEvent.click(screen.getByRole("radio", { name: /Pareada em USDt/i }));
    expect(screen.getByText(/principal é acompanhado em USDt Liquid/i)).toBeInTheDocument();
    expect(screen.getByText(/Gateway Breez mainnet integrado/i)).toBeInTheDocument();
    expect(screen.getByText(/permanecem bloqueados sem flag/i)).toBeInTheDocument();
  });
});
