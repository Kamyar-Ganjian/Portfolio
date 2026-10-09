"use client";

import { useEffect, type ReactNode } from "react";

export default function MotionProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reducedMotion.matches || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const element = entry.target as HTMLElement;
          element.dataset.revealState = "visible";
          observer.unobserve(element);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    targets.forEach((element) => {
      const delay = Number(element.dataset.revealDelay ?? 0);
      element.style.setProperty("--reveal-delay", `${Math.min(delay, 320)}ms`);

      if (element.getBoundingClientRect().top < window.innerHeight * 0.94) {
        element.dataset.revealState = "visible";
      } else {
        element.dataset.revealState = "hidden";
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  return children;
}
