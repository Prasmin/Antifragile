import { describe, it, expect, vi, beforeEach } from "vitest";


// Mock dependencies
const mockGetUser = vi.fn();
const mockFrom = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser: mockGetUser },
    from: mockFrom,
  })),
}));

vi.mock("@/lib/crypto/encryption", () => ({
  decryptContent: vi.fn((payload: { ciphertext: string }) =>
    Buffer.from(payload.ciphertext, "base64").toString("utf8"),
  ),
}));

const { GET, PATCH, DELETE } = await import("@/app/server/journal/[id]/route");

const mockUser = { id: "user-123" };

function createRequest(method: string, body?: unknown) {
  const req = new Request("http://localhost/api/journal/entry-1", {
    method,
    ...(body
      ? {
          body: JSON.stringify(body),
          headers: { "Content-Type": "application/json" },
        }
      : {}),
  });
  return req;
}

const params = Promise.resolve({ id: "entry-1" });

describe("GET /server/journal/[id]", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 for unauthenticated user", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

    const res = await GET(createRequest("GET"), { params });
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe("Unauthorized");
  });

  it("returns 500 for session error", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: new Error("bad session"),
    });

    const res = await GET(createRequest("GET"), { params });
    expect(res.status).toBe(500);
  });

  it("returns 404 when entry not found", async () => {
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      }),
    });

    const res = await GET(createRequest("GET"), { params });
    expect(res.status).toBe(404);
  });

  it("returns decrypted journal entry", async () => {
    const encryptedContent = JSON.stringify({
      ciphertext: Buffer.from("Hello journal").toString("base64"),
      iv: "test-iv",
      authTag: "test-tag",
      version: 1,
    });

    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: {
                id: "entry-1",
                user_id: "user-123",
                title: "My Entry",
                content: encryptedContent,
                created_at: "2026-01-01",
                updated_at: "2026-01-01",
              },
              error: null,
            }),
          }),
        }),
      }),
    });

    const res = await GET(createRequest("GET"), { params });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.title).toBe("My Entry");
    expect(json.content).toBe("Hello journal");
  });
});

describe("PATCH /server/journal/[id]", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 500 for unauthenticated user", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

    const res = await PATCH(createRequest("PATCH", { title: "Updated" }), {
      params,
    });
    // user is null, so it hits sessionErrorResponse
    expect(res.status).toBe(500);
  });

  it("returns 400 for invalid payload", async () => {
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });

    const res = await PATCH(createRequest("PATCH", {}), { params });
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Provide at least one field to update");
  });

  it("returns 404 when entry not found", async () => {
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    mockFrom.mockReturnValue({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              maybeSingle: vi
                .fn()
                .mockResolvedValue({ data: null, error: null }),
            }),
          }),
        }),
      }),
    });

    const res = await PATCH(createRequest("PATCH", { title: "Updated" }), {
      params,
    });
    expect(res.status).toBe(404);
  });
});

describe("DELETE /server/journal/[id]", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 500 for unauthenticated user", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

    const res = await DELETE(createRequest("DELETE"), { params });
    expect(res.status).toBe(500);
  });

  it("returns 404 when entry not found", async () => {
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    mockFrom.mockReturnValue({
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null, count: 0 }),
        }),
      }),
    });

    const res = await DELETE(createRequest("DELETE"), { params });
    expect(res.status).toBe(404);
  });

  it("returns success when entry deleted", async () => {
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    mockFrom.mockReturnValue({
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null, count: 1 }),
        }),
      }),
    });

    const res = await DELETE(createRequest("DELETE"), { params });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });
});
