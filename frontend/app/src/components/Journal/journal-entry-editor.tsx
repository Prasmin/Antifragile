"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { JSONContent } from "@tiptap/core";

import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { updateJournalEntry } from "@/app/server/journal/journal_action";

type EditorSnapshot = {
  json: JSONContent | null;
  text: string;
};

type JournalEntryEditorProps = {
  entry: {
    id: string;
    title: string;
    editorContent: JSONContent | null;
  };
};

const serializeContent = (content: JSONContent | null) =>
  JSON.stringify(content ?? null);

export function JournalEntryEditor({ entry }: JournalEntryEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(entry.title);
  const [snapshot, setSnapshot] = useState<EditorSnapshot>({
    json: entry.editorContent ?? null,
    text: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setTitle(entry.title);
    setSnapshot({ json: entry.editorContent ?? null, text: "" });
    setSuccessMessage(null);
    setError(null);
  }, [entry.id, entry.title, entry.editorContent]);

  const initialSerializedContent = useMemo(
    () => serializeContent(entry.editorContent ?? null),
    [entry.editorContent],
  );

  const handleEditorUpdate = useCallback((payload: EditorSnapshot) => {
    setSnapshot(payload);
    setSuccessMessage(null);
    setError(null);
  }, []);

  const hasTitleChanged = title.trim() !== entry.title;
  const currentSerializedContent = serializeContent(snapshot.json);
  const hasContentChanged =
    currentSerializedContent !== initialSerializedContent;
  const pendingContent =
    hasContentChanged && snapshot.json
      ? JSON.stringify(snapshot.json)
      : undefined;

  const nothingToUpdate = !hasTitleChanged && !pendingContent;

  const handleUpdate = useCallback(async () => {
    if (nothingToUpdate) {
      return;
    }

    const trimmedTitle = title.trim();
    const payload: { title?: string; content?: string } = {};

    if (hasTitleChanged) {
      if (!trimmedTitle) {
        setError("Title cannot be empty");
        return;
      }

      payload.title = trimmedTitle;
    }

    if (pendingContent) {
      payload.content = pendingContent;
    }

    setIsSaving(true);
    setError(null);

    try {
      await updateJournalEntry(entry.id, payload);
      setSuccessMessage("Journal updated");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update journal entry",
      );
    } finally {
      setIsSaving(false);
    }
  }, [
    entry.id,
    hasTitleChanged,
    nothingToUpdate,
    pendingContent,
    router,
    title,
  ]);

  return (
    <>
      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 text-black shadow-sm">
        <input
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            setSuccessMessage(null);
            setError(null);
          }}
          placeholder="Entry title"
          className="w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-lg font-semibold focus:border-blue-500 focus:outline-none"
          aria-label="Journal title"
        />
        <SimpleEditor
          initialContent={entry.editorContent ?? undefined}
          onUpdate={handleEditorUpdate}
        />
        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : successMessage ? (
          <p className="text-sm text-emerald-600">{successMessage}</p>
        ) : null}
      </div>
      <div className="flex items-center justify-center">
        <button
          type="button"
          onClick={handleUpdate}
          disabled={isSaving || nothingToUpdate}
          className="gap-3 rounded-[14px] bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 text-base font-semibold text-white disabled:opacity-60 cursor-pointer"
        >
          {isSaving ? "Updating..." : "Update Signal"}
        </button>
      </div>
    </>
  );
}
