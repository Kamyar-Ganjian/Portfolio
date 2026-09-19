import LogoImage from "@/components/LogoImage";
import Reveal from "@/components/Reveal";
import { profile } from "@/data/profile";

export default function Education() {
  const education = profile.education;
  const university = education[0].institution;

  return (
    <section id="education" className="relative border-t border-border py-24 md:py-32">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 md:px-8 lg:grid-cols-[auto_1fr] lg:gap-20">
        <Reveal>
          <p className="sticky top-28 font-mono text-sm uppercase tracking-widest text-accent">
            05 / Education
          </p>
        </Reveal>

        <div>
          <Reveal>
            <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
              Education
            </h2>
          </Reveal>

          <div className="mt-10 divide-y divide-border border-t border-border">
            {education.map((entry, i) => (
              <Reveal key={entry.degree} delay={0.08 * i}>
                <div className="flex gap-4 py-6">
                  <LogoImage
                    src={entry.logo}
                    alt={`${university} logo`}
                    width={44}
                    height={44}
                    icon="graduation"
                    className="mt-1 h-11 w-11 shrink-0 rounded border border-border bg-surface"
                  />
                  <div>
                    <h3 className="font-semibold">{entry.degree}</h3>
                    <p className="mt-1 text-sm text-zinc-400">
                      {entry.startYear} – {entry.endYear}
                    </p>
                    <p className="mt-2 text-sm text-zinc-400">
                      {entry.website ? (
                        <a
                          href={entry.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-medium text-accent transition-colors hover:text-accent-dim"
                        >
                          {entry.institution}
                          <span className="text-xs">↗</span>
                        </a>
                      ) : (
                        entry.institution
                      )}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}