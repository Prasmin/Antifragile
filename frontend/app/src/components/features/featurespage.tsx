"use client";
import {
  BotMessageSquare,
  BrainCircuit,
  FileText,
  Waypoints,
} from "lucide-react";
import TrueFocus from "../TrueFocus";

type Feature = {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
};

const defaultFeatures: Feature[] = [
  {
    id: 1,
    title: "Journal Entries ",
    description: "Create and manage your journal entries with ease.",
    icon: <FileText />,
  },
  {
    id: 2,
    title: "AI-Powered Insights",
    description:
      "Get personalized insights and reflections based on your journal entries.",
    icon: <BotMessageSquare />,
  },
  {
    id: 3,
    title: "Vianegativa Analysis",
    description:
      "Identify and analyze negative thought patterns to foster a more positive mindset.",
    icon: <BrainCircuit />,
  },
  {
    id: 4,
    title: "Mindful Waypoints",
    description:
      "Navigate your thoughts with precision, marking and revisiting key mental landmarks.",
    icon: <Waypoints />,
  },
];

const Featurespage = () => {
  return (
    <section className="text-white sm:max-w-6xl mx-auto px-4 py-16 justify-center ">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">How It Works</h1>
        <p className="text-lg text-white/70 max-w-2xl mx-auto">
          Our platform provides you with the tools to understand and improve
          your mental landscape. Here’s a glimpse into our core features.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {defaultFeatures.map((feature, index) => (
          <div
            key={feature.id}
            className={`border border-white/10 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-8 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:shadow-blue-500/20 rounded-lg
              ${
                index === 0
                  ? "col-span-1 lg:col-span-1 lg:row-span-2"
                  : ""
              }`}
          >
            {index === 0 ? (
              <>
                <TrueFocus
                  sentence="Focus Clarity"
                  manualMode={false}
                  blurAmount={5}
                  borderColor="#5227FF"
                  animationDuration={0.5}
                  pauseBetweenAnimations={1}
                />
                <span className="text-lg text-white/70 mt-4 block">
                  Experience the power of Journal, a unique feature that helps
                  you identify and analyze negative thought patterns in your
                  journal entries. Journaling encourages you to concentrate on
                  specific thoughts, fostering a more positive mindset and
                  promoting self-awareness.
                </span>
              </>
            ) : (
              <div className="flex flex-col h-full">
                <div className="text-blue-500 mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                <p className="text-white/70 flex-grow">
                  {feature.description}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Featurespage;
