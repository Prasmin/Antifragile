"use server";

import { NextResponse } from "next/server";

import {
  validateJournalCreatePayload,
  JournalValidationError,
} from "@/lib/journal/validation";
import type {
  JournalEntryInput,
  JournalEntryRecord,
} from "@/lib/journal/journalSchema";
import { createClient } from "@/lib/supabase/server";

const TABLE = "journal_entries";
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

const sanitizeSearchTerm = (value: string | null) =>
  value?.replace(/[%]/g, "").trim() ?? "";

const parseListParams = (request: Request) => {
  const url = new URL(request.url);
  const limitParam = Number(url.searchParams.get("limit"));
  const limit = Number.isFinite(limitParam)
    ? Math.min(Math.max(limitParam, 1), MAX_LIMIT)
    : DEFAULT_LIMIT;

  const cursor = url.searchParams.get("cursor");
  const cursorIsValid = cursor ? !Number.isNaN(Date.parse(cursor)) : false;

  const search = sanitizeSearchTerm(url.searchParams.get("search"));

  return {
    limit,
    cursor: cursorIsValid ? cursor : null,
    search: search.length ? search : null,
  };
};

const unauthorizedResponse = () =>
  NextResponse.json({ error: "Unauthorized" }, { status: 401 });

const sessionErrorResponse = () =>
  NextResponse.json({ error: "Unable to read session" }, { status: 500 });

const getUserContext = async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return { supabase, user, error };
};

export async function GET(request: Request) {
  const { supabase, user, error } = await getUserContext();

  if (error) {
    return sessionErrorResponse();
  }

  const userId = user?.id;

  if (!userId) {
    return unauthorizedResponse();
  }

  const { limit, cursor, search } = parseListParams(request);

  let query = supabase
    .from(TABLE)
    .select("id,title,content,created_at,updated_at", { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (cursor) {
    query = query.lt("created_at", cursor);
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
  }

  const { data } = await query;

  if (!data) {
    return NextResponse.json(
      { error: "Failed to fetch journal entries" },
      { status: 500 },
    );
  }

  const items = (data ?? []) as JournalEntryRecord[];
  const nextCursor =
    items.length === limit ? items[items.length - 1].created_at : null;

  return NextResponse.json({
    data: items,
    meta: {
      count: items.length,
      limit,
      nextCursor,
    },
  });
}

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
    const { data, error: insertError } = await supabase
      .from(TABLE)
      .insert({
        ...payload,
        user_id: userId,
      })
      .select("id,title,content,created_at,updated_at")
      .single();

      console.log("data", data);
    if (insertError || !data) {
      throw new Error(insertError?.message ?? "Failed to create journal entry");
    }

    return data as JournalEntryRecord;
  } catch (error) {
    if (error instanceof JournalValidationError) {
      throw new Error(error.message);
    }

    throw error;
  }
}
