"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";

const CHAPTERS = [
  ["about", "Profile"],
  ["work", "Selected work"],
  ["experience", "In production"],
  ["architecture", "Architecture"],
  ["erp-domains", "Business domains"],
  ["integration", "Industrial systems"],
  ["packages", "Shared foundations"],
  ["gallery", "Field notes"],
  ["skills", "Technical toolkit"],
  ["education", "Education"],
  ["direction", "AI direction"],
  ["courses", "Continuous learning"],
  ["contact", "Contact"],
] as const;

export default function Navigation() {
  const [activeSection, setActiveSection] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-scroll-section]"));
    let frame = 0;
    let previousSection = "";
    const updateProgress = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
        progressRef.current?.style.setProperty("--scroll-progress", String(Math.max(0, Math.min(progress, 1))));

        const checkpoint = window.innerHeight * 0.36;
        const measured = sections.map((section) => ({ section, bounds: section.getBoundingClientRect() }));
        const current = measured.find(({ bounds }) => bounds.top <= checkpoint && bounds.bottom > checkpoint);
        const next = current ?? measured.find(({ bounds }) => bounds.top > checkpoint) ?? measured.at(-1);
        const nextSection = next ? `#${next.section.id}` : "";
        if (nextSection && nextSection !== previousSection) {
          previousSection = nextSection;
          setActiveSection(nextSection);
        }
      });
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const navLinks = profile.nav.map((item, index) => (
    <a
      href={item.href}
      key={item.href}
      aria-current={activeSection === item.href ? "location" : undefined}
      onClick={() => setMenuOpen(false)}
    >
      <span className="nav-index">0{index + 1}</span>
      <span>{item.label}</span>
      <span className="nav-arrow" aria-hidden="true">↗</span>
    </a>
  ));
  const chapterIndex = Math.max(0, CHAPTERS.findIndex(([id]) => `#${id}` === activeSection));
  const chapter = CHAPTERS[chapterIndex];

  return (
    <>
      <header className="site-header">
        <a className="skip-link" href="#main-content">Skip to content</a>
        <a className="wordmark" href="#hero" aria-label="Kamyar Ganjian — home">
          <span className="wordmark-mark" aria-hidden="true">K<span>.</span></span>
          <span>Kamyar Ganjian</span>
        </a>

        <nav className="desktop-nav" aria-label="Main navigation">{navLinks}</nav>

        <button
          ref={menuButtonRef}
          className={`menu-toggle${menuOpen ? " menu-toggle--open" : ""}`}
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span /><span />
        </button>
        <nav
          className="mobile-menu"
          id="mobile-menu"
          aria-label="Mobile navigation"
          aria-hidden={!menuOpen}
          inert={!menuOpen}
          data-open={menuOpen}
        >
          <p className="mobile-menu-label">Navigate the field</p>
          {navLinks}
          <p className="mobile-menu-foot">FULL-STACK ENGINEERING <i>·</i> AI &amp; MACHINE LEARNING</p>
        </nav>
      </header>

      <aside className="page-trace" aria-hidden="true">
        <span className="page-trace-index">{String(chapterIndex + 1).padStart(2, "0")}<i> / 13</i></span>
        <span className="page-trace-track"><span ref={progressRef} /></span>
        <span className="page-trace-label">{chapter[1]}</span>
      </aside>
    </>
  );
}
