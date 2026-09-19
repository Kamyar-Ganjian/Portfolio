"use client";

import {
  FiDownload,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";
import { SiX, SiXing } from "react-icons/si";
import ExternalLink from "@/components/ExternalLink";
import Reveal from "@/components/Reveal";
import { profile } from "@/data/profile";

export default function Contact() {
  const personal = profile.personal;
  const links = profile.links;

  return (
    <section id="contact" className="relative border-t border-zinc-800/70 py-28 md:py-36">
      <div className="mx-auto w-full max-w-6xl px-6 text-center md:px-8">
        <Reveal>
          <p className="mb-3 font-mono text-sm uppercase tracking-widest text-accent">
            Contact
          </p>
          <h2 className="mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight md:text-5xl">
            Let&apos;s connect
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-zinc-400">
            I&apos;m currently open to frontend engineering opportunities,
            particularly roles involving React, Next.js, TypeScript, frontend
            architecture, and complex enterprise systems.
          </p>
        </Reveal>

        <Reveal delay={0.14}>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-zinc-500">
            I&apos;m open to relocation.
          </p>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href={links.email}
              className="btn-primary px-6 py-3 text-base"
            >
              <FiMail className="h-5 w-5" />
              {personal.email}
            </a>
            <a
              href={links.resume}
              download
              className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 text-base font-medium text-zinc-200 transition-colors hover:border-zinc-600 hover:text-foreground"
            >
              <FiDownload className="h-5 w-5" />
              Download résumé
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.26}>
          <div className="mx-auto mt-12 grid max-w-2xl gap-3 sm:grid-cols-2">
            <div className="panel flex items-center justify-center gap-3 px-4 py-4">
              <a
                href={links.phone}
                className="inline-flex items-center gap-2.5 text-sm text-zinc-300 transition-colors hover:text-foreground"
              >
                <FiPhone className="h-4 w-4 text-zinc-500" />
                {personal.phone}
              </a>
            </div>
            <div className="panel flex items-center justify-center gap-3 px-4 py-4">
              <span className="inline-flex items-center gap-2.5 text-sm text-zinc-300">
                <FiMapPin className="h-4 w-4 text-zinc-500" />
                {personal.location} · open to relocation
              </span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.34}>
          <div className="mt-8 flex items-center justify-center gap-6">
            <ExternalLink
              href={links.github}
              icon={FiGithub}
              ariaLabel="GitHub"
              showExternalIcon={false}
              className="h-10 w-10 justify-center rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
            >
              <span className="sr-only">GitHub</span>
            </ExternalLink>
            <ExternalLink
              href={links.linkedin}
              icon={FiLinkedin}
              ariaLabel="LinkedIn"
              showExternalIcon={false}
              className="h-10 w-10 justify-center rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
            >
              <span className="sr-only">LinkedIn</span>
            </ExternalLink>
            <ExternalLink
              href={links.xing}
              icon={SiXing}
              ariaLabel="Xing"
              showExternalIcon={false}
              className="h-10 w-10 justify-center rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
            >
              <span className="sr-only">Xing</span>
            </ExternalLink>
            <ExternalLink
              href={links.x}
              icon={SiX}
              ariaLabel="X"
              showExternalIcon={false}
              className="h-10 w-10 justify-center rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
            >
              <span className="sr-only">X</span>
            </ExternalLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}