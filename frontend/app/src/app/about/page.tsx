import Image from "next/image";

const AboutPage = () => {
  return (
    <>
      <section className="relative sm:mt-40 mt-35 mx-3 min-h-screen ">
        <div className="flex flex-col space-y-4  items-center">
          <div>
            <h2 className="text-3xl font-bold">About Antifragile App </h2>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between my-2 items-center gap-2 ">
            <div className="flex-1">
              <h3 className="sm:text-2xl text-lg ">
                Antifragile is a platform focused on building systems that get
                better when things go wrong. Instead of chasing stability in an
                unstable world, we embrace change, feedback, and small failures.
                Our approach combines modern software engineering,
                experimentation, and adaptive design to help products evolve
                faster and stronger over time. Antifragile isn’t about avoiding
                stress—it’s about using it.
              </h3>
            </div>
            <div>
              <Image
                className="rounded-xl"
                src="/aboutus.jpg"
                alt="About Us"
                width={500}
                height={300}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
