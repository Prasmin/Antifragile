"use client";
import TrueFocus from "../TrueFocus";

type Feature = {
  id: number;
  title: string;
  description: string;
  
}

const defaultFeatures: Feature[] = [
  {
    id: 1,
    title: "Journal Entries ",
    description: "Create and manage your journal entries with ease.",
  },
  {   id: 2,
    title: "AI-Powered Insights",
    description: "Get personalized insights and reflections based on your journal entries.",
  },
  {
    id: 3,
    title: "vianegativality Analysis    ",
    description: "Identify and analyze negative thought patterns to foster a more positive mindset.",
  },
]

const Featurespage = ( ) => {
  return (
    <section className="text-white flex flex-col gap-8 max-w-4xl mx-auto ">
<div>
      <h1 className="text-4xl font-bold mb-4 ">How it works.</h1>
      <div className="border border-white/10 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-8 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:shadow-blue-500/20">

      <TrueFocus 
sentence="Focus Clarity"
manualMode={false}
blurAmount={5}
borderColor="#5227FF"
animationDuration={0.5}
pauseBetweenAnimations={1}
/>
<span className="text-lg text-white/70 mt-4 block">
Experience the power of Journal, a unique feature that helps you identify and analyze negative thought patterns in your journal entries.Journaling encourages you to concentrate on specific thoughts, fostering a more positive mindset and promoting self-awareness.
</span>
      </div>
      <div className="border border-white/10 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-8 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:shadow-blue-500/20">
      <p className="text-bold text-3xl">AI-Powered Insights </p>
      <span className="text-lg text-white/70 mt-4 block">
Get personalized insights and reflections based on your journal entries.
</span>
      </div>
</div>


    </section>
  )
};

export default Featurespage;
