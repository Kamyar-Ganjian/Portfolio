"use client";

import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import Reveal from "@/components/Reveal";

function Arrow() {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.15 }}
      aria-hidden="true"
    >
      <FiArrowRight className="mx-auto h-5 w-5 text-zinc-600" />
    </motion.span>
  );
}

export default function Direction() {
  return (
    <section className="border-t border-zinc-800/70 py-24 md:py-32">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 md:px-8 lg:grid-cols-[auto_1fr] lg:gap-20">
        <Reveal>
          <p className="sticky top-28 font-mono text-sm uppercase tracking-widest text-accent">
            06 / Current direction
          </p>
        </Reveal>

        <div>
          <Reveal>
            <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
              Frontend engineering and AI
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="mt-5 max-w-2xl leading-relaxed text-zinc-400">
              I&apos;m currently pursuing an MSc in Artificial Intelligence
              Engineering while continuing to work as a frontend engineer. I&apos;m
              interested in applying AI to web applications and exploring how
              frontend systems can work with intelligent features.
            </p>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="mt-10 grid gap-4 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center sm:gap-3">
              <div className="panel p-6 text-center">
                <p className="label">Current work</p>
                <p className="mt-2 text-lg font-semibold">Frontend Engineering</p>
                <p className="mt-1 text-sm text-zinc-500">primary focus</p>
              </div>

              <Arrow />

              <div className="panel p-6 text-center">
                <p className="label">Systems work</p>
                <p className="mt-2 text-lg font-semibold">Software Architecture</p>
                <p className="mt-1 text-sm text-zinc-500">multi-zone · shared packages</p>
              </div>

              <Arrow />

              <div className="panel border-accent/40 bg-accent/5 p-6 text-center">
                <p className="label text-accent">Next</p>
                <p className="mt-2 text-lg font-semibold">Artificial Intelligence</p>
                <p className="mt-1 text-sm text-zinc-500">
                  studying · M.Sc. in progress
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <p className="mt-8 max-w-2xl font-mono text-sm leading-relaxed text-zinc-500">
              Frontend engineering remains my primary professional focus. I&apos;m
              working toward combining it with a growing interest in AI — such
              as building web applications that include intelligent features.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}