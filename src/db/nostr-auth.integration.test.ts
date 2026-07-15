// @vitest-environment node
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { finalizeEvent, generateSecretKey, getPublicKey } from "nostr-tools/pure";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { consumeNostrAuthChallenge, issueNostrAuthChallenge } from "@/db/repositories/nostr-auth-repository";
import * as schema from "@/db/schema";

let postgres: PGlite;
let database: ReturnType<typeof drizzle<typeof schema>>;

describe("Nostr auth persistence", () => {
  beforeAll(async () => {
    postgres = new PGlite();
    database = drizzle(postgres, { schema });
    await migrate(database, { migrationsFolder: "drizzle" });
  }, 30_000);
  afterAll(async () => { await postgres.close(); });

  it("consumes once, links the pubkey and stores only a session hash", async () => {
    const secret = generateSecretKey();
    const pubkey = getPublicKey(secret);
    const now = new Date("2026-07-14T12:00:00.000Z");
    const challenge = await issueNostrAuthChallenge(database, { pubkey, requestUrl: "https://example.com/api/nostr-auth", now });
    const event = finalizeEvent(challenge.event, secret);
    const authenticated = await consumeNostrAuthChallenge(database, { challengeId: challenge.challengeId, event, now });
    const sessionRows = await postgres.query<{ token_hash: string }>("select token_hash from nostr_sessions");
    expect(authenticated.pubkey).toBe(pubkey);
    expect(sessionRows.rows[0]?.token_hash).toMatch(/^[a-f0-9]{64}$/);
    expect(sessionRows.rows[0]?.token_hash).not.toBe(authenticated.rawSessionToken);
    await expect(consumeNostrAuthChallenge(database, { challengeId: challenge.challengeId, event, now })).rejects.toThrow("ALREADY_USED");
  });
});
