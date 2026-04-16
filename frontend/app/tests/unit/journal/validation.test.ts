import { describe, it, expect } from "vitest";
import {
  validateJournalCreatePayload,
  validateJournalUpdatePayload,
  JournalValidationError,
  JOURNAL_TITLE_MAX_LENGTH,
  JOURNAL_CONTENT_MAX_LENGTH,
} from "@/lib/journal/validation";

describe("validateJournalCreatePayload", () => {
  it("accepts valid payload", () => {
    const result = validateJournalCreatePayload({
      title: "My Journal Entry inside north strathfield",
      content: "Today I learned something new.",
    });
    expect(result).toEqual({
      title: "My Journal Entry inside north strathfield",
      content: "Today I learned something new.",
    });
  });

  it("trims whitespace from title and content", () => {
    const result = validateJournalCreatePayload({
      title: "  Trimmed Title  ",
      content: "  Trimmed content  ",
    });
    expect(result.title).toBe("Trimmed Title");
    expect(result.content).toBe("Trimmed content");
  });

  it("rejects null body", () => {
    expect(() => validateJournalCreatePayload(null)).toThrow(
      JournalValidationError,
    );
    expect(() => validateJournalCreatePayload(null)).toThrow(
      "Request body must be a JSON object",
    );
  });

  it("rejects non-object body", () => {
    expect(() => validateJournalCreatePayload("string")).toThrow(
      JournalValidationError,
    );
    expect(() => validateJournalCreatePayload(42)).toThrow(
      JournalValidationError,
    );
  });

  it("rejects empty title", () => {
    expect(() =>
      validateJournalCreatePayload({ title: "", content: "valid" }),
    ).toThrow("Title is required");
  });

  it("rejects whitespace-only title", () => {
    expect(() =>
      validateJournalCreatePayload({ title: "   ", content: "valid" }),
    ).toThrow("Title is required");
  });

  it("rejects title exceeding max length", () => {
    expect(() =>
      validateJournalCreatePayload({
        title: "a".repeat(JOURNAL_TITLE_MAX_LENGTH + 1),
        content: "valid",
      }),
    ).toThrow(`Title cannot exceed ${JOURNAL_TITLE_MAX_LENGTH} characters`);
  });

  it("accepts title at exactly max length", () => {
    const result = validateJournalCreatePayload({
      title: "a".repeat(JOURNAL_TITLE_MAX_LENGTH),
      content: "valid content",
    });
    expect(result.title.length).toBe(JOURNAL_TITLE_MAX_LENGTH);
  });

  it("rejects empty content", () => {
    expect(() =>
      validateJournalCreatePayload({ title: "Valid Title", content: "" }),
    ).toThrow("Content is required");
  });

  it("rejects content exceeding max length", () => {
    expect(() =>
      validateJournalCreatePayload({
        title: "Valid Title",
        content: "a".repeat(JOURNAL_CONTENT_MAX_LENGTH + 1),
      }),
    ).toThrow(`Content cannot exceed ${JOURNAL_CONTENT_MAX_LENGTH} characters`);
  });

  it("accepts content at exactly max length", () => {
    const result = validateJournalCreatePayload({
      title: "Valid",
      content: "a".repeat(JOURNAL_CONTENT_MAX_LENGTH),
    });
    expect(result.content.length).toBe(JOURNAL_CONTENT_MAX_LENGTH);
  });

  it("coerces non-string values to empty string", () => {
    expect(() =>
      validateJournalCreatePayload({ title: 123, content: "valid" }),
    ).toThrow("Title is required");
  });
});

describe("validateJournalUpdatePayload", () => {
  it("accepts partial update with title only", () => {
    const result = validateJournalUpdatePayload({ title: "Updated Title" });
    expect(result).toEqual({ title: "Updated Title" });
  });

  it("accepts partial update with content only", () => {
    const result = validateJournalUpdatePayload({ content: "Updated content" });
    expect(result).toEqual({ content: "Updated content" });
  });

  it("accepts both title and content", () => {
    const result = validateJournalUpdatePayload({
      title: "New Title",
      content: "New content",
    });
    expect(result).toEqual({ title: "New Title", content: "New content" });
  });

  it("rejects empty object (no fields to update)", () => {
    expect(() => validateJournalUpdatePayload({})).toThrow(
      "Provide at least one field to update",
    );
  });

  it("rejects when only whitespace fields provided", () => {
    expect(() =>
      validateJournalUpdatePayload({ title: "   ", content: "  " }),
    ).toThrow("Provide at least one field to update");
  });

  it("rejects null body", () => {
    expect(() => validateJournalUpdatePayload(null)).toThrow(
      "Request body must be a JSON object",
    );
  });

  it("rejects title exceeding max length", () => {
    expect(() =>
      validateJournalUpdatePayload({
        title: "a".repeat(JOURNAL_TITLE_MAX_LENGTH + 1),
      }),
    ).toThrow(`Title cannot exceed ${JOURNAL_TITLE_MAX_LENGTH} characters`);
  });

  it("rejects content exceeding max length", () => {
    expect(() =>
      validateJournalUpdatePayload({
        content: "a".repeat(JOURNAL_CONTENT_MAX_LENGTH + 1),
      }),
    ).toThrow(`Content cannot exceed ${JOURNAL_CONTENT_MAX_LENGTH} characters`);
  });
});

describe("JournalValidationError", () => {
  it("has correct default status code", () => {
    const error = new JournalValidationError("test");
    expect(error.statusCode).toBe(400);
    expect(error.name).toBe("JournalValidationError");
  });

  it("accepts custom status code", () => {
    const error = new JournalValidationError("not found", 404);
    expect(error.statusCode).toBe(404);
  });

  it("is an instance of Error", () => {
    const error = new JournalValidationError("test");
    expect(error).toBeInstanceOf(Error);
  });
});
