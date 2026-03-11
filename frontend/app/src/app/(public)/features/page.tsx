import Image from "next/image";

export default function FeaturesPage() {
  return (
    <section className="relative sm:mt-40 mt-35 mx-3 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tighter text-white sm:text-5xl md:text-6xl">
              Daily Field Report
            </h1>
            <p className="text-xl text-white">
              Review today&apos;s experiments, open loops, and antifragile reps.
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <span className="text-2xl">🔬</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Track Experiments</h3>
                  <p className="text-white">
                    Log your daily experiments and see what works.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <span className="text-2xl">🔄</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Manage Open Loops</h3>
                  <p className="text-white">
                    Keep track of your open tasks and ideas.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <span className="text-2xl">💪</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Build Resilience</h3>
                  <p className="text-white">
                    Develop antifragility through consistent practice.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Image
              src="/antifragile.png"
              alt="Dashboard Preview"
              width={1200}
              height={800}
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
