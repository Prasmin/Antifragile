import Image from "next/image";

const Footer = () => {
  return(

    <>
    <footer className="relative bottom-0 inset-0 border-t w-full">
      <div className="flex justify-between max-w-5xl mx-auto items-center p-4  border-gray-300">

      
      <div className="">
        <p>copyright 2026 created by Prashmin </p>
      </div>
      <div className="">
        <Image src="/youtube.svg" width={24} height={24} alt="YouTube" />
        <Image src="/instagram.svg" width={24} height={24} alt="Instagram" className="text-white  "/>
      </div>
      </div>
    </footer>
    </>

  ) ;
}

export default Footer;