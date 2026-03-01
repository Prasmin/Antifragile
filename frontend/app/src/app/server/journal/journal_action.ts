"use server";

// import { NextResponse } from "next/server";

import {
  validateJournalCreatePayload,
  validateJournalUpdatePayload,
  JournalValidationError,
} from "@/lib/journal/validation";
import type {
  JournalEntryInput,
  JournalEntryRecord,
  JournalEntryUpdateInput,
} from "@/lib/journal/journalSchema";
import {
  decryptContent,
  encryptContent,
  type EncryptedContent,
} from "@/lib/crypto/encryption";
import { createClient } from "@/lib/supabase/server";

const TABLE = "journal_entries";
// const DEFAULT_LIMIT = 20;
// const MAX_LIMIT = 50;

const tryDecryptContent = (rawContent: string): string => {
  try {
    const parsed = JSON.parse(rawContent) as EncryptedContent;

    if (
      parsed &&
      typeof parsed.ciphertext === "string" &&
      typeof parsed.iv === "string" &&
      typeof parsed.authTag === "string"
    ) {
      return decryptContent(parsed);
    }

    return rawContent;
  } catch (error) {
    console.error("Failed to decrypt journal content", error);
    return rawContent;
  }
};

const toDecryptedRecord = (record: JournalEntryRecord): JournalEntryRecord => ({
  ...record,
  content: tryDecryptContent(record.content),
});

// const sanitizeSearchTerm = (value: string | null) =>
//   value?.replace(/[%]/g, "").trim() ?? "";

// const parseListParams = (request: Request) => {
//   const url = new URL(request.url);
//   const limitParam = Number(url.searchParams.get("limit"));
//   const limit = Number.isFinite(limitParam)
//     ? Math.min(Math.max(limitParam, 1), MAX_LIMIT)
//     : DEFAULT_LIMIT;

//   const cursor = url.searchParams.get("cursor");
//   const cursorIsValid = cursor ? !Number.isNaN(Date.parse(cursor)) : false;

//   const search = sanitizeSearchTerm(url.searchParams.get("search"));

//   return {
//     limit,
//     cursor: cursorIsValid ? cursor : null,
//     search: search.length ? search : null,
//   };
// };

// const unauthorizedResponse = () =>
//   NextResponse.json({ error: "Unauthorized" }, { status: 401 });

// const sessionErrorResponse = () =>
//   NextResponse.json({ error: "Unable to read session" }, { status: 500 });

const getUserContext = async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return { supabase, user, error };
};

// export async function getJournalEntries(request: Request) {
//   const { supabase, user, error } = await getUserContext();

//   if (error) {
//     return sessionErrorResponse();
//   }

//   const userId = user?.id;

//   if (!userId) {
//     return unauthorizedResponse();
//   }

//   const { limit, cursor, search } = parseListParams(request);

//   let query = supabase
//     .from(TABLE)
//     .select("id,title,content,created_at,updated_at", { count: "exact" })
//     .eq("user_id", userId)
//     .order("created_at", { ascending: false })
//     .limit(limit);

//   if (cursor) {
//     query = query.lt("created_at", cursor);
//   }

//   if (search) {
//     query = query.or(`title.ilike.%${search}%`);
//   }

//   const { data } = await query;

//   if (!data) {
//     return NextResponse.json(
//       { error: "Failed to fetch journal entries" },
//       { status: 500 },
//     );
//   }

//   const items = (data ?? []) as JournalEntryRecord[];
//   const nextCursor =
//     items.length === limit ? items[items.length - 1].created_at : null;

//   return NextResponse.json({
//     data: items.map(toDecryptedRecord),
//     meta: {
//       count: items.length,
//       limit,
//       nextCursor,
//     },
//   });
// }

export async function createJournalEntry(
  body: unknown,
): Promise<JournalEntryRecord> {
  const { supabase, user, error } = await getUserContext();

  if (error) {
    throw new Error("Unable to read session");
  }

  const userId = user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const payload = validateJournalCreatePayload(body as JournalEntryInput);
    const encryptedContent = encryptContent(payload.content);

    const { data, error: insertError } = await supabase
      .from(TABLE)
      .insert({
        title: payload.title,
        content: JSON.stringify(encryptedContent),
        user_id: userId,
      })
      .select("id,title,content,created_at,updated_at")
      .single();

    if (insertError || !data) {
      throw new Error(insertError?.message ?? "Failed to create journal entry");
    }

    return toDecryptedRecord(data as JournalEntryRecord);
  } catch (error) {
    if (error instanceof JournalValidationError) {
      throw new Error(error.message);
    }

    throw error;
  }
}

export async function updateJournalEntry(
  id: string,
  body: unknown,
): Promise<JournalEntryRecord> {
  const { supabase, user, error } = await getUserContext();

  if (error) {
    throw new Error("Unable to read session");
  }

  const userId = user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const payload = validateJournalUpdatePayload(
      body as JournalEntryUpdateInput,
    );

    const fieldsToUpdate: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (payload.title) {
      fieldsToUpdate.title = payload.title;
    }

    if (payload.content) {
      const encryptedContent = encryptContent(payload.content);
      fieldsToUpdate.content = JSON.stringify(encryptedContent);
    }

    const { data, error: updateError } = await supabase
      .from(TABLE)
      .update(fieldsToUpdate)
      .eq("id", id)
      .eq("user_id", userId)
      .select("id,title,content,created_at,updated_at")
      .maybeSingle();

    if (updateError || !data) {
      throw new Error(updateError?.message ?? "Failed to update journal entry");
    }

    return toDecryptedRecord(data as JournalEntryRecord);
  } catch (error) {
    if (error instanceof JournalValidationError) {
      throw new Error(error.message);
    }

    throw error;
  }
}

export async function deleteJournalEntry(id: string): Promise<void> {
  const { supabase, user, error } = await getUserContext();

  if (error) {
    throw new Error("Unable to read session");
  }

  const userId = user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const { error: deleteError, count } = await supabase
    .from(TABLE)
    .delete({ count: "exact" })
    .eq("id", id)
    .eq("user_id", userId);

  if (deleteError) {
    throw new Error(deleteError.message ?? "Failed to delete journal entry");
  }

  if (!count) {
    throw new Error("Journal entry not found");
  }
}
