
"use client";


import type { ReactNode } from "react";

type AuthDemoPageProps = {
  
  intro: string;
  steps: string[];
  children: ReactNode;
};

export function AuthDemoPage({
  
  intro,
  steps,
  children,
}: AuthDemoPageProps) {
  return (
    <div className="flex min-h-screen mt-34 flex-col bg-gradient-to-br from-[#02050b] via-[#050c1d] to-[#071426] text-slate-100">
      <header className="border-b border-white/10 bg-slate-950/40 backdrop-blur">
        
      </header>

      <main className="mx-auto w-full max-w-5xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-[0_25px_70px_rgba(2,6,23,0.65)] backdrop-blur">
            <p className="text-lg font-medium text-white/90">{intro}</p>
            <ol className="mt-5 list-decimal space-y-2 pl-5 text-sm text-slate-300">
              {steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>
          <div className="flex flex-col gap-6">{children}</div>
        </div>
      </main>
    </div>
  );
}
