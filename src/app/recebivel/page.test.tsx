import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ReceivablePage from "./page";

describe("página do recebível", () => {
  it("explica que a plataforma valida e não expõe cadastro sem autenticação", () => {
    render(<ReceivablePage />);
    expect(screen.getByRole("heading", { name: /você cadastra/i })).toBeInTheDocument();
    expect(screen.getByText(/Avaliação da plataforma/i)).toBeInTheDocument();
    expect(screen.getByText(/disponível após autenticação segura/i)).toBeInTheDocument();
  });
});
