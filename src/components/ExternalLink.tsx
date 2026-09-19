"use client";

import type { IconType } from "react-icons";
import { FiExternalLink } from "react-icons/fi";
import { cn } from "@/lib/utils";

interface ExternalLinkProps {
  href: string;
  icon?: IconType;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  showExternalIcon?: boolean;
}

export default function ExternalLink({
  href,
  icon: Icon,
  children,
  className,
  ariaLabel,
  showExternalIcon = true,
}: ExternalLinkProps) {
  if (!href) {
    return (
      <span
        className={cn(
          "inline-flex cursor-not-allowed items-center gap-1.5 opacity-50",
          className
        )}
        title="Link coming soon"
        aria-disabled="true"
      >
        {Icon && <Icon className="h-4 w-4" />}
        {children}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group inline-flex items-center gap-1.5 transition-colors hover:text-foreground",
        className
      )}
      aria-label={ariaLabel}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
      {showExternalIcon && (
        <FiExternalLink
          className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-70"
          aria-hidden="true"
        />
      )}
    </a>
  );
}