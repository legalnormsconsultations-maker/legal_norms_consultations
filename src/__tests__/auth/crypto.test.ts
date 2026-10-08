import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  createOpaqueToken,
  hashChallenge,
  hashOpaqueToken,
  sealSecret,
  unsealSecret,
} from "@/lib/auth/crypto";

describe("first-party auth crypto", () => {
  beforeAll(() => {
    process.env.AUTH_SECRET =
      "test-only-auth-secret-with-at-least-32-characters";
  });

  it("creates opaque tokens and stores only one-way digests", () => {
    const token = createOpaqueToken();

    expect(token).toHaveLength(43);
    expect(hashOpaqueToken(token)).not.toBe(token);
    expect(hashOpaqueToken(token)).toBe(hashOpaqueToken(token));
  });

  it("creates deterministic keyed challenge hashes", () => {
    expect(hashChallenge("123456")).toBe(hashChallenge("123456"));
    expect(hashChallenge("123456")).not.toBe(hashChallenge("654321"));
  });

  it("encrypts short-lived OAuth verifier data and rejects tampering", () => {
    const sealed = sealSecret("pkce-verifier");

    expect(unsealSecret(sealed)).toBe("pkce-verifier");
    expect(sealed).not.toContain("pkce-verifier");
    expect(() => unsealSecret(`${sealed}x`)).toThrow();
  });
});
