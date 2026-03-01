"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { JSONContent } from "@tiptap/core";

import {
  createJournalEntry,
  deleteJournalEntry,
} from "@/app/server/journal/journal_action";

const EMPTY_NOTE_CONTENT: JSONContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [],
    },
  ],
};

const DEFAULT_TITLE = "Untitled Entry";

type JournalDetailActionsProps = {
  currentEntryId: string;
};

export function JournalDetailActions({
  currentEntryId,
}: JournalDetailActionsProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleCreate = useCallback(() => {
    setError(null);
    startTransition(async () => {
      try {
        const entry = await createJournalEntry({
          title: DEFAULT_TITLE,
          content: JSON.stringify(EMPTY_NOTE_CONTENT),
        });

        router.push(`/dashboard/journal/${entry.id}`);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to create a new journal entry",
        );
      }
    });
  }, [router]);

  const handleDelete = useCallback(() => {
    const confirmed = window.confirm(
      "This will permanently delete the journal entry. Continue?",
    );

    if (!confirmed) {
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        await deleteJournalEntry(currentEntryId);
        router.push("/dashboard/journal");
        router.refresh();
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to delete the journal entry",
        );
      }
    });
  }, [currentEntryId, router]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <button
          type="button"
          onClick={handleCreate}
          disabled={isPending}
          className="gap-3 rounded-[14px] bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 text-base font-semibold text-white disabled:opacity-60 cursor-pointer"
        >
          {isPending ? "Working..." : "New Note"}
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="gap-3 rounded-[14px] bg-red-600 px-6 py-3 text-base font-semibold text-white disabled:opacity-60 cursor-pointer"
        >
          Delete
        </button>
      </div>
      {error ? (
        <p className="text-sm text-red-600" aria-live="polite">
          {error}
        </p>
      ) : null}
    </div>
  );
}
