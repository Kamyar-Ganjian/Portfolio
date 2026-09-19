"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiDownload,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiMapPin,
} from "react-icons/fi";
import { SiX, SiXing } from "react-icons/si";
import { profile } from "@/data/profile";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

function ProfileImage() {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch(profile.assets.profileImage, { signal: controller.signal })
      .then((res) => {
        if (res.ok) setAvailable(true);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  if (!available) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950">
        <div className="flex flex-col items-center justify-center gap-3 p-8 text-center">
          <span className="font-mono text-5xl font-semibold text-zinc-600">
            KG
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
            portrait
            <br />
            coming soon
          </span>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={profile.assets.profileImage}
      alt="Portrait of Kamyar Ganjian"
      fill
      sizes="(max-width: 768px) 90vw, 420px"
      style={{ objectFit: "cover" }}
      priority
    />
  );
}

function AvailabilityPulse() {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
    </span>
  );
}

export default function Hero() {
  const links = profile.links;
  const linkedInAvailable = Boolean(links.linkedin);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      <div className="relative mx-auto grid w-full max-w-6xl gap-14 px-6 pt-28 pb-20 md:px-8 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-20">
        <div className="order-2 lg:order-1">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: EASE }}
            className="mb-4 flex items-center gap-2.5 font-mono text-sm text-zinc-400"
          >
            <AvailabilityPulse />
            <span>Open to relocation</span>
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15, ease: EASE }}
            className="text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-6xl"
          >
            Kamyar Ganjian
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.3, ease: EASE }}
            className="mt-4 text-xl font-medium text-zinc-300 sm:text-2xl"
          >
            Frontend Engineer
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.4, ease: EASE }}
            className="mt-2 font-mono text-sm text-accent sm:text-base"
          >
            React · Next.js · TypeScript
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.5, ease: EASE }}
            className="mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg"
          >
            I build and maintain enterprise applications with React, Next.js,
            and TypeScript — frontend architecture, shared infrastructure,
            real-time functionality, and integrations with industrial weighing
            systems.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.62, ease: EASE }}
            className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3"
          >
            <a href={links.email} className="btn-primary">
              <FiMail className="h-4 w-4" />
              Contact me
            </a>

            <a
              href={links.resume}
              download
              className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:bg-surface hover:text-foreground"
            >
              <FiDownload className="h-4 w-4" />
              Resume
            </a>

            <div className="flex items-center gap-1">
              {/* <a
                href={links.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                title="GitHub"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-transparent text-zinc-400 transition-colors hover:border-border hover:bg-surface hover:text-foreground"
              >
                <FiGithub className="h-5 w-5" />
              </a> */}
              <span
                aria-disabled="true"
                title="Unavailable — recovery pending"
                className="inline-flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-md text-zinc-600"
              >
                <FiGithub className="h-5 w-5" />
              </span>
              {linkedInAvailable ? (
                <a
                  href={links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn profile"
                  title="LinkedIn"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-transparent text-zinc-400 transition-colors hover:border-border hover:bg-surface hover:text-foreground"
                >
                  <FiLinkedin className="h-5 w-5" />
                </a>
              ) : (
                <span
                  aria-disabled="true"
                  title="Unavailable — recovery pending"
                  className="inline-flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-md text-zinc-600"
                >
                  <FiLinkedin className="h-5 w-5" />
                </span>
              )}
              <a
                href={links.x}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X profile"
                title="X"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-transparent text-zinc-400 transition-colors hover:border-border hover:bg-surface hover:text-foreground"
              >
                <SiX className="h-5 w-5" />
              </a>
              <a
                href={links.xing}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Xing profile"
                title="Xing"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-transparent text-zinc-400 transition-colors hover:border-border hover:bg-surface hover:text-foreground"
              >
                <SiXing className="h-5 w-5" />
              </a>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.55, delay: 0.75, ease: EASE }}
            className="mt-6 flex items-center gap-2 font-mono text-xs text-zinc-500"
          >
            <FiMapPin className="h-3.5 w-3.5" />
            <span>{profile.personal.location}</span>
            <span className="text-zinc-700">/</span>
            <span>Open to relocation</span>
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
          className="order-1 lg:order-2 lg:justify-self-center"
        >
          <div className="relative mx-auto w-fit">
            <div
              className="absolute -left-6 -top-6 h-56 w-56 rounded-full border border-accent/25 md:h-72 md:w-72 lg:h-96 lg:w-96"
              aria-hidden="true"
            />
            <div
              className="slow-spin absolute -inset-3.5 rounded-full border border-dashed border-zinc-700/60"
              aria-hidden="true"
            />
            <div className="relative h-56 w-56 overflow-hidden rounded-full border border-border bg-surface md:h-72 md:w-72 lg:h-96 lg:w-96">
              <ProfileImage />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
