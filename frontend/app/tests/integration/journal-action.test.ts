import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock supabase/server
const mockGetUser = vi.fn();
const mockFrom = vi.fn();
const mockRevalidatePath = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: {
      getUser: mockGetUser,
    },
    from: mockFrom,
  })),
}));

vi.mock("next/cache", () => ({
  revalidatePath: (...args: unknown[]) => mockRevalidatePath(...args),
}));

vi.mock("@/lib/crypto/encryption", () => ({
  encryptContent: vi.fn((text: string) => ({
    ciphertext: Buffer.from(text).toString("base64"),
    iv: "mock-iv",
    authTag: "mock-tag",
    version: 1,
  })),
  decryptContent: vi.fn((payload: { ciphertext: string }) =>
    Buffer.from(payload.ciphertext, "base64").toString("utf8"),
  ),
}));

const { createJournalEntry, updateJournalEntry, deleteJournalEntry } =
  await import("@/app/server/journal/journal_action");

const mockUser = { id: "user-123" };

describe("createJournalEntry", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates entry for authenticated user", async () => {
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    mockFrom.mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: {
              id: "entry-1",
              title: "Test",
              content: JSON.stringify({
                ciphertext: Buffer.from("content").toString("base64"),
                iv: "iv",
                authTag: "tag",
                version: 1,
              }),
              created_at: "2026-01-01",
              updated_at: "2026-01-01",
            },
            error: null,
          }),
        }),
      }),
    });

    const result = await createJournalEntry({
      title: "Test",
      content: "content",
    });
    expect(result.id).toBe("entry-1");
    expect(result.title).toBe("Test");
  });

  it("throws for unauthenticated user", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

    await expect(
      createJournalEntry({ title: "Test", content: "content" }),
    ).rejects.toThrow("Unauthorized");
  });

  it("throws when session has error", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: new Error("session expired"),
    });

    await expect(
      createJournalEntry({ title: "Test", content: "content" }),
    ).rejects.toThrow("Unable to read session");
  });

  it("validates payload before creating", async () => {
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });

    await expect(
      createJournalEntry({ title: "", content: "content" }),
    ).rejects.toThrow("Title is required");
  });

  it("throws on Supabase insert error", async () => {
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    mockFrom.mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { message: "DB error" },
          }),
        }),
      }),
    });

    await expect(
      createJournalEntry({ title: "Test", content: "content" }),
    ).rejects.toThrow("DB error");
  });
});

describe("updateJournalEntry", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates entry for authenticated user", async () => {
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    mockFrom.mockReturnValue({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue({
                data: {
                  id: "entry-1",
                  title: "Updated",
                  content: JSON.stringify({
                    ciphertext: Buffer.from("updated").toString("base64"),
                    iv: "iv",
                    authTag: "tag",
                    version: 1,
                  }),
                  created_at: "2026-01-01",
                  updated_at: "2026-01-02",
                },
                error: null,
              }),
            }),
          }),
        }),
      }),
    });

    const result = await updateJournalEntry("entry-1", { title: "Updated" });
    expect(result.title).toBe("Updated");
  });

  it("throws for unauthenticated user", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

    await expect(
      updateJournalEntry("entry-1", { title: "Updated" }),
    ).rejects.toThrow("Unauthorized");
  });

  it("validates update payload", async () => {
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });

    await expect(updateJournalEntry("entry-1", {})).rejects.toThrow(
      "Provide at least one field to update",
    );
  });
});

describe("deleteJournalEntry", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deletes entry and revalidates path", async () => {
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    mockFrom.mockReturnValue({
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null, count: 1 }),
        }),
      }),
    });

    await deleteJournalEntry("entry-1");
    expect(mockRevalidatePath).toHaveBeenCalledWith("/dashboard/journal");
  });

  it("throws when entry not found (count=0)", async () => {
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    mockFrom.mockReturnValue({
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null, count: 0 }),
        }),
      }),
    });

    await expect(deleteJournalEntry("entry-1")).rejects.toThrow(
      "Journal entry not found",
    );
  });

  it("throws for unauthenticated user", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

    await expect(deleteJournalEntry("entry-1")).rejects.toThrow("Unauthorized");
  });

  it("throws on Supabase delete error", async () => {
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    mockFrom.mockReturnValue({
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            error: { message: "FK constraint" },
            count: null,
          }),
        }),
      }),
    });

    await expect(deleteJournalEntry("entry-1")).rejects.toThrow(
      "FK constraint",
    );
  });
});
