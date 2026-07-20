const DEFAULT_RELAYS = [
  "wss://relay.damus.io/",
  "wss://nos.lol/",
  "wss://relay.primal.net/",
] as const;

function normalizeRelay(value: string) {
  const parsed = new URL(value.trim());
  if (parsed.protocol !== "wss:" || parsed.username || parsed.password || parsed.hash) {
    throw new Error("PROTOCOL_RELAY_INVALID");
  }
  return parsed.toString();
}

export function protocolRelaysFromEnvironment(environment: NodeJS.ProcessEnv = process.env) {
  const configured = environment.NOSTR_PROTOCOL_RELAYS?.split(",").filter(Boolean) ?? DEFAULT_RELAYS;
  const relays = [...new Set(configured.map(normalizeRelay))];
  if (relays.length < 3) throw new Error("THREE_DISTINCT_PROTOCOL_RELAYS_REQUIRED");
  return relays;
}
