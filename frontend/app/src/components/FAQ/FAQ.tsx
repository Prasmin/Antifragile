"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type FAQItem = {
  question: string;
  answer: string;
};

const faqs: FAQItem[] = [
  {
    question: "What is the purpose of this platform?",
    answer:
      "Our platform is designed to help users understand and improve their mental landscape through journaling, AI-powered insights, and analysis of thought patterns. It's a space for reflection and growth.",
  },
  {
    question: "How do the AI-powered insights work?",
    answer:
      "The AI analyzes your journal entries to identify recurring themes, emotional tones, and cognitive patterns. It then provides personalized reflections and prompts to help you gain deeper self-awareness without being prescriptive.",
  },
  {
    question: "Is my journal data private and secure?",
    answer:
      "Absolutely. Your privacy is our top priority. All journal entries are end-to-end encrypted, meaning only you can read them. We cannot access your content, and we will never share your data with third parties.",
  },
  
  {
    question: "What is 'Vianegativa Analysis'?",
    answer:
      "Vianegativa is a mental model about focusing on what to avoid. Our analysis helps you identify and understand your own negative thought patterns or cognitive distortions, not to judge them, but to build resilience and a more robust mental framework.",
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="relative text-white sm:max-w-6xl mx-auto px-4 py-24 justify-center">
      <div className="pointer-events-none absolute -bottom-40 right-0 h-[420px] w-[620px] -translate-x-1/3 rounded-full bg-indigo-600/15 blur-[150px]" />

      <div className="relative text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-lg text-white/60 max-w-2xl mx-auto">
          Have questions? We have answers. Here are some of the most common
          inquiries we receive.
        </p>
      </div>

      <div className="max-w-3xl mx-auto cursor-pointer">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-white/10 last:border-b-0">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center text-left py-6"
            >
              <span className="text-lg font-medium">{faq.question}</span>
              <ChevronDown
                className={cn("size-5 transition-transform duration-300", {
                  "transform rotate-180": activeIndex === index,
                })}
              />
            </button>
            <div
              className={cn(
                "grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-in-out",
                {
                  "grid-rows-[1fr]": activeIndex === index,
                },
              )}
            >
              <div className="overflow-hidden">
                <p className="pb-6 text-white/70">{faq.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
