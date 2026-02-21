"use client";

// import React from "react";
// import { Radio, Zap, Trash2, ArrowDownCircle, ShieldCheck } from "lucide-react";

import { useCallback, useState } from "react";

import type { JSONContent } from "@tiptap/core";

import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { createJournalEntry } from "@/app/server/journal/journal_action";


// interface RefineryData {
//   stressor_summary: "You experienced multiple distractions during your work session.";
//   noise_detected: [
//     "Phone notifications",
//     "Loud construction outside",
//     "Unplanned meetings",
//   ];
//   signals: [
//     "Deep focus achieved after silencing phone",
//     "Productivity increased with noise-cancelling headphones",
//   ];
//   antifragile_step: "Schedule focused work blocks and use noise-cancelling tools.";
// }

// interface RefineryViewProps {
//   data: RefineryData;
// }

// const RefineryView: React.FC<RefineryViewProps> = ({ data }) => {
//   if (!data) return null;
//   // data matches the JSON output from our System Prompt
//   const { stressor_summary, noise_detected, signals, antifragile_step } = data;

//   return (
//     <div className="max-w-4xl mx-auto p-6 space-y-8 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
//       {/* Header: The Distillation Process */}
//       <div className="text-center space-y-2">
//         <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center justify-center gap-2">
//           <Radio className="text-blue-500 animate-pulse" /> The Harvest
//         </h2>
//         <p className="text-slate-500 text-sm italic">
//           &quot;{stressor_summary}&quot;
//         </p>
//       </div>

//       <div className="grid md:grid-cols-2 gap-6">
//         {/* Left Column: Noise (Muffled) */}
//         <div className="bg-white dark:bg-slate-800/50 p-5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 opacity-60 hover:opacity-100 transition-opacity">
//           <h3 className="flex items-center gap-2 text-slate-400 font-semibold mb-4 text-sm uppercase tracking-wider">
//             <Trash2 size={16} /> Noise Detected
//           </h3>
//           <ul className="space-y-3">
//             {noise_detected.map((noise, i) => (
//               <li
//                 key={i}
//                 className="text-slate-500 text-sm line-through decoration-slate-400/50"
//               >
//                 {noise}
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Right Column: Signals (Extracted) */}
//         <div className="bg-emerald-50/50 dark:bg-emerald-900/20 p-5 rounded-xl border border-emerald-100 dark:border-emerald-800 shadow-sm">
//           <h3 className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold mb-4 text-sm uppercase tracking-wider">
//             <Zap size={16} /> Extracted Signals
//           </h3>
//           <ul className="space-y-4">
//             {signals.map((signal, i) => (
//               <li
//                 key={i}
//                 className="flex gap-3 text-slate-800 dark:text-slate-200 text-sm font-medium"
//               >
//                 <span className="text-emerald-500">•</span>
//                 {signal}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>

//       {/* Downward Transition Icon */}
//       <div className="flex justify-center -my-4 relative z-10">
//         <ArrowDownCircle
//           className="bg-white dark:bg-slate-900 text-slate-300 dark:text-slate-700 rounded-full"
//           size={32}
//         />
//       </div>

//       {/* Bottom Section: The Antifragile Step */}
//       <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-[1px] rounded-xl shadow-lg shadow-orange-500/20">
//         <div className="bg-white dark:bg-slate-950 p-6 rounded-[11px] flex flex-col md:flex-row items-center gap-6">
//           <div className="p-4 bg-amber-100 dark:bg-amber-900/30 rounded-full">
//             <ShieldCheck
//               className="text-amber-600 dark:text-amber-400"
//               size={32}
//             />
//           </div>
//           <div className="space-y-1 text-center md:text-left">
//             <h4 className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500">
//               Antifragile Action
//             </h4>
//             <p className="text-lg font-semibold text-slate-900 dark:text-white">
//               {antifragile_step}
//             </p>
//           </div>
//           <button className="md:ml-auto px-6 py-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-lg font-bold hover:scale-105 transition-transform text-sm">
//             Execute Plan
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Test data for demonstration
// const testData: RefineryData = {
//   stressor_summary:
//     "You experienced multiple distractions during your work session.",
//   noise_detected: [
//     "Phone notifications",
//     "Loud construction outside",
//     "Unplanned meetings",
//   ],
//   signals: [
//     "Deep focus achieved after silencing phone",
//     "Productivity increased with noise-cancelling headphones",
//   ],
//   antifragile_step:
//     "Schedule focused work blocks and use noise-cancelling tools.",
// };

// export default function JournalPage() {
//   return <RefineryView data={testData} />;
// }

type EditorSnapshot = {
  json: JSONContent | null;
  text: string;
};

// const tiptapParsingExtensions = [
//   StarterKit.configure({
//     horizontalRule: false,
//     link: {
//       openOnClick: false,
//       enableClickSelection: true,
//     },
//   }),
//   TextAlign.configure({ types: ["heading", "paragraph"] }),
//   TaskList,
//   TaskItem.configure({ nested: true }),
//   Highlight.configure({ multicolor: true }),
//   Typography,
//   Superscript,
//   Subscript,
// ] as const;

// const serializeEditorContent = (html: string) =>
//   html.trim() ? generateJSON(html, tiptapParsingExtensions) : null;

export default function JournalPage() {
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snapshot, setSnapshot] = useState<EditorSnapshot>({
    json: null,
    text: "",
  });

  const handleEditorUpdate = useCallback((payload: EditorSnapshot) => {
    setSnapshot(payload);
  }, []);

  const handleOnSubmit = useCallback(async () => {
    const { json, text } = snapshot;
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      console.error("Title is required.");
      return;
    }

    if (!text || !json) {
      console.error("Content is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      await createJournalEntry({
        title: trimmedTitle,
        content: JSON.stringify(json),
      });

      console.log("Journal entry created");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }, [snapshot, title]);

  return (
    <div className="">
      <div className="max-w-4xl mx-auto flex flex-col justify-center gap-4 outline-1  sm:min-h-300 h-80 bg-white text-black p-6">
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Entry title"
          className="w-full rounded-md border border-slate-200 bg-transparent px-4 py-2 text-base text-black-800 focus:border-blue-500 focus:outline-none"
        />

        <SimpleEditor onUpdate={handleEditorUpdate} />
      </div>

      <div className="flex justify-center items-center mt-4 px-6 py-6">
        <button
          type="button"
          onClick={handleOnSubmit}
          disabled={isSubmitting}
          className="relative flex items-center justify-center gap-3 rounded-[14px] bg-gradient-to-r from-blue-600 to-cyan-600 w-50 h-23 px-6 py-3 text-base font-semibold text-white disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Generate Signal"}
        </button>
      </div>
    </div>
  );
}
