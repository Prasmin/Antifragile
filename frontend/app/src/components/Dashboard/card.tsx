import Link from "next/link";
import { ExternalLink } from "lucide-react";

interface DashboardCardProps {
  title: string;
  description: string;
  linkHref: string;
  linkText: string;
}

const DashboardCardProps: DashboardCardProps[] = [
  {
    title: "signal‑to‑noise analysis",
    description:
      "Transform setbacks into actionable intelligence with signal‑to‑noise analysis.",
    linkHref: "/dashboard/journal",
    linkText: "Open Signal",
  },
  {
    title: "Barbell Strategy Matrix",

    description:
      "Balance extreme safety and bold growth with a split‑interface planning tool.",
    linkHref: "/dashboard/barbell",
    linkText: "Explore Matrix",
  },
  {
    title: "Via Negativa Auditor",
    description:
      "Identify fragility points and simplify your life by removing unnecessary complexity.",
    linkHref: "/dashboard/vianegativa",
    linkText: "Run Auditor",
  },
];

interface DashboardCardComponentProps extends DashboardCardProps {
  gradient?: string;
  shadow?: string;
}

const defaultGradient = "from-red-600 to-cyan-600";
const defaultShadow = "shadow-blue-500/50";

export const DashboardCard = ({
  title,
  description,
  linkHref,
  linkText,
  gradient,
  shadow,
}: DashboardCardComponentProps) => (
  <article
    className={`rounded-2xl bg-gradient-to-r ${gradient || defaultGradient} p-[2px] shadow-lg ${shadow || defaultShadow} transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/60`}
  >
    <div className="rounded-2xl bg-white/5 p-6 h-full flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
        <p className="text-slate-300 mb-4">{description}</p>
      </div>
      <Link
        href={linkHref}
        className="inline-flex justify-around gap-5 text-white cursor-pointer rounded-md bg-secondary/20 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/30 mt-4"
      >
        {linkText}
        <ExternalLink size={18} className="text-primary font-semibold text-white " />
      </Link>
    </div>
  </article>
);

export const DashboardCardList = () => (
  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
    {DashboardCardProps.map((card) => (
      <DashboardCard
        key={card.title}
        {...card}
        gradient={defaultGradient}
        shadow={defaultShadow}
      />
    ))}
  </div>
);
