"use client";

import { createContext, useContext, useState } from "react";

interface JournalContextValue {
  deletingEntryId: string | null;
  setDeletingEntryId: (id: string | null) => void;
}

const JournalContext = createContext<JournalContextValue | null>(null);

export function JournalProvider({ children }: { children: React.ReactNode }) {
  const [deletingEntryId, setDeletingEntryId] = useState<string | null>(null);

  return (
    <JournalContext.Provider value={{ deletingEntryId, setDeletingEntryId }}>
      {children}
    </JournalContext.Provider>
  );
}

export function useJournal() {
  const ctx = useContext(JournalContext);
  if (!ctx) {
    throw new Error("useJournal must be used within a JournalProvider");
  }
  return ctx;
}
