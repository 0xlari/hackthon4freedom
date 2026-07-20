import type { ProtocolSignedEvent } from "../../../protocol/src/schemas";
import type { ProtocolRelayClient } from "../relays";

export type RelayPublicationReceipt = Readonly<{
  relayUrl: string;
  status: "ACKNOWLEDGED" | "REJECTED" | "TIMEOUT";
  message?: string;
  durationMs: number;
}>;

export type RelaySetPublication = Readonly<{
  event: ProtocolSignedEvent;
  acknowledgedRelays: readonly string[];
  rejectedRelays: readonly string[];
  timedOutRelays: readonly string[];
  receipts: readonly RelayPublicationReceipt[];
  status: "CONFIRMED" | "INSUFFICIENT_ACKS";
  requiredAcks: number;
  durationMs: number;
}>;

export async function publishToRelaySet(
  event: ProtocolSignedEvent,
  clients: readonly ProtocolRelayClient[],
  requiredAcks = 2,
): Promise<RelaySetPublication> {
  const started = Date.now();
  const unique = new Map(clients.map((client) => [new URL(client.relayUrl).toString(), client]));
  if (unique.size < 3) throw new Error("THREE_DISTINCT_PROTOCOL_RELAYS_REQUIRED");
  if (!Number.isInteger(requiredAcks) || requiredAcks < 1 || requiredAcks > unique.size) throw new Error("INVALID_RELAY_ACK_QUORUM");

  const receipts = await Promise.all([...unique.entries()].map(async ([relayUrl, client]): Promise<RelayPublicationReceipt> => {
    const relayStarted = Date.now();
    try {
      const ack = await client.publish(event);
      return { relayUrl, status: ack.accepted ? "ACKNOWLEDGED" : "REJECTED", ...(ack.message ? { message: ack.message } : {}), durationMs: Date.now() - relayStarted };
    } catch (error) {
      const timeout = error instanceof Error && (error.message.includes("TIMEOUT") || (error as Error & { code?: string }).code === "RELAY_TIMEOUT");
      return { relayUrl, status: timeout ? "TIMEOUT" : "REJECTED", message: timeout ? "RELAY_TIMEOUT" : "RELAY_UNAVAILABLE", durationMs: Date.now() - relayStarted };
    }
  }));
  const acknowledgedRelays = receipts.filter((item) => item.status === "ACKNOWLEDGED").map((item) => item.relayUrl);
  return {
    event,
    acknowledgedRelays,
    rejectedRelays: receipts.filter((item) => item.status === "REJECTED").map((item) => item.relayUrl),
    timedOutRelays: receipts.filter((item) => item.status === "TIMEOUT").map((item) => item.relayUrl),
    receipts,
    status: acknowledgedRelays.length >= requiredAcks ? "CONFIRMED" : "INSUFFICIENT_ACKS",
    requiredAcks,
    durationMs: Date.now() - started,
  };
}
