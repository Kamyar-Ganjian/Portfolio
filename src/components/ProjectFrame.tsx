"use client";

import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";

export default function ProjectFrame({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const frameRequest = useRef(0);
  const reduceMotion = useRef(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      reduceMotion.current = preference.matches;
    };

    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => {
      preference.removeEventListener("change", updatePreference);
      window.cancelAnimationFrame(frameRequest.current);
    };
  }, []);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const frame = frameRef.current;
    if (!frame || event.pointerType !== "mouse" || reduceMotion.current) return;

    const bounds = frame.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    const rotateX = (0.5 - y) * 6;
    const rotateY = (x - 0.5) * 8;

    window.cancelAnimationFrame(frameRequest.current);
    frameRequest.current = window.requestAnimationFrame(() => {
      frame.style.setProperty("--pointer-x", `${Math.round(x * 100)}%`);
      frame.style.setProperty("--pointer-y", `${Math.round(y * 100)}%`);
      frame.style.setProperty("--pointer-tilt-x", `${rotateX.toFixed(2)}deg`);
      frame.style.setProperty("--pointer-tilt-y", `${rotateY.toFixed(2)}deg`);
      frame.dataset.pointerActive = "true";
    });
  };

  const resetPointer = () => {
    const frame = frameRef.current;
    if (!frame) return;
    window.cancelAnimationFrame(frameRequest.current);
    frame.dataset.pointerActive = "false";
    frame.style.setProperty("--pointer-x", "50%");
    frame.style.setProperty("--pointer-y", "50%");
    frame.style.setProperty("--pointer-tilt-x", "0deg");
    frame.style.setProperty("--pointer-tilt-y", "0deg");
  };

  return (
    <div
      ref={frameRef}
      className={className}
      aria-hidden="true"
      data-pointer-active="false"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      {children}
    </div>
  );
}
