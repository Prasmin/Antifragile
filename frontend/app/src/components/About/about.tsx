import Image from "next/image";

const About = () => {
  return (
    <div className="relative top-20 min-h-screen">
      <h1>Antifragile in Action</h1>
      <div className="rounded-full ">
        <Image src="/brain.jpg" alt="Brain" width={50} height={50} />
      </div>
      <div className="rounded-full border-2 shadow-lg ">Mind</div>
      <div className="rounded-full border-2 shadow-lg ">Mind</div>
      <div className="rounded-full border-2 shadow-lg ">Mind</div>
    </div>
  );
};

export default About;
