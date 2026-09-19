"use client";

import { motion } from "framer-motion";
import {
  FiCpu,
  FiDatabase,
  FiRadio,
  FiTool,
} from "react-icons/fi";
import { FaWrench } from "react-icons/fa";
import Reveal from "@/components/Reveal";
import { profile } from "@/data/profile";

const ASPECT_ICONS = [FiRadio, FiDatabase, FiCpu, FiTool, FaWrench];

export default function IndustrialIntegration() {
  const integration = profile.industrialIntegration;

  return (
    <section className="relative border-t border-zinc-800/70 py-12 md:py-16">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[auto_1fr] lg:gap-16">
          <Reveal className="lg:pt-2">
            <p className="sticky top-28 max-w-xs font-mono text-xs uppercase tracking-widest text-zinc-500">
              Industrial weighing systems
            </p>
          </Reveal>

          <div>
            <Reveal>
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-xl font-semibold md:text-2xl">
                  {integration.title}
                </h3>
                <span className="rounded border border-accent/40 bg-accent/10 px-2.5 py-1 font-mono text-sm font-semibold text-accent">
                  × {integration.count}
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <p className="mt-4 leading-relaxed text-zinc-400">
                I integrated 10 industrial weighing systems with the ERP
                platform. This involved working with device-specific
                communication protocols, encoding requirements, and
                connectivity issues in production environments.
              </p>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-4 leading-relaxed text-zinc-400">
                I also spent 60 days on-site at industrial facilities
                diagnosing hardware/software integration problems and resolving
                production issues.
              </p>
            </Reveal>

            <Reveal delay={0.16}>
              <ul className="mt-8 divide-y divide-border border-t border-border">
                {integration.aspects.map((aspect, i) => {
                  const Icon = ASPECT_ICONS[i % ASPECT_ICONS.length];
                  return (
                    <li
                      key={aspect}
                      className="flex items-center gap-3 py-3"
                    >
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-border text-zinc-400"
                        aria-hidden="true"
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-sm text-zinc-300">{aspect}</span>
                    </li>
                  );
                })}
              </ul>
            </Reveal>

            <Reveal delay={0.24}>
              <motion.blockquote
                className="mt-8 border-l-2 border-accent pl-4 font-mono text-sm text-zinc-500"
              >
                60 days on-site. Diagnosing hardware/software integration issues
                and resolving production-critical problems with minimal
                disruption.
              </motion.blockquote>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}