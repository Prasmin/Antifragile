"use client";

import RotatingText from "../RotatingText";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Prism from "../Prism";

const HeroPage = () => {
  const [locked, setLocked] = useState(true);
  return (
    <>
    
    
      <div className="absolute h-[90vh] overflow-hidden  inset-0 -z-10 ">
        <Prism
          animationType="rotate"
          timeScale={0.5}
          scale={2.5}
          height={4.0}
          baseWidth={3.2}
          hueShift={0}
          colorFrequency={1}
          noise={0}
          glow={0.3}
        />
      </div>
     
    <div className="min-h-[700px] z-10 sm:mt-[250px] mt-[350px]">
      <h1 className="flex justify-center sm:text-4xl text-xl min-w-[140px] text-center font-bold text-white   space-x-2   ">
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
          className="flex items-center gap-2 sm:max-w-34 text-left max-w-24 py-4 sm:px-6 pl-2 bg-indigo-500 hover:bg-indigo-600 shadow-lg shadow-indigo-500/50 cursor-pointer text-nowrap text-white shadow-xl text-shadow-lg/30 sm:rounded-full rounded-lg"
        >
          Enter
          {locked ? (
            <Image src="/lock.svg" alt="lock" width={20} height={20} />
          ) : (
            <Image src="/unlock.svg" alt="unlock" width={20} height={20} />
          )}
        </Link>
      </div>
      
    </div>

    </>
  );
};

export default HeroPage;
