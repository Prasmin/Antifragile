interface PricingCardProps {
  title: string;
  price: string;
  description?: string;
  features: string[];
  ctaText?: string;
  highlighted?: boolean;
}

const PricingCard = ({
  title,
  price,
  description,
  features,
  ctaText = "Get Started",
  highlighted = false,
}: PricingCardProps) => {
  return (
    <div
      className={`rounded-2xl border p-6 shadow-sm transition hover:shadow-md
        ${highlighted ? "border-black bg-neutral-50 scale-[1.02]" : "border-neutral-200"}
      `}
    >
      {highlighted && (
        <span className="mb-3 inline-block rounded-full bg-black px-3 py-1 text-xs text-white">
          Most Popular
        </span>
      )}

      <h2 className="text-xl font-semibold text-black">{title}</h2>

      {description && (
        <p className="mt-1 text-sm text-black">{description}</p>
      )}

      <p className="mt-4 text-3xl text-black font-bold">{price}</p>

      <ul className="mt-6 space-y-3 text-sm">
        {features.map((feature, index) => (
          <li key={index} className="flex text-black items-start gap-2">
            <span className="mt-1 text-black">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        className={`mt-6 w-full rounded-xl px-4 py-2 text-sm font-medium
          ${highlighted
            ? "bg-black text-white hover:bg-neutral-800"
            : "border border-neutral-300 hover:bg-neutral-100"}
        `}
      >
        {ctaText}
      </button>
    </div>
  );
};

export default PricingCard;
