type Feature = {
  id: number;
  title: string;
  description: string;
  
}

const defaultFeatures: Feature[] = [
  {
    id: 1,
    title: "Journal Entries ",
    description: "Create and manage your journal entries with ease.",
  },
  {   id: 2,
    title: "AI-Powered Insights",
    description: "Get personalized insights and reflections based on your journal entries.",
  },
  {
    id: 3,
    title: "vianegativality Analysis    ",
    description: "Identify and analyze negative thought patterns to foster a more positive mindset.",
  },
]

const Featurespage = ( {features = defaultFeatures}: {features?: Feature[]}) => {
  return (
    <section className=" flex flex-column  px-4 pt-20 mx-auto max-w-7xl text-white">
      <div >
       <h1 className=" font-bold text-4xl ">How it works.</h1>
      </div>
      <div className="">
        {features.map((feature) => (
          <div key={feature.id}>
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
          </div>  
        ))}

      </div>
    </section>
  )
};

export default Featurespage;
