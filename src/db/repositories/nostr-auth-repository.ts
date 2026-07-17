import { and, eq, isNull } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import type { Event } from "nostr-tools";

import * as schema from "@/db/schema";
import { nostrAuthChallenges, users } from "@/db/schema";
import { createNostrChallenge, validateNostrChallengeEvent } from "@/domain/nostr-auth";

export async function ensureUserForSupabaseAuth<THKT extends PgQueryResultHKT>(db: PgDatabase<THKT, typeof schema>, input: { authUserId: string; userId: string }) {
  const [existing] = await db.select().from(users).where(eq(users.supabaseAuthUserId, input.authUserId)).limit(1);
  if (existing) return existing;
  const [created] = await db.insert(users).values({ id: input.userId, supabaseAuthUserId: input.authUserId, countryCode: "BR", status: "PENDING" }).returning();
  if (!created) throw new Error("USER_CREATION_FAILED");
  return created;
}

export async function issueNostrLinkChallenge<THKT extends PgQueryResultHKT>(db: PgDatabase<THKT, typeof schema>, input: { userId: string; pubkey: string; requestUrl: string; now?: Date }) {
  const challenge = createNostrChallenge(input.pubkey, input.requestUrl, input.now);
  await db.insert(nostrAuthChallenges).values({ id: challenge.id, userId: input.userId, pubkey: input.pubkey, nonceHash: challenge.nonceHash, requestUrl: input.requestUrl, expiresAt: challenge.expiresAt });
  return { challengeId: challenge.id, event: challenge.event, expiresAt: challenge.expiresAt };
}

export async function consumeNostrLinkChallenge<THKT extends PgQueryResultHKT>(db: PgDatabase<THKT, typeof schema>, input: { userId: string; challengeId: string; event: Event; now?: Date }) {
  const now = input.now ?? new Date();
  return db.transaction(async (tx) => {
    const [challenge] = await tx.select().from(nostrAuthChallenges).where(eq(nostrAuthChallenges.id, input.challengeId)).limit(1);
    if (!challenge) throw new Error("NOSTR_CHALLENGE_NOT_FOUND");
    if (challenge.userId !== input.userId) throw new Error("NOSTR_CHALLENGE_USER_MISMATCH");
    validateNostrChallengeEvent({ event: input.event, expectedPubkey: challenge.pubkey, expectedNonceHash: challenge.nonceHash, expectedRequestUrl: challenge.requestUrl, expiresAt: challenge.expiresAt, usedAt: challenge.usedAt, now });
    const consumed = await tx.update(nostrAuthChallenges).set({ usedAt: now }).where(and(eq(nostrAuthChallenges.id, challenge.id), isNull(nostrAuthChallenges.usedAt))).returning({ id: nostrAuthChallenges.id });
    if (consumed.length !== 1) throw new Error("NOSTR_CHALLENGE_ALREADY_USED");
    const [linked] = await tx.update(users).set({ nostrPubkey: challenge.pubkey, updatedAt: now }).where(eq(users.id, input.userId)).returning({ id: users.id, pubkey: users.nostrPubkey });
    if (!linked) throw new Error("NOSTR_USER_NOT_FOUND");
    return linked;
  });
}
