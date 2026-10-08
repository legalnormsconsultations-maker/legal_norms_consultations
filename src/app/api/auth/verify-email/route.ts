import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyEmail } from "@/lib/auth";
import { assertSameOrigin, authErrorResponse, readJson } from "@/lib/auth/http";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  if (!token)
    return NextResponse.redirect(new URL("/login?error=verification", url));
  return NextResponse.redirect(
    new URL(`/verify-email?token=${encodeURIComponent(token)}`, url),
  );
}

const schema = z.object({ token: z.string().min(32) });

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const { token } = schema.parse(await readJson(request));
    await verifyEmail(token);
    return Response.json({ ok: true });
  } catch (error) {
    return authErrorResponse(error);
  }
}
