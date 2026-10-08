"use client";

import { Activity, ArrowRight, LoaderCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { COUNTRY_CODES } from "@/lib/country-codes";

type AuthMode = "login" | "register" | "forgot" | "reset";
type AuthFormProps = {
  mode: AuthMode;
  oauthProvider?: string;
  resetToken?: string;
  notice?: string;
  error?: string;
};

const providers = [
  "google",
  "microsoft",
  "github",
  "facebook",
  "x",
  "apple",
  "discord",
  "linkedin",
];

const ProviderIcons: Record<string, React.ReactNode> = {
  google: (
    <svg
      className="mr-2"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  ),
  microsoft: (
    <svg
      className="mr-2"
      width="18"
      height="18"
      viewBox="0 0 21 21"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="1" y="1" width="9" height="9" fill="#f25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
      <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
      <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
    </svg>
  ),
  github: (
    <svg
      className="mr-2 text-foreground"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.747-1.026 2.747-1.026.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z"
      />
    </svg>
  ),
  facebook: (
    <svg
      className="mr-2"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="#1877F2"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  x: (
    <svg
      className="mr-2 text-foreground"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  apple: (
    <svg
      className="mr-2 text-foreground"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M16.824 15.688c-.019.043-1.077 3.666-3.693 3.666-1.579 0-2.025-.97-3.791-.97-1.791 0-2.316.945-3.815.97-2.613.04-5.322-4.57-5.322-8.563 0-4.043 2.593-6.19 4.966-6.19 1.636 0 2.809.99 3.864.99 1.036 0 2.457-1.082 4.316-1.082 1.874 0 3.32.748 4.152 1.959-3.418 1.956-2.88 6.55.952 8.016-.622 1.761-1.614 3.208-2.628 4.204zm-4.314-11.83c.969-1.229 1.621-2.923 1.444-4.596-1.423.06-3.203.97-4.21 2.188-.887 1.073-1.652 2.806-1.436 4.436 1.597.135 3.197-.847 4.202-2.028z" />
    </svg>
  ),
  discord: (
    <svg
      className="mr-2"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="#5865F2"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028l1.22-1.993a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107l1.22 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  ),
  linkedin: (
    <svg
      className="mr-2"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="#0A66C2"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zM7.119 20.452H3.554V9h3.565v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
};

const inputClassName =
  "mt-1 block h-11 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15";

export function AuthForm({
  mode,
  oauthProvider,
  resetToken,
  notice,
  error,
}: AuthFormProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(notice ?? error ?? "");
  const [messageKind, setMessageKind] = useState(
    notice ? "success" : error ? "error" : "info",
  );
  const [phoneMode, setPhoneMode] = useState(false);
  const [phoneCodeSent, setPhoneCodeSent] = useState(false);
  const [countryCode, setCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const phone = `${countryCode}${phoneNumber}`;
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  async function post(path: string, body: Record<string, string>) {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = (await response.json()) as {
      message?: string;
      error?: string;
    };
    if (!response.ok) throw new Error(result.error ?? "Request failed.");
    return result;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const data = new FormData(event.currentTarget);
    const values = Object.fromEntries(
      Array.from(data.entries()).map(([key, value]) => [key, String(value)]),
    );

    try {
      if (mode === "register") {
        const result = await post("/api/auth/signup", values);
        setMessage(
          result.message ?? "Check your email for the verification link.",
        );
        setMessageKind("success");
      } else if (mode === "login") {
        await post("/api/auth/login", values);
        router.replace("/admin/dashboard");
        router.refresh();
      } else if (mode === "forgot") {
        const result = await post("/api/auth/forgot-password", values);
        setMessage(
          result.message ??
            "If an account exists, a reset email has been sent.",
        );
        setMessageKind("success");
      } else {
        const result = await post("/api/auth/reset-password", {
          token: resetToken ?? "",
          password: values.password ?? "",
        });
        setMessage(result.message ?? "Password updated.");
        setMessageKind("success");
        router.replace("/login?notice=password-reset");
      }
    } catch (submitError) {
      const errorMessage =
        submitError instanceof Error ? submitError.message : "Request failed.";
      setMessage(errorMessage);
      setMessageKind("error");
    } finally {
      setBusy(false);
    }
  }

  async function requestPhoneCode() {
    setBusy(true);
    setMessage("");
    try {
      const result = await post("/api/auth/phone/request", {
        phone,
        mode: "login",
      });
      setPhoneCodeSent(true);
      setMessage(result.message ?? "If eligible, a code has been sent.");
      setMessageKind("info");
    } catch (requestError) {
      setMessage(
        requestError instanceof Error
          ? requestError.message
          : "Could not send code.",
      );
      setMessageKind("error");
    } finally {
      setBusy(false);
    }
  }

  async function verifyPhoneCode() {
    setBusy(true);
    setMessage("");
    try {
      await post("/api/auth/phone/verify", { phone, code, mode: "login" });
      router.replace("/admin/dashboard");
      router.refresh();
    } catch (verifyError) {
      setMessage(
        verifyError instanceof Error
          ? verifyError.message
          : "Could not verify code.",
      );
      setMessageKind("error");
    } finally {
      setBusy(false);
    }
  }

  async function resendVerification() {
    setBusy(true);
    setMessage("");
    try {
      const result = await post("/api/auth/resend-verification", { email });
      setMessage(
        result.message ?? "If needed, a verification email has been sent.",
      );
      setMessageKind("success");
    } catch (resendError) {
      setMessage(
        resendError instanceof Error
          ? resendError.message
          : "Unable to resend verification.",
      );
      setMessageKind("error");
    } finally {
      setBusy(false);
    }
  }

  const title = {
    login: "Sign in to your workspace",
    register: oauthProvider
      ? "Finish creating your account"
      : "Create your account",
    forgot: "Reset your password",
    reset: "Choose a new password",
  }[mode];

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-5 py-10 sm:px-8">
      <div className="grid w-full overflow-hidden rounded-lg border border-border bg-card shadow-sm lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="hidden flex-col justify-between bg-[#123b3a] p-10 text-white lg:flex">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-lg font-semibold"
          >
            <span className="flex size-9 items-center justify-center rounded bg-teal-300 text-[#123b3a]">
              <Activity size={20} />
            </span>
            Legalnorms
          </Link>
          <div className="max-w-sm">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-teal-200">
              Regulatory intelligence
            </p>
            <h1 className="text-3xl font-semibold leading-tight">
              One trusted workspace for medical data and compliance.
            </h1>
            <p className="mt-5 text-sm leading-6 text-teal-50/80">
              Your account and sessions are managed by this application and
              stored securely in its database.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-teal-100/80">
            <ShieldCheck size={16} /> Protected with encrypted credentials and
            revocable sessions
          </div>
        </aside>

        <section className="mx-auto w-full max-w-xl px-6 py-8 sm:px-10 sm:py-12">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-teal-900 lg:hidden"
          >
            <Activity size={18} /> Legalnorms
          </Link>
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-teal-800">
              Secure access
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-foreground">
              {title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {mode === "register"
                ? "Use your work email. We’ll verify it before enabling your session."
                : mode === "login"
                  ? "Continue with your email, phone, or connected identity provider."
                  : "We’ll send a single-use link to the email associated with your account."}
            </p>
          </div>

          {mode === "login" && (
            <fieldset className="mb-6 grid grid-cols-2 rounded-md border border-border bg-secondary p-1">
              <legend className="sr-only">Sign-in method</legend>
              <button
                type="button"
                onClick={() => setPhoneMode(false)}
                className={`h-9 rounded text-sm font-medium ${!phoneMode ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => setPhoneMode(true)}
                className={`h-9 rounded text-sm font-medium ${phoneMode ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
              >
                Phone
              </button>
            </fieldset>
          )}

          {mode === "login" && phoneMode ? (
            <div className="space-y-4">
              <label
                className="block text-sm font-medium text-foreground"
                htmlFor="phone"
              >
                Phone number
              </label>
              <div className="mt-1 flex h-11 rounded-md border border-border bg-card focus-within:border-teal-700 focus-within:ring-2 focus-within:ring-teal-700/15">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="flex-shrink-0 bg-transparent py-2 pl-3 pr-8 text-sm text-foreground outline-none border-r border-border rounded-l-md"
                  aria-label="Country code"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.country + c.code} value={c.code}>
                      {c.country} ({c.code})
                    </option>
                  ))}
                </select>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  placeholder="4155550123"
                  className="flex-1 bg-transparent px-3 py-2 text-sm text-foreground outline-none rounded-r-md min-w-0"
                />
              </div>
              {phoneCodeSent && (
                <div>
                  <label
                    className="block text-sm font-medium text-foreground"
                    htmlFor="phone-code"
                  >
                    Verification code
                  </label>
                  <input
                    id="phone-code"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                    className={inputClassName}
                  />
                </div>
              )}
              <button
                type="button"
                disabled={busy || !phoneNumber}
                onClick={phoneCodeSent ? verifyPhoneCode : requestPhoneCode}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-teal-900 px-4 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy && <LoaderCircle size={16} className="animate-spin" />}
                {phoneCodeSent
                  ? "Verify and sign in"
                  : "Send verification code"}
              </button>
              <p className="text-xs leading-5 text-muted-foreground">
                Phone sign-in is available after you verify a number in account
                security settings.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      className="block text-sm font-medium text-foreground"
                      htmlFor="firstName"
                    >
                      First name
                    </label>
                    <input
                      className={inputClassName}
                      id="firstName"
                      name="firstName"
                      autoComplete="given-name"
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-foreground"
                      htmlFor="lastName"
                    >
                      Last name
                    </label>
                    <input
                      className={inputClassName}
                      id="lastName"
                      name="lastName"
                      autoComplete="family-name"
                      required
                    />
                  </div>
                </div>
              )}
              {mode !== "reset" && (
                <div>
                  <label
                    className="block text-sm font-medium text-foreground"
                    htmlFor="email"
                  >
                    Email address
                  </label>
                  <input
                    className={inputClassName}
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
              )}
              {(mode === "login" ||
                mode === "register" ||
                mode === "reset") && (
                <div>
                  <label
                    className="block text-sm font-medium text-foreground"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                    className={inputClassName}
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={
                      mode === "login" ? "current-password" : "new-password"
                    }
                    minLength={mode === "login" ? 1 : 12}
                    maxLength={128}
                    required
                  />
                  {mode !== "login" && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Use at least 12 characters.
                    </p>
                  )}
                </div>
              )}
              {mode === "login" && (
                <div className="flex justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-teal-800 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}
              <button
                type="submit"
                disabled={busy}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-teal-900 px-4 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy && <LoaderCircle size={16} className="animate-spin" />}
                {mode === "register"
                  ? "Create account"
                  : mode === "forgot"
                    ? "Send reset link"
                    : mode === "reset"
                      ? "Save new password"
                      : "Sign in"}
                {!busy && <ArrowRight size={16} />}
              </button>
            </form>
          )}

          {mode === "login" || mode === "register" ? (
            <>
              <div className="my-6 flex items-center gap-3 text-xs text-neutral-400">
                <span className="h-px flex-1 bg-neutral-200" />
                <span>OR CONTINUE WITH</span>
                <span className="h-px flex-1 bg-neutral-200" />
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {providers.map((provider) => (
                  <a
                    key={provider}
                    href={`/api/auth/oauth/${provider}`}
                    className="flex h-10 items-center justify-center rounded-md border border-border px-3 text-sm font-medium capitalize text-foreground transition hover:bg-secondary"
                  >
                    {ProviderIcons[provider]}
                    {provider === "x"
                      ? "X"
                      : provider === "linkedin"
                        ? "LinkedIn"
                        : provider}
                  </a>
                ))}
              </div>
            </>
          ) : null}

          {message && (
            <p
              aria-live="polite"
              className={`mt-5 rounded-md border px-3 py-2.5 text-sm ${messageKind === "error" ? "border-red-200 bg-red-50 text-red-800" : messageKind === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-border bg-secondary text-muted-foreground"}`}
            >
              {message}
            </p>
          )}

          {mode === "login" &&
            message.includes("Verify your email") &&
            !phoneMode && (
              <button
                type="button"
                disabled={busy || !email}
                onClick={resendVerification}
                className="mt-3 text-sm font-semibold text-teal-900 underline underline-offset-4 disabled:opacity-50"
              >
                Resend verification email
              </button>
            )}

          <div className="mt-7 border-t border-border pt-5 text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                New to Legalnorms?{" "}
                <Link
                  className="font-semibold text-teal-900 hover:underline"
                  href="/register"
                >
                  Create an account
                </Link>
              </>
            ) : mode === "register" ? (
              <>
                Already registered?{" "}
                <Link
                  className="font-semibold text-teal-900 hover:underline"
                  href="/login"
                >
                  Sign in
                </Link>
              </>
            ) : (
              <Link
                className="font-semibold text-teal-900 hover:underline"
                href="/login"
              >
                Return to sign in
              </Link>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
