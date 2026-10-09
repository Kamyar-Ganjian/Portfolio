"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";

export default function Navigation() {
  const [activeSection, setActiveSection] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const targets = profile.nav
      .map((item) => document.querySelector(item.href))
      .filter((target): target is Element => target !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveSection(`#${visible[0].target.id}`);
      },
      { rootMargin: "-18% 0px -68% 0px", threshold: 0 },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
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

  return (
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
  );
}
