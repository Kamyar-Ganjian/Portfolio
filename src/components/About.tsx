import Reveal from "@/components/Reveal";
import { profile } from "@/data/profile";

export default function About() {
  return (
    <section id="about" className="relative border-t border-border py-24 md:py-32">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 md:px-8 lg:grid-cols-[auto_1fr] lg:gap-20">
        <Reveal>
          <p className="sticky top-28 font-mono text-sm uppercase tracking-widest text-accent">
            01 / About
          </p>
        </Reveal>

        <div className="max-w-2xl">
          <Reveal>
            <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
              About me
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-6 text-lg leading-relaxed text-zinc-400">
              I&apos;m a Frontend Engineer with 2 years of experience building
              production applications with React, Next.js, and TypeScript.
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <p className="mt-4 text-lg leading-relaxed text-zinc-400">
              At MAM, I work across a large enterprise ERP environment,
              developing and maintaining applications for production,
              logistics, farming, finance, procurement, HR, commerce, and other
              business operations.
            </p>
          </Reveal>

          <Reveal delay={0.26}>
            <p className="mt-4 text-lg leading-relaxed text-zinc-400">
              My work includes frontend architecture, shared infrastructure,
              real-time functionality, data-intensive interfaces, and
              integrations with industrial weighing systems.
            </p>
          </Reveal>

          <Reveal delay={0.34}>
            <p className="mt-4 text-lg leading-relaxed text-zinc-400">
              I&apos;m currently pursuing a Master&apos;s degree in Artificial
              Intelligence Engineering and exploring the intersection of
              frontend development and AI.
            </p>
          </Reveal>

          <Reveal delay={0.42}>
            <div className="mt-10 overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <tbody>
                  {[
                    ["Focus", "React · Next.js · TypeScript"],
                    ["Experience", "2 years — enterprise software"],
                    ["Current study", "Artificial Intelligence — M.Sc."],
                    ["Relocation", profile.personal.relocationDestination ? `Open to ${profile.personal.relocationDestination}` : "Open to relocation"],
                  ].map(([k, v]) => (
                    <tr key={k} className="border-b border-zinc-800/60">
                      <th
                        scope="row"
                        className="py-3 pr-6 text-left font-mono text-xs uppercase tracking-wider text-zinc-500"
                      >
                        {k}
                      </th>
                      <td className="py-3 text-zinc-300">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}