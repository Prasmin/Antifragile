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

  return (
    <html lang="en">
      <body
        className={`${geistMono.variable} ${EBGaramondSerif.variable} antialiased bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen flex flex-col `}
      >
        <SidebarProvider className="flex-1" defaultOpen>
          <AppSidebar user={user} />
          <SidebarInset className="bg-transparent">
            <div className="flex flex-1 flex-col">
              <div className="border-b border-white/10 px-4 py-3 md:hidden">
                <SidebarTrigger className="text-white" />
              </div>
              <main className="flex-1 px-4 py-6 lg:px-8">
                
                <section className="mt-8">
                  <TooltipProvider>{children}</TooltipProvider>
                  </section>
              </main>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
