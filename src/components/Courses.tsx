import { FiArrowUpRight } from "react-icons/fi";
import LogoImage from "@/components/LogoImage";
import Reveal from "@/components/Reveal";
import { profile } from "@/data/profile";

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Courses() {
  const courses = profile.courses;

  return (
    <section className="border-t border-zinc-800/70 py-24 md:py-32">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-8">
        <Reveal>
          <p className="mb-3 font-mono text-sm uppercase tracking-widest text-accent">
            Continuous learning
          </p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Courses and continuous learning
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-5 max-w-2xl leading-relaxed text-zinc-400">
            Alongside professional experience and university studies, I&apos;ve
            completed additional coursework in JavaScript, React, Next.js,
            TypeScript, and technical leadership. I&apos;m currently studying
            machine learning as part of my broader interest in AI.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, i) => (
            <Reveal key={course.title} delay={0.06 * i}>
              <a
                href={course.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col border border-border bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-zinc-500"
                aria-label={`View course: ${course.title}`}
              >
                <div className="flex items-center justify-between">
                  <LogoImage
                    src={course.logo}
                    alt={`${course.provider} logo`}
                    width={40}
                    height={40}
                    icon="book"
                    className="h-20 w-20"
                  />
                  <span
                    className={cn(
                      "rounded px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider",
                      course.status === "ongoing"
                        ? "bg-accent/10 text-accent"
                        : "bg-emerald-500/10 text-emerald-400"
                    )}
                  >
                    {course.status === "ongoing" ? "in progress" : "completed"}
                  </span>
                </div>

                <h3 className="mt-4 flex-1 text-sm font-medium leading-snug text-zinc-200 group-hover:text-zinc-100">
                  {course.title}
                </h3>

                <div className="mt-4 flex items-center justify-between border-t border-zinc-800/60 pt-3">
                  <span className="font-mono text-[11px] text-zinc-500">
                    {course.provider}
                  </span>
                  <FiArrowUpRight className="h-4 w-4 text-zinc-500 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}