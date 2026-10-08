"use client";

import { useState } from "react";
import { COUNTRY_CODES } from "@/lib/country-codes";

export function PhoneSecurityForm({
  currentPhone,
}: {
  currentPhone: string | null;
}) {
  let initialCountryCode = "+1";
  let initialPhoneNumber = currentPhone ?? "";

  if (currentPhone) {
    const sortedCodes = [...COUNTRY_CODES].sort(
      (a, b) => b.code.length - a.code.length,
    );
    const matched = sortedCodes.find((c) => currentPhone.startsWith(c.code));
    if (matched) {
      initialCountryCode = matched.code;
      initialPhoneNumber = currentPhone.substring(matched.code.length);
    }
  }

  const [countryCode, setCountryCode] = useState(initialCountryCode);
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const phone = `${countryCode}${phoneNumber}`;

  async function requestCode() {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/auth/phone/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, mode: "enroll" }),
      });
      const body = (await response.json()) as {
        error?: string;
        message?: string;
      };
      if (!response.ok) throw new Error(body.error ?? "Unable to send code.");
      setCodeSent(true);
      setMessage(body.message ?? "Verification code sent.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to send code.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode() {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/auth/phone/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code, mode: "enroll" }),
      });
      const body = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(body.error ?? "Unable to verify code.");
      setMessage("Phone number verified and saved to your account.");
      setCodeSent(false);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to verify code.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-xl space-y-4">
      <div>
        <label
          htmlFor="security-phone"
          className="block text-sm font-medium text-foreground"
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
            id="security-phone"
            type="tel"
            autoComplete="tel"
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
            placeholder="4155550123"
            className="flex-1 bg-transparent px-3 py-2 text-sm text-foreground outline-none rounded-r-md min-w-0"
          />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Select your country code and enter your phone number.
        </p>
      </div>
      {codeSent && (
        <div>
          <label
            htmlFor="security-code"
            className="block text-sm font-medium text-foreground"
          >
            Verification code
          </label>
          <input
            id="security-code"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            className="mt-1 h-11 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15"
          />
        </div>
      )}
      <button
        type="button"
        disabled={busy || !phoneNumber}
        onClick={codeSent ? verifyCode : requestCode}
        className="h-10 rounded-md bg-teal-900 px-4 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
      >
        {busy
          ? "Working..."
          : codeSent
            ? "Verify phone"
            : currentPhone
              ? "Replace phone number"
              : "Add phone number"}
      </button>
      {message && (
        <p aria-live="polite" className="text-sm text-muted-foreground">
          {message}
        </p>
      )}
    </div>
  );
}
