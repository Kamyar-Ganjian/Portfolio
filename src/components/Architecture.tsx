import Reveal from "@/components/Reveal";
import { profile } from "@/data/profile";

function ArchitectureFlow() {
  const steps = profile.architecture.steps;

  return (
    <ol className="divide-y divide-border border-t border-border">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        return (
          <li
            key={step}
            className="grid grid-cols-[3rem_1fr] items-baseline gap-4 py-4"
          >
            <span
              className={
                isLast ? "font-mono text-xs text-accent" : "font-mono text-xs text-zinc-500"
              }
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              className={
                isLast ? "text-sm font-medium text-foreground" : "text-sm font-medium text-zinc-300"
              }
            >
              {step}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export default function Architecture() {
  return (
    <section id="architecture" className="relative border-y border-border py-24 md:py-32">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-8">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <p className="mb-3 font-mono text-sm uppercase tracking-widest text-accent">
                03 / Architecture
              </p>
              <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
                From monolithic frontend to multi-zone architecture
              </h2>
            </Reveal>

            <Reveal delay={0.08}>
              <p className="mt-6 leading-relaxed text-zinc-400">
                I worked on migrating the frontend from a monolithic
                application to a multi-zone, multi-repository architecture. The
                migration included reverse-proxy routing, shared
                infrastructure, and a vertical slice approach for organizing
                features around business capabilities.
              </p>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-4 leading-relaxed text-zinc-400">
                The resulting architecture supports multiple independent
                enterprise applications while sharing common frontend
                infrastructure.
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-8 flex flex-wrap gap-3">
                {["Reverse-proxy routing", "Vertical slice features", "Shared infrastructure", "Independent deploys"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="chip chip-hover font-mono text-xs"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="lg:pt-4">
            <ArchitectureFlow />
          </Reveal>
        </div>
      </div>
    </section>
  );
}