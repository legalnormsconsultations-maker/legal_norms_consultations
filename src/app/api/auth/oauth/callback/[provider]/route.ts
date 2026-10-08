import { NextResponse } from "next/server";
import { completeOAuthCallback, oauthProviders } from "@/lib/auth/oauth";

async function handleCallback(
  request: Request,
  parameters: URLSearchParams,
  providerName: string,
) {
  if (
    !oauthProviders.includes(providerName as (typeof oauthProviders)[number])
  ) {
    return NextResponse.redirect(
      new URL("/login?error=oauth-provider", request.url),
    );
  }
  try {
    const outcome = await completeOAuthCallback(
      providerName as (typeof oauthProviders)[number],
      parameters,
    );
    const redirectPath =
      outcome === "authenticated"
        ? "/admin/dashboard"
        : outcome === "pending"
          ? `/register?oauth=${providerName}`
          : "/login?notice=verify-email";
    return NextResponse.redirect(new URL(redirectPath, request.url));
  } catch {
    return NextResponse.redirect(new URL("/login?error=oauth", request.url));
  }
}

export async function GET(
  request: Request,
  context: { params: Promise<{ provider: string }> },
) {
  const { provider } = await context.params;
  return handleCallback(request, new URL(request.url).searchParams, provider);
}

export async function POST(
  request: Request,
  context: { params: Promise<{ provider: string }> },
) {
  const { provider } = await context.params;
  const formData = await request.formData();
  return handleCallback(
    request,
    new URLSearchParams(
      Array.from(formData.entries()).map(([key, value]) => [
        key,
        String(value),
      ]),
    ),
    provider,
  );
}
