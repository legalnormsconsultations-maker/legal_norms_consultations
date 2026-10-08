import { NextResponse } from "next/server";
import { getOAuthAuthorizationUrl, oauthProviders } from "@/lib/auth/oauth";
import { consumeAuthLimit } from "@/lib/auth/rate-limit";

export async function GET(
  request: Request,
  context: { params: Promise<{ provider: string }> },
) {
  const { provider } = await context.params;
  if (!oauthProviders.includes(provider as (typeof oauthProviders)[number])) {
    return NextResponse.redirect(
      new URL("/login?error=oauth-provider", request.url),
    );
  }

  try {
    const remoteAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    await consumeAuthLimit({
      action: "oauth-start",
      key: remoteAddress,
      maximum: 20,
      windowMs: 60 * 60 * 1000,
    });
    const authorizationUrl = await getOAuthAuthorizationUrl(
      provider as (typeof oauthProviders)[number],
    );
    return NextResponse.redirect(authorizationUrl);
  } catch {
    return NextResponse.redirect(
      new URL("/login?error=oauth-config", request.url),
    );
  }
}
