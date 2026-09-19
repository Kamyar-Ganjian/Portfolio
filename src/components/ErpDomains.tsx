import Reveal from "@/components/Reveal";
import { profile } from "@/data/profile";
import {
  FiActivity,
  FiBriefcase,
  FiClock,
  FiDollarSign,
  FiPackage,
  FiShoppingCart,
  FiTruck,
  FiUsers,
} from "react-icons/fi";
import { FaSeedling } from "react-icons/fa";

const DOMAIN_ICONS = [
  FiActivity,
  FiBriefcase,
  FiTruck,
  FaSeedling,
  FiDollarSign,
  FiPackage,
  FiUsers,
  FiShoppingCart,
  FiClock,
];

export default function ErpDomains() {
  const domains = profile.experience[0].erpDomains;

  return (
    <section aria-label="ERP domains" className="py-12 md:py-16">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-8">
        <Reveal>
          <p className="mb-3 font-mono text-sm uppercase tracking-widest text-zinc-500">
            Nine business domains
          </p>
          <h3 className="text-xl font-semibold md:text-2xl">
            The 25 applications span a full enterprise ERP
          </h3>
        </Reveal>

        <Reveal delay={0.1}>
          <ul className="mt-8 grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-3 lg:grid-cols-9">
            {domains.map((domain, i) => {
              const Icon = DOMAIN_ICONS[i % DOMAIN_ICONS.length];
              return (
                <li
                  key={domain}
                  className="group flex flex-col items-center gap-2.5 bg-background px-3 py-5 text-center"
                >
                  <span className="text-zinc-500 transition-colors group-hover:text-accent">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-xs font-medium leading-snug text-zinc-400 transition-colors group-hover:text-zinc-200">
                    {domain}
                  </span>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}