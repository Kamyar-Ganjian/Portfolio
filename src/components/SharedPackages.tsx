"use client";

import { FiBox, FiLayout, FiLayers, FiTerminal, FiTool, FiZap } from "react-icons/fi";
import Reveal from "@/components/Reveal";
import { profile } from "@/data/profile";

const PACKAGE_ICONS = [FiBox, FiLayout, FiLayers, FiTerminal, FiTool, FiZap];

export default function SharedPackages() {
  const packages = profile.sharedPackages;
  const devs = (
    profile.metrics.groups as unknown as Array<{
      metrics: Array<{ value: number; label: string }>;
    }>
  )
    .flatMap((g) => g.metrics)
    .find((m) => m.label === "Frontend Developers");

  return (
    <section className="border-t border-zinc-800/70 py-12 md:py-16">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <Reveal>
              <p className="mb-3 font-mono text-sm uppercase tracking-widest text-zinc-500">
                Shared frontend infrastructure
              </p>
              <h3 className="text-xl font-semibold md:text-2xl">
                Shared frontend packages
              </h3>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-4 max-w-md leading-relaxed text-zinc-400">
                I developed 6 internal NPM packages containing reusable
                components, layouts, icons, utilities, and common
                functionality. These packages are shared across projects and
                used by a team of 5 frontend developers.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="overflow-hidden border border-border bg-surface">
              <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
                <span className="font-mono text-xs text-zinc-500">
                  @mam/ui · shared packages
                </span>
                <span className="rounded border border-border bg-muted px-2 py-0.5 font-mono text-[11px] text-zinc-500">
                  {devs?.value ?? 5} engineers
                </span>
              </div>
              <ul className="divide-y divide-border">
                {packages.map((pkg, i) => {
                  const Icon = PACKAGE_ICONS[i % PACKAGE_ICONS.length];
                  return (
                    <li
                      key={pkg}
                      className="flex items-center gap-3 px-5 py-3"
                    >
                      <span className="text-zinc-500">
                        <Icon className="h-4 w-4" />
                      </span>
                      <p className="flex-1 text-sm font-medium text-zinc-200">
                        {pkg}
                      </p>
                      <p className="font-mono text-[11px] text-zinc-500">
                        @mam/{pkg.toLowerCase().replace(/[^a-z]/g, "-")}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}