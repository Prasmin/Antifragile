"use client";
import Prism from "@/components/Prism";

const HeroPage = () => {
  return (
    <section>
      <div className="relative w-full h-[200px] md:h-[900px]">
        <Prism
          animationType="rotate"
          timeScale={0.5}
          height={3.5}
          baseWidth={5.5}
          scale={3.6}
          hueShift={0}
          colorFrequency={1}
          noise={0}
          glow={1}
        />
      </div>
    </section>
  );
};

export default HeroPage;
