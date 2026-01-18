import type { Metadata } from "next";
import { EB_Garamond, Geist_Mono } from "next/font/google";


import Navbar from "@/components/Navbar/page";

import Footer from "@/components/footer";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistMono.variable} ${EBGaramondSerif.variable}  antialiased bg-background  `}
      >
        
       
       {children}

        
      
      </body>
    </html>
  );
}
