"use client";

import AnimatedMetric from "@/components/AnimatedMetric";
import Reveal from "@/components/Reveal";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";

export default function Metrics() {
  return (
    <section
      aria-labelledby="metrics-heading"
      className="relative border-y border-border"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-16 md:px-8 md:py-24">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-accent/60" aria-hidden="true" />
            <p id="metrics-heading" className="label">
              {profile.metrics.eyebrow}
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid divide-y divide-border md:mt-16 lg:grid-cols-3 lg:divide-y-0 lg:divide-x">
            {profile.metrics.groups.map((group, gi) => (
              <Reveal
                key={group.id}
                delay={0.08}
                className="lg:px-8 lg:first:pl-0 lg:last:pr-0"
              >
                <div className="flex items-baseline gap-3">
                  <span
                    className={cn(
                      "label",
                      group.accent && "text-accent"
                    )}
                  >
                    {String(gi + 1).padStart(2, "0")} · {group.title}
                  </span>
                </div>

                <div className="mt-5 divide-y divide-border border-t border-border">
                  {group.metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="pt-6 pb-7"
                    >
                      <AnimatedMetric
                        value={metric.value}
                        label={metric.label}
                        description={metric.description}
                        prefix={metric.prefix}
                        suffix={metric.suffix}
                        range={metric.range}
                        accent={group.accent}
                      />
                    </div>
                  ))}
                </div>

                <p
                  className={cn(
                    "mt-6 flex items-center gap-2 font-mono text-[11px]",
                    group.accent ? "text-accent/90" : "text-zinc-500"
                  )}
                >
                  <span
                    className="h-px w-4 bg-current opacity-40"
                    aria-hidden="true"
                  />
                  {group.footnote}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
    </section>
  );
}