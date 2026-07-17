import { NextResponse } from "next/server";
import QRCode from "qrcode";

import { databaseFromEnvironment } from "@/db/client";
import { issueLnurlAuthChallenge } from "@/db/repositories/lnurl-auth-repository";
import { resolveLnurlAuthBaseUrl } from "@/domain/lnurl-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const privateHeaders = { "Cache-Control": "no-store, private", "Referrer-Policy": "no-referrer" };

export async function POST(request: Request) {
  let bundle: ReturnType<typeof databaseFromEnvironment> | undefined;
  try {
    const callbackBaseUrl = resolveLnurlAuthBaseUrl(request.url);
    bundle = databaseFromEnvironment();
    const challenge = await issueLnurlAuthChallenge(bundle.db, { callbackBaseUrl });
    const qrDataUrl = await QRCode.toDataURL(challenge.lnurl.toUpperCase(), { errorCorrectionLevel: "M", margin: 2, width: 320 });
    return NextResponse.json({
      challengeId: challenge.challengeId,
      pollToken: challenge.pollToken,
      lnurl: challenge.lnurl,
      qrDataUrl,
      expiresAt: challenge.expiresAt.toISOString(),
      publicHttps: new URL(callbackBaseUrl).protocol === "https:",
    }, { headers: privateHeaders });
  } catch {
    return NextResponse.json({ error: "Não foi possível preparar o acesso por carteira." }, { status: 503, headers: privateHeaders });
  } finally {
    await bundle?.close();
  }
}
