import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NostrSignIn } from "./nostr-sign-in";

describe("Nostr sign in", () => {
  it("fails safely when no NIP-07 signer is available", async () => {
    delete window.nostr;
    render(<NostrSignIn />);
    fireEvent.click(screen.getByRole("button", { name: /entrar com signer nostr/i }));
    expect(await screen.findByText(/nenhum signer nip-07/i)).toBeInTheDocument();
    expect(screen.getByText(/nunca cole ou envie sua chave privada nsec/i)).toBeInTheDocument();
  });
});
