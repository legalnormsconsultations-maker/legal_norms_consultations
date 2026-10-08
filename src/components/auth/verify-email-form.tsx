"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function VerifyEmailForm({ token }: { token: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function verify() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok)
        throw new Error(
          result.error ?? "The verification link is invalid or expired.",
        );
      router.replace("/admin/dashboard");
      router.refresh();
    } catch (verifyError) {
      setError(
        verifyError instanceof Error
          ? verifyError.message
          : "Verification failed.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl items-center px-5 py-10">
      <section className="w-full rounded-lg border border-border bg-card p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-800">
          Email verification
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-foreground">
          Confirm your email address
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Confirm to activate your account and start a secure session.
        </p>
        <button
          type="button"
          disabled={busy}
          onClick={verify}
          className="mt-6 h-11 rounded-md bg-teal-900 px-5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
        >
          {busy ? "Verifying..." : "Verify email"}
        </button>
        {error && (
          <p aria-live="polite" className="mt-4 text-sm text-red-700">
            {error}
          </p>
        )}
      </section>
    </main>
  );
}
