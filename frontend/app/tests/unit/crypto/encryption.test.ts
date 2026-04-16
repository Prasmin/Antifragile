import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Must set KEY_ENV before importing the module
const TEST_KEY_BASE64 = Buffer.from("a".repeat(32)).toString("base64"); // valid 32-byte key

describe("encryption", () => {
  beforeEach(() => {
    vi.stubEnv("KEY_ENV", TEST_KEY_BASE64);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("encrypts and decrypts a round-trip correctly", async () => {
    const { encryptContent, decryptContent } =
      await import("@/lib/crypto/encryption");

    const plaintext = "Hello, Antifragile journal!";
    const encrypted = encryptContent(plaintext);

    expect(encrypted).toHaveProperty("ciphertext");
    expect(encrypted).toHaveProperty("iv");
    expect(encrypted).toHaveProperty("authTag");
    expect(encrypted.version).toBe(1);

    // Ciphertext should not equal plaintext
    expect(encrypted.ciphertext).not.toBe(plaintext);

    const decrypted = decryptContent(encrypted);
    expect(decrypted).toBe(plaintext);
  });

  it("produces different ciphertexts for the same plaintext (random IV)", async () => {
    const { encryptContent } = await import("@/lib/crypto/encryption");

    const plaintext = "Same text, different encryption";
    const encrypted1 = encryptContent(plaintext);
    const encrypted2 = encryptContent(plaintext);

    expect(encrypted1.iv).not.toBe(encrypted2.iv);
    expect(encrypted1.ciphertext).not.toBe(encrypted2.ciphertext);
  });

  it("handles empty string encryption", async () => {
    const { encryptContent, decryptContent } =
      await import("@/lib/crypto/encryption");

    const encrypted = encryptContent("");
    const decrypted = decryptContent(encrypted);
    expect(decrypted).toBe("");
  });

  it("handles unicode content", async () => {
    const { encryptContent, decryptContent } =
      await import("@/lib/crypto/encryption");

    const plaintext = "日本語テスト 🎉 émojis & spëcial chârs";
    const encrypted = encryptContent(plaintext);
    const decrypted = decryptContent(encrypted);
    expect(decrypted).toBe(plaintext);
  });

  it("handles large content", async () => {
    const { encryptContent, decryptContent } =
      await import("@/lib/crypto/encryption");

    const plaintext = "x".repeat(20_000); // max journal content length
    const encrypted = encryptContent(plaintext);
    const decrypted = decryptContent(encrypted);
    expect(decrypted).toBe(plaintext);
  });

  it("fails decryption with tampered ciphertext", async () => {
    const { encryptContent, decryptContent } =
      await import("@/lib/crypto/encryption");

    const encrypted = encryptContent("sensitive data");
    // Tamper with ciphertext
    const tampered = { ...encrypted, ciphertext: "dGFtcGVyZWQ=" };

    expect(() => decryptContent(tampered)).toThrow();
  });

  it("fails decryption with tampered authTag", async () => {
    const { encryptContent, decryptContent } =
      await import("@/lib/crypto/encryption");

    const encrypted = encryptContent("sensitive data");
    const tampered = {
      ...encrypted,
      authTag: Buffer.from("bad-tag-value!!").toString("base64"),
    };

    expect(() => decryptContent(tampered)).toThrow();
  });

  it("rejects unsupported payload version", async () => {
    const { encryptContent, decryptContent } =
      await import("@/lib/crypto/encryption");

    const encrypted = encryptContent("test");
    const tampered = { ...encrypted, version: 99 };

    expect(() => decryptContent(tampered)).toThrow(
      "Unsupported encryption payload version",
    );
  });

  it("rejects null/undefined payload", async () => {
    const { decryptContent } = await import("@/lib/crypto/encryption");

    expect(() => decryptContent(null as never)).toThrow();
    expect(() => decryptContent(undefined as never)).toThrow();
  });

  it("throws when KEY_ENV is missing", async () => {
    vi.stubEnv("KEY_ENV", "");

    // Re-import to pick up new env
    const mod = await import("@/lib/crypto/encryption");
    expect(() => mod.encryptContent("test")).toThrow("KEY_ENV is not set");
  });

  it("throws when KEY_ENV is wrong length", async () => {
    vi.stubEnv("KEY_ENV", Buffer.from("short").toString("base64"));

    const mod = await import("@/lib/crypto/encryption");
    expect(() => mod.encryptContent("test")).toThrow(
      "KEY_ENV must decode to 32 bytes",
    );
  });
});
