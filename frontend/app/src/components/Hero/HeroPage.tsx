"use client";

import RotatingText from "../RotatingText";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Prism from "../Prism";

const HeroPage = () => {
   const [locked, setLocked] = useState(true);
  return (
   
      
      <section className="relative z-10 py-[120px]">

      
      <h1 className="flex justify-center min-w-[140px] text-center font-bold sm:text-4xl text-gray-300  space-x-2 mt-40 sm:mt-30  ">
        Return Home for
        <RotatingText
          texts={["Clear", "Calm", "Steady"]}
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
      <div className="flex justify-center items-center  mt-4">
  <Link
    onClick={() => setLocked((prev) => !prev)}
    href="/signin"
    className="flex items-center gap-2 sm:max-w-34 text-left max-w-24 py-2 sm:px-4 pl-2 bg-indigo-500 hover:bg-indigo-600 shadow-lg shadow-indigo-500/50 cursor-pointer text-nowrap text-white shadow-xl text-shadow-lg/30 sm:rounded-full rounded-lg"
  >
    Enter
  {locked ? (
    <Image src="/lock.svg" alt="lock" width={20} height={20} />
  ) : (
    <Image src="/unlock.svg" alt="unlock" width={20} height={20} />
  )}
  </Link>
</div>
<div className="absolute -top-30 inset-0 -z-10 ">
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
    </section>
    
    
  );
};

export default HeroPage;
