"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FiBookOpen, FiBox } from "react-icons/fi";
import { FaBuilding, FaGraduationCap } from "react-icons/fa";

type LogoIcon = "building" | "graduation" | "book" | "generic";

const ICONS: Record<LogoIcon, React.ComponentType<{ className?: string }>> = {
  building: FaBuilding,
  graduation: FaGraduationCap,
  book: FiBookOpen,
  generic: FiBox,
};

interface LogoImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  icon?: LogoIcon;
  className?: string;
}

export default function LogoImage({
  src,
  alt,
  width,
  height,
  icon = "generic",
  className,
}: LogoImageProps) {
  const [available, setAvailable] = useState(false);
  const FallbackIcon = ICONS[icon];

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    fetch(src, { signal: controller.signal })
      .then((res) => {
        if (!cancelled && res.ok) setAvailable(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [src]);

  if (!available) {
    return (
      <span
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded border border-zinc-700/60 bg-zinc-800/40 text-zinc-400"
        role="img"
        aria-label={alt}
      >
        <FallbackIcon className="h-4 w-4" />
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
}