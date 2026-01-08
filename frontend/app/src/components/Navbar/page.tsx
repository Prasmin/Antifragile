import Image from "next/image";
import Link from "next/link";
import navbarItems from "./navbarItems";

const Navbar = () => {
  return (
    <>
      <nav>
        <div className="absolute absolute flex justify-between max-w-7xl inset-x-0 mx-auto">
          <div>
            <Image
              src="/zeimusu-Vitruvian-Man.svg"
              alt="logo"
              width={140}
              height={30}
            />
          </div>
          <div className="flex items-center justify-center">
            <div>
              <ul
                className="hidden md:flex gap-6 lg:gap-8"
                aria-label="Main navigation"
              >
                {navbarItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      className="hover:underline focus:underline transition-colors duration-150 flex space-x-4 items-center"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className=" space-x-4">
              <Link href="/login">Sign up</Link>
              <Link href="/signup">Sign in</Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
