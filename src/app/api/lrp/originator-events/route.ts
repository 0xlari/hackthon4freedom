import { NextResponse } from "next/server";
import { z } from "zod";

import { NostrToolsRelayClient, lrpRelaysFromEnvironment } from "@nostr/relays";
import { protocolSignedEventSchema } from "@protocol/schemas";
import { currentLrpModePolicy } from "@/config/lrp-mode";
import { assertJsonPayloadSize, assertSameOrigin, enforceRateLimit } from "@/lib/api-security";
import { withSessionProfile } from "@/lib/app-session";
import { preparePayerCommitmentProof, publishPayerCommitmentProof } from "@/services/lrp-payer-confirmation-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "no-store, private", "Referrer-Policy": "no-referrer" };
const prepareSchema = z.object({ action: z.literal("prepare_payer_commitment"), receivableId: z.string().uuid() }).strict();
const publishSchema = z.object({ action: z.literal("publish_payer_commitment"), originatorEventId: z.string().uuid(), event: protocolSignedEventSchema.optional() }).strict();
const bodySchema = z.discriminatedUnion("action", [prepareSchema, publishSchema]);

function relayClients() {
  return lrpRelaysFromEnvironment().map((relay) => new NostrToolsRelayClient(relay));
}

export async function POST(request: Request) {
  let clients: NostrToolsRelayClient[] = [];
  try {
    assertSameOrigin(request);
    assertJsonPayloadSize(request);
    const policy = currentLrpModePolicy();
    if (policy.mode === "LEGACY") throw new Error("LRP_ORIGINATOR_API_DISABLED_IN_LEGACY");
    const body = bodySchema.parse(await request.json());
    return await withSessionProfile(request, async ({ profile, db }) => {
      if (!profile.nostrPubkey) throw new Error("LRP_ORIGINATOR_SIGNER_NOT_LINKED");
      enforceRateLimit(`lrp:originator:${profile.userId}`, 20);
      if (body.action === "prepare_payer_commitment") {
        const prepared = await preparePayerCommitmentProof(db, {
          receivableId: body.receivableId,
          mode: policy.mode === "SHADOW" ? "SHADOW" : "LRP",
          originatorPubkey: profile.nostrPubkey,
          now: new Date(),
        });
        return NextResponse.json(prepared, { headers });
      }
      if (policy.mode !== "LRP") throw new Error("LRP_PUBLICATION_DISABLED");
      clients = relayClients();
      const published = await publishPayerCommitmentProof(db, {
        originatorEventId: body.originatorEventId,
        originatorPubkey: profile.nostrPubkey,
        signedEvent: body.event,
        clients,
        now: new Date(),
      });
      return NextResponse.json(published, { status: published.publicationStatus === "CONFIRMED" ? 201 : 202, headers });
    });
  } catch (error) {
    const message = error instanceof z.ZodError ? "LRP_ORIGINATOR_REQUEST_INVALID" : error instanceof Error ? error.message : "LRP_ORIGINATOR_REQUEST_FAILED";
    return NextResponse.json({ error: message }, { status: message.includes("SESSION") ? 401 : 400, headers });
  } finally {
    clients.forEach((client) => client.close());
  }
}
