"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Reveal from "@/components/Reveal";
import { cn } from "@/lib/utils";

const IMAGES = [
  { src: "/mam/slaughterhouse-office.jpg", alt: "MAM facility" },
  { src: "/mam/conference2.png", alt: "MAM facility" },
  { src: "/mam/problem-solving.png", alt: "MAM facility" },
  { src: "/mam/slaughterhouse.png", alt: "MAM facility" },
  { src: "/mam/slaughterhouse-also-again.jpg", alt: "MAM facility" },
  { src: "/mam/slaughterhouse-again.jpg", alt: "MAM facility" },

  { src: "/mam/office.png", alt: "MAM facility" },

  { src: "/mam/problem-solving-again.jpg", alt: "MAM facility" },
    { src: "/mam/working-late.jpg", alt: "MAM facility" },
];

const INTERVAL_MS = 5000;

export default function MAMGallery() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [paused, setPaused] = useState(false);

  const total = IMAGES.length;

  const go = useCallback(
    (next: number) => {
      setDirection(next > current ? 1 : -1);
      setCurrent(next);
    },
    [current],
  );

  const prev = useCallback(
    () => go((current - 1 + total) % total),
    [current, total, go],
  );
  const next = useCallback(
    () => go((current + 1) % total),
    [current, total, go],
  );

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, INTERVAL_MS);
    return () => clearInterval(id);
  }, [paused, next]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next]);

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <section className="relative border-t border-border py-16 md:py-24">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-8">
        <Reveal>
          <p className="mb-3 font-mono text-sm uppercase tracking-widest text-accent">
            Life at MAM
          </p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            More than just the workplace
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-zinc-400">
            A collection of memories from the places I worked, the challenges I
            faced, and the people I shared this journey with. These experiences
            gave me the chance to meet so many amazing people, make great
            friends, and create memories that I’ll carry with me along the way.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div
            className="group relative mt-10 overflow-hidden rounded-lg border border-border bg-surface"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Main image */}
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <AnimatePresence
                initial={false}
                custom={direction}
                mode="popLayout"
              >
                <motion.div
                  key={current}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    duration: 0.45,
                    ease: [0.21, 0.47, 0.32, 0.98],
                  }}
                  className="absolute inset-0"
                >
                  <Image
                    src={IMAGES[current].src}
                    alt={IMAGES[current].alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 100rem"
                    className="object-cover"
                    priority={current === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </motion.div>
              </AnimatePresence>

              {/* Counter */}
              <span className="absolute bottom-4 right-4 z-10 rounded bg-black/60 px-2.5 py-1 font-mono text-xs text-zinc-300 backdrop-blur">
                {current + 1} / {total}
              </span>

              {/* Arrows */}
              <button
                type="button"
                onClick={prev}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 hover:bg-black/70"
              >
                <FiChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next image"
                className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 hover:bg-black/70"
              >
                <FiChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-1.5 overflow-x-auto px-3 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {IMAGES.map((img, i) => (
                <button
                  key={img.src}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Go to image ${i + 1}`}
                  className={cn(
                    "relative h-14 w-20 shrink-0 overflow-hidden rounded border-2 transition-all md:h-16 md:w-24",
                    i === current
                      ? "border-accent ring-1 ring-accent/30"
                      : "border-transparent opacity-50 hover:opacity-80",
                  )}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="6rem"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
