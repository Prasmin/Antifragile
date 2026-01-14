import PricingCard from "@/components/Pricing/PricingCard";
import { PRICING_PLANS } from "@/lib/pricing";

const PricingSection = () => {
  return (
    <section className="grid gap-6 md:grid-cols-3 sm:mt-45 mt-20 px-4 ">
      {PRICING_PLANS.map((plan) => (
        <PricingCard
          key={plan.id}
          title={plan.title}
          price={plan.price}
          description={plan.description}
          features={plan.features}
          ctaText={plan.cta}
          highlighted={plan.highlighted}
        />
      ))}
    </section>
  );
};

export default PricingSection;
