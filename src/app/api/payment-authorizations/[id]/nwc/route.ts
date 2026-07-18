import { NextResponse } from "next/server";
import { z } from "zod";

import { databaseFromEnvironment } from "@/db/client";
import { connectNwcAuthorization } from "@/db/repositories/payer-payment-repository";
import { DomainError } from "@/domain/errors";
import { nwcValidationGatewayFromEnvironment } from "@/integrations/nwc/gateway-factory";
import { assertJsonPayloadSize, assertSameOrigin, enforceRateLimit } from "@/lib/api-security";

export const runtime = "nodejs";
const bodySchema = z.object({ managementToken: z.string().min(32).max(128), nwcUri: z.string().min(1).max(4096) });
const headers = { "Cache-Control": "no-store, private", "Referrer-Policy": "no-referrer" };

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  let bundle: ReturnType<typeof databaseFromEnvironment> | undefined;
  try {
    assertSameOrigin(request); assertJsonPayloadSize(request);
    const { id } = await context.params; enforceRateLimit(`payment-auth:nwc:${id}`, 6);
    const body = bodySchema.parse(await request.json());
    bundle = databaseFromEnvironment();
    const result = await connectNwcAuthorization(bundle.db, nwcValidationGatewayFromEnvironment(), { publicId: id, managementToken: body.managementToken, nwcUri: body.nwcUri, now: new Date() });
    return NextResponse.json(result, { headers });
  } catch (error) {
    const status = error instanceof DomainError || error instanceof z.ZodError || error instanceof TypeError ? 400 : 500;
    return NextResponse.json({ error: status === 500 ? "Serviço temporariamente indisponível." : "Não foi possível validar a conexão NWC." }, { status, headers });
  } finally { await bundle?.close(); }
}
