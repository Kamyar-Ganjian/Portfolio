"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedMetricProps {
  value: number;
  label: string;
  description: string;
  prefix?: string;
  suffix?: string;
  range?: string;
  accent?: boolean;
  duration?: number;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

function format(value: number, prefix: string, suffix: string) {
  return `${prefix}${value.toLocaleString("en-US")}${suffix}`;
}

export default function AnimatedMetric({
  value,
  label,
  description,
  prefix = "",
  suffix = "",
  range,
  accent = false,
  duration = 1000,
}: AnimatedMetricProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(() => format(value, prefix, suffix));

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let rafId = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = easeOutCubic(progress);
          setDisplay(format(Math.round(eased * value), prefix, suffix));
          if (progress < 1) rafId = requestAnimationFrame(tick);
        };
        rafId = requestAnimationFrame(tick);
      },
      { rootMargin: "-15% 0px -15% 0px" }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [value, prefix, suffix, duration]);

  return (
    <div ref={ref}>
      <div className="flex items-baseline gap-3">
        <span
          className={cn(
            "text-5xl font-semibold tracking-tight tabular-nums text-foreground lg:text-6xl",
            accent && "text-accent"
          )}
        >
          {display}
        </span>
        {range && (
          <span className="font-mono text-xs text-zinc-600">[{range}]</span>
        )}
      </div>
      <h3 className="mt-3 text-sm font-semibold text-foreground">{label}</h3>
      <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-zinc-500">
        {description}
      </p>
    </div>
  );
}