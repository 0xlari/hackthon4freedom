import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import LimitPage from "./page";

describe("limit page", () => {
  it("explains the demo limit without implying a real guarantee", () => {
    render(<LimitPage />);

    expect(
      screen.getByRole("heading", {
        name: "Seu limite cresce com provas, não com popularidade.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("US$ 350,00")).toBeInTheDocument();
    expect(screen.getByText("Somente simulação")).toBeInTheDocument();
    expect(screen.getByText(/Seguidores, gênero e conteúdo/)).toBeInTheDocument();
  });
});
