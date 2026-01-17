"use client";

import Image from "next/image";
import Link from "next/link";
import navbarItems from "./navbarItems";
import { useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const onToggle = () => {
    setOpen(!open);
  };
  return (
    <>
      <header className="fixed z-20 w-full ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className=" sm:mt-6 bg-white/20 backdrop-blur-sm rounded-lg  shadow-xl/20 border mt-4 border-white/10">
            <nav className=" flex justify-between items-center  mx-2 py-4 lg:px-8 ">
              <div className=" bg-white/80 rounded-full  ">
                <Link href="/">
                  <Image
                    src="/logo.svg"
                    alt="Zeimus Vitruvian Man"
                    width={60}
                    height={60}
                    quality={75}
                  />
                </Link>
              </div>

              <div className="hidden sm:block">
                {navbarItems.map((item) => (
                  <Link href={item.path} key={item.id} className="mx-4">
                    {item.title}
                  </Link>
                ))}
              </div>
              <Link
                href="/google-login"
                className="bg-indigo-500 hover:bg-indigo-600 shadow-lg shadow-indigo-500/50 cursor-pointer rounded-full px-4 py-2 text-white shadow-xl text-shadow-lg/30 sm:block hidden"
              >
                Sign Up
              </Link>

              <div className="lg:hidden">
                <button
                  type="button"
                  aria-label="Mobile Menu"
                  onClick={onToggle}
                >
                  <Image
                    className="text-white"
                    src={open ? "/close.svg" : "/hamburger.svg"}
                    alt="Menu Icon"
                    width={30}
                    height={30}
                    quality={75}
                  />
                </button>
              </div>
            </nav>
            <div>
              {open && (
                <>
                  <div className="flex flex-col sm:hidden min-h-screen bg-white/20 backdrop-blur-sm rounded-b-lg border-t border-white/10  ">
                    <div>
                      {navbarItems.map((item) => (
                        <Link
                          href={item.path}
                          key={item.id}
                          className="flex flex-col mt-6 mx-2"
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                    <div
                      className="bg-indigo-500 hover:bg-indigo-600 shadow-lg shadow-indigo-500/50 cursor-pointer rounded-full px-4 py-2 text-white shadow-xl text-shadow-lg/30 mt-5"
                      
                    >
                      Sign In
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
