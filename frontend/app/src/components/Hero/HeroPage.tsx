"use client";
import Prism from "@/components/Prism";
import RotatingText from "../RotatingText";

const HeroPage = () => {
  return (
    <div>
      <div className="absolute w-full h-screen inset-0 -z-10 ">
        <Prism
          animationType="rotate"
          timeScale={0.5}
          height={3.5}
          baseWidth={5.5}
          hueShift={0}
          colorFrequency={1}
          noise={0}
          glow={0.3}
        />
      </div>
      <h1 className=" flex justify-center font-bold sm:text-4xl text-gray-300  space-x-2 mt-20 sm:mt-32  ">
        Return Home for
        <RotatingText
          texts={["Clear", "Calm", "Grounded", "Aligned", "Steady"]}
          mainClassName="px-2 mx-2 sm:px-2 md:px-3 bg-indigo-500 text-white rounded-lg"
          staggerFrom="last"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-120%" }}
          staggerDuration={0.025}
          splitLevelClassName="overflow-hidden"
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
          rotationInterval={3000}
        />
        Thinking
      </h1>
    </div>
  );
};

export default HeroPage;
