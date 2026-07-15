import { randomUUID } from "node:crypto";
import { and, eq, isNull } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import type { Event } from "nostr-tools";

import * as schema from "@/db/schema";
import { nostrAuthChallenges, nostrSessions, users } from "@/db/schema";
import { createNostrChallenge, createSessionToken, NOSTR_SESSION_TTL_SECONDS, validateNostrChallengeEvent } from "@/domain/nostr-auth";

export async function issueNostrAuthChallenge<THKT extends PgQueryResultHKT>(db: PgDatabase<THKT, typeof schema>, input: { pubkey: string; requestUrl: string; now?: Date }) {
  const challenge = createNostrChallenge(input.pubkey, input.requestUrl, input.now);
  await db.insert(nostrAuthChallenges).values({ id: challenge.id, pubkey: input.pubkey, nonceHash: challenge.nonceHash, requestUrl: input.requestUrl, expiresAt: challenge.expiresAt });
  return { challengeId: challenge.id, event: challenge.event, expiresAt: challenge.expiresAt };
}

export async function consumeNostrAuthChallenge<THKT extends PgQueryResultHKT>(db: PgDatabase<THKT, typeof schema>, input: { challengeId: string; event: Event; now?: Date }) {
  const now = input.now ?? new Date();
  return db.transaction(async (tx) => {
    const [challenge] = await tx.select().from(nostrAuthChallenges).where(eq(nostrAuthChallenges.id, input.challengeId)).limit(1);
    if (!challenge) throw new Error("NOSTR_CHALLENGE_NOT_FOUND");
    validateNostrChallengeEvent({ event: input.event, expectedPubkey: challenge.pubkey, expectedNonceHash: challenge.nonceHash, expectedRequestUrl: challenge.requestUrl, expiresAt: challenge.expiresAt, usedAt: challenge.usedAt, now });
    const consumed = await tx.update(nostrAuthChallenges).set({ usedAt: now }).where(and(eq(nostrAuthChallenges.id, challenge.id), isNull(nostrAuthChallenges.usedAt))).returning({ id: nostrAuthChallenges.id });
    if (consumed.length !== 1) throw new Error("NOSTR_CHALLENGE_ALREADY_USED");
    let [user] = await tx.select().from(users).where(eq(users.nostrPubkey, challenge.pubkey)).limit(1);
    if (!user) [user] = await tx.insert(users).values({ id: randomUUID(), countryCode: "BR", nostrPubkey: challenge.pubkey, status: "PENDING" }).returning();
    if (!user) throw new Error("NOSTR_USER_CREATION_FAILED");
    const session = createSessionToken();
    const expiresAt = new Date(now.getTime() + NOSTR_SESSION_TTL_SECONDS * 1000);
    await tx.insert(nostrSessions).values({ id: session.id, userId: user.id, tokenHash: session.tokenHash, expiresAt });
    return { userId: user.id, pubkey: challenge.pubkey, rawSessionToken: session.rawToken, expiresAt };
  });
}
