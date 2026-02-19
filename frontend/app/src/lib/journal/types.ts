export type JournalEntryRecord = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type JournalEntryInput = {
  title: string;
  content: string;
};

export type JournalEntryUpdateInput = Partial<JournalEntryInput>;
