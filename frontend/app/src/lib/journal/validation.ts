import type { JournalEntryInput, JournalEntryUpdateInput } from "./types";

export const JOURNAL_TITLE_MAX_LENGTH = 160;
export const JOURNAL_CONTENT_MAX_LENGTH = 20000;

export class JournalValidationError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = "JournalValidationError";
    this.statusCode = statusCode;
  }
}

const coerceString = (value: unknown) => {
  if (typeof value === "string") {
    return value.trim();
  }

  return "";
};

export function validateJournalCreatePayload(body: unknown): JournalEntryInput {
  if (!body || typeof body !== "object") {
    throw new JournalValidationError("Request body must be a JSON object");
  }

  const title = coerceString((body as Record<string, unknown>).title);
  const content = coerceString((body as Record<string, unknown>).content);

  if (!title) {
    throw new JournalValidationError("Title is required");
  }

  if (title.length > JOURNAL_TITLE_MAX_LENGTH) {
    throw new JournalValidationError(
      `Title cannot exceed ${JOURNAL_TITLE_MAX_LENGTH} characters`,
    );
  }

  if (!content) {
    throw new JournalValidationError("Content is required");
  }

  if (content.length > JOURNAL_CONTENT_MAX_LENGTH) {
    throw new JournalValidationError(
      `Content cannot exceed ${JOURNAL_CONTENT_MAX_LENGTH} characters`,
    );
  }

  return {
    title,
    content,
  };
}

export function validateJournalUpdatePayload(
  body: unknown,
): JournalEntryUpdateInput {
  if (!body || typeof body !== "object") {
    throw new JournalValidationError("Request body must be a JSON object");
  }

  const maybeTitle = coerceString((body as Record<string, unknown>).title);
  const maybeContent = coerceString((body as Record<string, unknown>).content);

  const payload: JournalEntryUpdateInput = {};

  if (maybeTitle) {
    if (maybeTitle.length > JOURNAL_TITLE_MAX_LENGTH) {
      throw new JournalValidationError(
        `Title cannot exceed ${JOURNAL_TITLE_MAX_LENGTH} characters`,
      );
    }

    payload.title = maybeTitle;
  }

  if (maybeContent) {
    if (maybeContent.length > JOURNAL_CONTENT_MAX_LENGTH) {
      throw new JournalValidationError(
        `Content cannot exceed ${JOURNAL_CONTENT_MAX_LENGTH} characters`,
      );
    }

    payload.content = maybeContent;
  }

  if (Object.keys(payload).length === 0) {
    throw new JournalValidationError("Provide at least one field to update");
  }

  return payload;
}
