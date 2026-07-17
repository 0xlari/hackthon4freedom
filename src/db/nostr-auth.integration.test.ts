// @vitest-environment node
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { finalizeEvent, generateSecretKey, getPublicKey } from "nostr-tools/pure";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { consumeNostrLinkChallenge, ensureUserForSupabaseAuth, issueNostrLinkChallenge } from "@/db/repositories/nostr-auth-repository";
import * as schema from "@/db/schema";

let postgres: PGlite;
let database: ReturnType<typeof drizzle<typeof schema>>;

describe("Nostr reputation link persistence", () => {
  beforeAll(async () => {
    postgres = new PGlite();
    database = drizzle(postgres, { schema });
    await migrate(database, { migrationsFolder: "drizzle" });
  }, 30_000);
  afterAll(async () => { await postgres.close(); });

  it("links a pubkey to an authenticated Supabase user and consumes the challenge once", async () => {
    const secret = generateSecretKey();
    const pubkey = getPublicKey(secret);
    const now = new Date("2026-07-14T12:00:00.000Z");
    const user = await ensureUserForSupabaseAuth(database, { authUserId: "00000000-0000-4000-8000-000000000001", userId: "user-supabase" });
    const challenge = await issueNostrLinkChallenge(database, { userId: user.id, pubkey, requestUrl: "https://example.com/api/nostr-link", now });
    const event = finalizeEvent(challenge.event, secret);
    const linked = await consumeNostrLinkChallenge(database, { userId: user.id, challengeId: challenge.challengeId, event, now });
    const rows = await postgres.query<{ supabase_auth_user_id: string; nostr_pubkey: string }>("select supabase_auth_user_id::text, nostr_pubkey from users where id = 'user-supabase'");
    expect(linked.pubkey).toBe(pubkey);
    expect(rows.rows[0]).toEqual({ supabase_auth_user_id: "00000000-0000-4000-8000-000000000001", nostr_pubkey: pubkey });
    await expect(consumeNostrLinkChallenge(database, { userId: user.id, challengeId: challenge.challengeId, event, now })).rejects.toThrow("ALREADY_USED");
  });
});
