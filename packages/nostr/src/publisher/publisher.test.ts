import { describe, expect, it } from "vitest";

import { FakeSigner } from "../signer";
import { InMemoryRelayClient } from "../relays";
import { publishToRelaySet } from "./index";

const signer = new FakeSigner(new Uint8Array(32).fill(9));
const event = await signer.signEvent({ kind: 8100, created_at: 1_800_000_000, tags: [["alt", "protocol"]], content: "{}" });

describe("relay publisher", () => {
  it("confirms after two positive ACKs and tolerates one timeout", async () => {
    const result = await publishToRelaySet(event, [new InMemoryRelayClient("wss://one.example/"), new InMemoryRelayClient("wss://two.example/"), new InMemoryRelayClient("wss://three.example/", "TIMEOUT")]);
    expect(result.status).toBe("CONFIRMED");
    expect(result.acknowledgedRelays).toHaveLength(2);
    expect(result.timedOutRelays).toEqual(["wss://three.example/"]);
  });

  it("does not confirm with only one positive ACK", async () => {
    const result = await publishToRelaySet(event, [new InMemoryRelayClient("wss://one.example/"), new InMemoryRelayClient("wss://two.example/", "REJECT"), new InMemoryRelayClient("wss://three.example/", "TIMEOUT")]);
    expect(result.status).toBe("INSUFFICIENT_ACKS");
    expect(result.acknowledgedRelays).toHaveLength(1);
  });
});
