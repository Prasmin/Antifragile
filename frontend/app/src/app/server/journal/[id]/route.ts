import { NextResponse } from "next/server";

import {
  JournalValidationError,
  validateJournalUpdatePayload,
} from "@/lib/journal/validation";
import type { JournalEntryRecord } from "@/lib/journal/types";
import { createClient } from "@/lib/supabase/server";

const TABLE = "journal_entries";

const unauthorizedResponse = () =>
  NextResponse.json({ error: "Unauthorized" }, { status: 401 });

const sessionErrorResponse = () =>
  NextResponse.json({ error: "Unable to read session" }, { status: 500 });

const notFoundResponse = () =>
  NextResponse.json({ error: "Journal entry not found" }, { status: 404 });

const parseJson = async (request: Request) => {
  try {
    return await request.json();
  } catch  {
    throw new JournalValidationError("Body must be valid JSON");
  }
};

async function getUserContext() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return { supabase, user, error };
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const { supabase, user } = await getUserContext();

  if (!user) {
    return sessionErrorResponse();
  }

  const userId = user?.id;

  if (!userId) {
    return unauthorizedResponse();
  }

  const { data, error } = await supabase
    .from(TABLE)
    .select("id,title,content,created_at,updated_at")
    .eq("user_id", userId)
    .eq("id", params.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch journal entry", details: error.message },
      { status: 500 },
    );
  }

  if (!data) {
    return notFoundResponse();
  }

  return NextResponse.json(data as JournalEntryRecord);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { supabase, user } = await getUserContext();

  if (!user) {
    return sessionErrorResponse();
  }

  const userId = user?.id;

  if (!userId) {
    return unauthorizedResponse();
  }

  try {
    const body = await parseJson(request);
    const payload = validateJournalUpdatePayload(body);

    const { data, error } = await supabase
      .from(TABLE)
      .update({
        ...payload,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .eq("user_id", userId)
      .select("id,title,content,created_at,updated_at")
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { error: "Failed to update journal entry", details: error.message },
        { status: 500 },
      );
    }

    if (!data) {
      return notFoundResponse();
    }

    return NextResponse.json(data as JournalEntryRecord);
  } catch (error) {
    if (error instanceof JournalValidationError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }

    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const { supabase, user } = await getUserContext();

  if (!user) {
    return sessionErrorResponse();
  }

  const userId = user?.id;

  if (!userId) {
    return unauthorizedResponse();
  }

  const { error, count } = await supabase
    .from(TABLE)
    .delete({ count: "exact" })
    .eq("id", params.id)
    .eq("user_id", userId);

  if (error) {
    return NextResponse.json(
      { error: "Failed to delete journal entry", details: error.message },
      { status: 500 },
    );
  }

  if (!count) {
    return notFoundResponse();
  }

  return NextResponse.json({ success: true });
}
