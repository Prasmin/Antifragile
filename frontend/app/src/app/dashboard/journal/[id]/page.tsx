import type { JSONContent } from "@tiptap/core";
import { notFound, redirect } from "next/navigation";

import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { decryptContent, type EncryptedContent } from "@/lib/crypto/encryption";
import { createClient } from "@/lib/supabase/server";

const TABLE = "journal_entries";

const isEncryptedPayload = (value: unknown): value is EncryptedContent => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Record<string, unknown>;

  return (
    typeof payload.ciphertext === "string" &&
    typeof payload.iv === "string" &&
    typeof payload.authTag === "string"
  );
};

const decodeContent = (rawContent: string): string => {
  try {
    const parsed = JSON.parse(rawContent);

    if (isEncryptedPayload(parsed)) {
      return decryptContent(parsed as EncryptedContent);
    }

    return rawContent;
  } catch {
    return rawContent;
  }
};

const toEditorContent = (content: string): JSONContent | null => {
  try {
    return JSON.parse(content) as JSONContent;
  } catch {
    return null;
  }
};

async function fetchJournalEntry(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error("Unable to read session");
  }

  if (!user) {
    redirect("/login");
  }

  const { data, error: entryError } = await supabase
    .from(TABLE)
    .select("id,title,content,created_at,updated_at")
    .eq("user_id", user.id)
    .eq("id", id)
    .maybeSingle();

  if (entryError) {
    console.error("Failed to fetch journal entry", entryError.message);
    notFound();
  }

  if (!data) {
    notFound();
  }

  const content = decodeContent(data.content ?? "");

  return {
    ...data,
    content,
    editorContent: toEditorContent(content),
  };
}

export default async function JournalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const entry = await fetchJournalEntry(id);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">
            Created {new Date(entry.created_at).toLocaleString()}
          </p>
          <p className="text-xs text-slate-500">
            Updated {new Date(entry.updated_at).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 text-black shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">{entry.title}</h1>
        <SimpleEditor initialContent={entry.editorContent ?? undefined} />
      </div>
    </div>
  );
}
