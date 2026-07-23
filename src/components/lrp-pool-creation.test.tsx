import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { LrpPoolCreation } from "./lrp-pool-creation";

describe("LrpPoolCreation", () => {
  afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.restoreAllMocks(); Reflect.deleteProperty(window, "nostr"); });

  it("mostra somente termos calculados para revisão, sem campos de fórmula", async () => {
    const terms = {
      protocol_version: "lrp/0.1.0", event_type: "PoolCreated", pool_id: "pool_demo_00000001", title: "Pagamento internacional",
      provider_pseudonym: "Criadora 21", public_reputation_facts: [], receivable_event_id: "a".repeat(64), payer_commitment_event_id: "b".repeat(64),
      approval_event_id: "c".repeat(64), nwc_attestation_event_id: "d".repeat(64), originator_pubkey: "e".repeat(64), original_currency: "USD",
      target_sats: "1900000", minimum_partial_bps: 5000, funding_deadline: 1_785_254_400, due_at: 1_787_673_600,
      discount_bps: 300, expected_return_bps: 216, client_fees_sats: "0", fixed_late_fee_bps: 200, daily_late_interest_bps: 10,
      maximum_penalty_bps: 1000, partial_funding_policy: "PROVIDER_DECIDES_AT_OR_ABOVE_MINIMUM", partial_acceptance_window_seconds: 86400,
      cancellation_policy: "REFUND_BEFORE_DISBURSEMENT", dispute_policy: "ORIGINATOR_COORDINATED_V0_1", originator_concentrates_operational_roles: true,
    };
    vi.stubGlobal("fetch", vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => init?.method === "POST"
      ? new Response(JSON.stringify({ poolOriginationId: crypto.randomUUID(), poolId: terms.pool_id, status: "TERMS_READY", termsHash: "f".repeat(64), terms }), { status: 201 })
      : new Response(JSON.stringify({ receivableId: crypto.randomUUID() }), { status: 200 })));
    render(<LrpPoolCreation mode="LRP" />);
    fireEvent.click(screen.getByRole("button", { name: "Consultar elegibilidade" }));
    expect(await screen.findByText("1900000 sats")).toBeVisible();
    expect(screen.getByText("300 bps · 216 bps")).toBeVisible();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: /Li e aceito publicar/ })).toBeVisible();
  });

  it("bloqueia a publicação quando a identidade do signer difere da sessão", async () => {
    const terms = {
      protocol_version: "lrp/0.1.0", event_type: "PoolCreated", pool_id: "pool_demo_00000002", title: "Pagamento internacional",
      provider_pseudonym: "Criadora", public_reputation_facts: [], receivable_event_id: "a".repeat(64), payer_commitment_event_id: "b".repeat(64),
      approval_event_id: "c".repeat(64), nwc_attestation_event_id: "d".repeat(64), originator_pubkey: "e".repeat(64), original_currency: "USD",
      target_sats: "1900000", minimum_partial_bps: 5000, funding_deadline: 1_785_254_400, due_at: 1_787_673_600,
      discount_bps: 300, expected_return_bps: 216, client_fees_sats: "0", fixed_late_fee_bps: 200, daily_late_interest_bps: 10,
      maximum_penalty_bps: 1000, partial_funding_policy: "PROVIDER_DECIDES_AT_OR_ABOVE_MINIMUM", partial_acceptance_window_seconds: 86400,
      cancellation_policy: "REFUND_BEFORE_DISBURSEMENT", dispute_policy: "ORIGINATOR_COORDINATED_V0_1", originator_concentrates_operational_roles: true,
    };
    Object.defineProperty(window, "nostr", { configurable: true, value: { getPublicKey: vi.fn().mockResolvedValue("1".repeat(64)), signEvent: vi.fn() } });
    vi.stubGlobal("fetch", vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url === "/api/auth/session") return new Response(JSON.stringify({ profile: { nostrPubkey: "2".repeat(64) } }), { status: 200 });
      if (init?.method === "POST") return new Response(JSON.stringify({ poolOriginationId: crypto.randomUUID(), poolId: terms.pool_id, status: "TERMS_READY", termsHash: "f".repeat(64), terms }), { status: 201 });
      return new Response(JSON.stringify({ receivableId: crypto.randomUUID() }), { status: 200 });
    }));
    render(<LrpPoolCreation mode="LRP" />);
    fireEvent.click(screen.getByRole("button", { name: "Consultar elegibilidade" }));
    const checkbox = await screen.findByRole("checkbox", { name: /Li e aceito publicar/ });
    fireEvent.click(checkbox);
    fireEvent.click(screen.getByRole("button", { name: "Assinar e publicar pool" }));
    expect(await screen.findByText("A identidade usada não corresponde à sessão atual.")).toBeVisible();
  });
});
