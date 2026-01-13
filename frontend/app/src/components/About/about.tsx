import Image from "next/image";

const About = () => {
  return (
   <section className="relative h-full w-full  ">

    <div className="h-40 min-h-7xl flex flex-col justify-center items-center space-y-4">
      <h1>Antifragile in Action</h1>
      <div className="rounded-full ">
        <Image src="/brain.jpg" alt="Brain" width={50} height={50} />
      </div>
      <div className="rounded-full border-2 shadow-lg ">Mind</div>
      <div className="rounded-full border-2 shadow-lg ">Mind</div>
      <div className="rounded-full border-2 shadow-lg ">Mind</div>
    </div>

   </section>
  );
};

export default About;
