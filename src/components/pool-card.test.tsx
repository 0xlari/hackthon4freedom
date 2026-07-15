import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PoolCard } from "@/components/pool-card";

describe("PoolCard", () => {
  it("exposes funding progress to assistive technology", () => {
    render(
      <PoolCard
        label="Full BTC"
        title="Projeto fictício"
        amount="1.000 sats"
        funded={72}
        due="amanhã"
        mode="btc"
      />,
    );

    expect(screen.getByRole("progressbar", { name: "72% financiado" })).toHaveAttribute(
      "aria-valuenow",
      "72",
    );
  });
});
