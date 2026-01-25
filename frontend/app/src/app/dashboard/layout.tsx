import type { Metadata } from "next";
import { EB_Garamond, Geist_Mono } from "next/font/google";
import "../../app/globals.css";
import { redirect } from "next/dist/client/components/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import DasNav from "@/components/DashboardNav/dasNav";




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

  const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
  
    // Protect route – redirect unauthenticated users to login
    if (!user) {
      redirect("/login");
    }
  return (
    <html lang="en">
      <body
        className={`${geistMono.variable} ${EBGaramondSerif.variable} antialiased bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen `}
      >
      
      
       <DasNav />
       <main>{children}</main>

       
      
      </body>
    </html>
  );
}
