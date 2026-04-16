import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock fetch globally for Turnstile verification
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

// Must import after mocking
const { submitContactForm } = await import("@/app/server/contact/actions");

describe("submitContactForm", () => {
  beforeEach(() => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "test-secret-key");
    mockFetch.mockReset();
  });

  const validFormData = {
    name: "John Doe",
    email: "john@example.com",
    subject: "Hello",
    message: "This is a valid test message for the contact form.",
    turnstileToken: "valid-token",
  };

  it("returns success for valid submission", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const result = await submitContactForm(validFormData);
    expect(result).toEqual({ success: true });
  });

  it("fails when Turnstile verification fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: false }),
    });

    const result = await submitContactForm(validFormData);
    expect(result).toEqual({
      success: false,
      error: "Human verification failed. Please try again.",
    });
  });

  it("fails when Turnstile API returns non-ok response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
    });

    const result = await submitContactForm(validFormData);
    expect(result).toEqual({
      success: false,
      error: "Human verification failed. Please try again.",
    });
  });

  it("rejects invalid name (empty)", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const result = await submitContactForm({ ...validFormData, name: "" });
    expect(result).toEqual({ success: false, error: "Invalid name." });
  });

  it("rejects name exceeding 100 characters", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const result = await submitContactForm({
      ...validFormData,
      name: "a".repeat(101),
    });
    expect(result).toEqual({ success: false, error: "Invalid name." });
  });

  it("rejects invalid email format", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const result = await submitContactForm({
      ...validFormData,
      email: "not-an-email",
    });
    expect(result).toEqual({ success: false, error: "Invalid email address." });
  });

  it("rejects empty subject", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const result = await submitContactForm({ ...validFormData, subject: "" });
    expect(result).toEqual({ success: false, error: "Invalid subject." });
  });

  it("rejects subject exceeding 200 characters", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const result = await submitContactForm({
      ...validFormData,
      subject: "a".repeat(201),
    });
    expect(result).toEqual({ success: false, error: "Invalid subject." });
  });

  it("rejects message shorter than 10 characters", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const result = await submitContactForm({
      ...validFormData,
      message: "short",
    });
    expect(result).toEqual({
      success: false,
      error: "Message must be between 10 and 5000 characters.",
    });
  });

  it("rejects message exceeding 5000 characters", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const result = await submitContactForm({
      ...validFormData,
      message: "a".repeat(5001),
    });
    expect(result).toEqual({
      success: false,
      error: "Message must be between 10 and 5000 characters.",
    });
  });

  it("sends correct data to Turnstile API", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    await submitContactForm(validFormData);

    expect(mockFetch).toHaveBeenCalledWith(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }),
    );
  });
});
