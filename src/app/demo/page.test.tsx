import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import DemoPage from "./page";

describe("controlled demo rehearsal", () => {
  it("keeps the offline rehearsal explicitly fundless", () => {
    render(<DemoPage />);
    expect(screen.getByText("DEMONSTRAÇÃO — nenhum fundo movimentado")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Fallback offline" }));
    expect(screen.getByText(/não cria invoice, não conecta ao Breez SDK/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /pagar|ativar mainnet/i })).not.toBeInTheDocument();
  });
});
