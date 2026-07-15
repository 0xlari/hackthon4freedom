import { NextResponse } from "next/server";
import { z } from "zod";
import { databaseFromEnvironment } from "@/db/client";
import { consumeNostrAuthChallenge, issueNostrAuthChallenge } from "@/db/repositories/nostr-auth-repository";
import { NOSTR_SESSION_TTL_SECONDS } from "@/domain/nostr-auth";

export const runtime = "nodejs";
const eventSchema = z.object({ id: z.string().regex(/^[a-f0-9]{64}$/), pubkey: z.string().regex(/^[a-f0-9]{64}$/), created_at: z.number().int().nonnegative(), kind: z.number().int(), tags: z.array(z.array(z.string()).min(1)), content: z.string(), sig: z.string().regex(/^[a-f0-9]{128}$/) });
const bodySchema = z.discriminatedUnion("action", [z.object({ action: z.literal("challenge"), pubkey: z.string().regex(/^[a-f0-9]{64}$/) }), z.object({ action: z.literal("verify"), challengeId: z.string().uuid(), event: eventSchema })]);
const privateHeaders = { "Cache-Control": "no-store, private", "Referrer-Policy": "no-referrer" };

export async function POST(request: Request) {
  let bundle: ReturnType<typeof databaseFromEnvironment> | undefined;
  try {
    const body = bodySchema.parse(await request.json());
    bundle = databaseFromEnvironment();
    const requestUrl = new URL("/api/nostr-auth", request.url).toString();
    if (body.action === "challenge") {
      const result = await issueNostrAuthChallenge(bundle.db, { pubkey: body.pubkey, requestUrl });
      return NextResponse.json({ ...result, expiresAt: result.expiresAt.toISOString() }, { headers: privateHeaders });
    }
    const result = await consumeNostrAuthChallenge(bundle.db, { challengeId: body.challengeId, event: body.event });
    const response = NextResponse.json({ authenticated: true, pubkey: result.pubkey }, { headers: privateHeaders });
    response.cookies.set("erh_session", result.rawSessionToken, { httpOnly: true, sameSite: "strict", secure: new URL(request.url).protocol === "https:", path: "/", maxAge: NOSTR_SESSION_TTL_SECONDS });
    return response;
  } catch (error) {
    const isInput = error instanceof z.ZodError;
    return NextResponse.json({ error: isInput ? "Solicitação Nostr inválida." : "Não foi possível validar a assinatura. Gere um novo desafio." }, { status: isInput ? 400 : 401, headers: privateHeaders });
  } finally { await bundle?.close(); }
}
