import type { Metadata } from "next";
import { EB_Garamond, Geist_Mono } from "next/font/google";
import "../../app/globals.css";

import { AppSidebar } from "@/components/ui/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { createClient } from "@/lib/supabase/server";
import { TooltipProvider } from "@/components/ui/tooltip";
import { JournalProvider } from "@/context/journal-context";

const EBGaramondSerif = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Antifragile — Learn Better, Think Deeper, Grow Stronger ",
  description:
    "A learning and reflection platform designed to cultivate clarity, resilience, and antifragile thinking in an uncertain world. Antifragile helps curious people develop real-world skills — like decision-making, communication, and self-regulation — by learning from daily experience, not endless content",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let journalTitle = "Journal";
  let journalEntries: { id: string; title: string }[] = [];
  if (user) {
    const { data: entries } = await supabase
      .from("journal_entries")
      .select("id,title")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (entries?.length) {
      journalEntries = entries.map((entry) => ({
        id: String(entry.id),
        title: entry.title ?? "",
      }));
      journalTitle = entries[0]?.title?.trim() || journalTitle;
    }
  }

  return (
    <html lang="en">
      <body
        className={`${geistMono.variable} ${EBGaramondSerif.variable} antialiased  min-h-screen flex flex-col `}
      >
        <JournalProvider>
          <SidebarProvider className="flex-1" defaultOpen>
            <AppSidebar
              user={user}
              title={journalTitle}
              journalEntries={journalEntries}
            />
            <SidebarInset>
              <div className="flex flex-1 flex-col">
                <div className="border-b border-white/10 px-4 py-3 md:hidden">
                  <SidebarTrigger className="text-black" />
                </div>
                <main className="flex-1 px-4 py-6 lg:px-8">
                  <section className="mt-8">
                    <TooltipProvider>{children}</TooltipProvider>
                  </section>
                </main>
              </div>
            </SidebarInset>
          </SidebarProvider>
        </JournalProvider>
      </body>
    </html>
  );
}
