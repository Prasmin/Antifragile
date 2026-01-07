// import navbarItems from "./navbarItems";
import Image from "next/image";
import Link from "next/link";
import navbarItems from "./navbarItems";

const Navbar = () => {
  return (
    <>
      <nav>
        <div>
          <Image
            src="/zeimusu-Vitruvian-Man.svg"
            alt="logo"
            width={140}
            height={30}
          />
        </div>
        <div>
      <ul className="hidden md:flex gap-6 lg:gap-8">
        {
          navbarItems.map((item, index) => (
          <li key={index}>
            {item.path ? (
              <Link
                href={item.path}>
          
          </Link>)
                </li>
        ))}
      </ul>
        </div>
        <div>
          <Link href="/login">sign</Link>
          <Link href="/signup">up</Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
