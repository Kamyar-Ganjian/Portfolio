"use client";

import { FiGithub, FiLinkedin } from "react-icons/fi";
import { SiX, SiXing } from "react-icons/si";
import ExternalLink from "@/components/ExternalLink";
import { profile } from "@/data/profile";

export default function Footer() {
  const personal = profile.personal;
  const links = profile.links;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-800/70">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-6 px-6 py-10 md:flex-row md:px-8">
        <p className="font-mono text-xs text-zinc-500">
          © {year} {personal.name}. Built with React, Next.js & TypeScript.
        </p>

        <div className="flex items-center gap-2">
          <ExternalLink
            href={links.github}
            icon={FiGithub}
            ariaLabel="GitHub"
            showExternalIcon={false}
            className="inline-flex h-9 w-9 justify-center rounded-md text-zinc-500 hover:bg-zinc-800 hover:text-zinc-100"
          >
            <span className="sr-only">GitHub</span>
          </ExternalLink>
          <ExternalLink
            href={links.linkedin}
            icon={FiLinkedin}
            ariaLabel="LinkedIn"
            showExternalIcon={false}
            className="inline-flex h-9 w-9 justify-center rounded-md text-zinc-500 hover:bg-zinc-800 hover:text-zinc-100"
          >
            <span className="sr-only">LinkedIn</span>
          </ExternalLink>
          <ExternalLink
            href={links.xing}
            icon={SiXing}
            ariaLabel="Xing"
            showExternalIcon={false}
            className="inline-flex h-9 w-9 justify-center rounded-md text-zinc-500 hover:bg-zinc-800 hover:text-zinc-100"
          >
            <span className="sr-only">Xing</span>
          </ExternalLink>
          <ExternalLink
            href={links.x}
            icon={SiX}
            ariaLabel="X"
            showExternalIcon={false}
            className="inline-flex h-9 w-9 justify-center rounded-md text-zinc-500 hover:bg-zinc-800 hover:text-zinc-100"
          >
            <span className="sr-only">X</span>
          </ExternalLink>
        </div>
      </div>
    </footer>
  );
}