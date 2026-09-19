"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import LogoImage from "@/components/LogoImage";
import Reveal from "@/components/Reveal";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";

const HIGHLIGHT_GROUPS = [
  {
    title: "Architecture Migration",
    items: [
      "Migrated the frontend from a monolithic application to a multi-zone, multi-repository architecture.",
      "Implemented reverse-proxy routing and shared infrastructure across multiple enterprise applications.",
      "Adopted vertical slice architecture to organize features around business capabilities.",
    ],
  },
  {
    title: "Scale",
    items: [
      "Developed and maintained 25 production applications using React, Next.js, and TypeScript.",
      "Built data-intensive enterprise interfaces — complex tables, forms, dashboards, charts, timelines, and printing workflows.",
    ],
  },
  {
    title: "Shared Infrastructure",
    items: [
      "Developed 6 shared internal NPM packages for reusable components, layouts, icons, utilities, and common functionality.",
      "Adopted across projects by 5 frontend developers.",
    ],
  },
  {
    title: "Industrial Integration",
    items: [
      "Integrated 10 industrial weighing systems with the ERP platform — device-specific protocols, encoding requirements, production connectivity.",
      "Spent 60 days on-site at industrial facilities, resolving production-critical hardware/software issues with minimal disruption.",
    ],
  },
  {
    title: "Real-Time Systems",
    items: [
      "Implemented real-time functionality using WebSockets and SignalR for live data synchronization across enterprise applications.",
    ],
  },
  {
    title: "Full Delivery Lifecycle",
    items: [
      "Contributed across Docker/Kubernetes deployments, CI/CD, Linux environments, production troubleshooting, and cross-team collaboration.",
    ],
  },
];

export default function Experience() {
  const exp = profile.experience[0];
  const [openGroup, setOpenGroup] = useState<number | null>(0);

  return (
    <section id="experience" className="relative py-24 md:py-32">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-8">
        <Reveal>
          <p className="mb-3 font-mono text-sm uppercase tracking-widest text-accent">
            02 / Experience
          </p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Professional experience
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-5 max-w-2xl leading-relaxed text-zinc-400">
            Since September 2024, I&apos;ve worked on enterprise ERP
            applications using React, Next.js, and TypeScript. My work spans
            application development, frontend architecture, shared packages,
            real-time functionality, and industrial integrations.
          </p>
        </Reveal>

        <div className="mt-12 border-t border-border">
          <Reveal>
            <div className="flex flex-col gap-4 py-8 md:flex-row md:items-start md:justify-between md:py-10">
              <div className="flex items-start gap-4">
                <LogoImage
                  src={profile.assets.companyLogo}
                  alt={`${exp.companyShort} logo`}
                  width={48}
                  height={48}
                  icon="building"
                  className="h-12 w-12 rounded border border-border bg-surface pt-1"
                />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    {exp.website ? (
                      <a
                        href={exp.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-semibold transition-colors hover:text-accent"
                      >
                        {exp.company}
                      </a>
                    ) : (
                      <span className="text-lg font-semibold">{exp.company}</span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-zinc-400">
                    Frontend Engineer · {exp.location}
                  </p>
                  <p className="mt-1 font-mono text-xs text-zinc-500">
                    Sep 2024 → Present
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {["25 production apps", "600–1,000 DAU", "9 ERP domains", "10 weighing systems", "60 days on-site"].map(
                  (chip) => (
                    <span
                      key={chip}
                      className="chip font-mono text-[11px]"
                    >
                      {chip}
                    </span>
                  )
                )}
              </div>
            </div>
          </Reveal>

          <div className="border-t border-border">
            <Reveal delay={0.08}>
              <ul>
                {HIGHLIGHT_GROUPS.map((group, i) => {
                  const isOpen = openGroup === i;
                  return (
                    <li
                      key={group.title}
                      className="border-b border-border last:border-b-0"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenGroup(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-surface-hover sm:px-5"
                      >
                        <span className="flex items-center gap-3">
                          <span className="font-mono text-xs text-zinc-500">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="font-medium">{group.title}</span>
                        </span>
                        <FiChevronDown
                          className={cn(
                            "h-4 w-4 text-zinc-500 transition-transform",
                            isOpen && "rotate-180"
                          )}
                        />
                      </button>
                      {isOpen && (
                        <div className="border-t border-border px-4 py-4 pl-10 sm:px-5 sm:pl-11">
                          <ul className="space-y-2.5">
                            {group.items.map((item) => (
                              <li
                                key={item}
                                className="text-sm leading-relaxed text-zinc-400"
                              >
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}