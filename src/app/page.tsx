import Image from "next/image";
import { site } from "@/data/portfolio";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import ExperienceSection from "@/components/ExperienceSection";
import SkillsSection from "@/components/SkillsSection";

const evidence = [
  { value: "25+", label: "production applications", note: "10+ ERP domains" },
  { value: "600–1,000", label: "daily active users", note: "Across production software" },
  { value: "96%", label: "smaller deployment scope", note: "Impact isolated to one application" },
  { value: "6 → 20+", label: "shared packages to apps", note: "Used by a 5-developer frontend team" },
];

export default function Home() {
  return (
    <>
      <section className="hero-section" id="top" aria-labelledby="home-title">
        <div className="home-hero page-width">
          <div className="hero-copy">
            <p className="eyebrow hero-location">
              Software Engineer <span aria-hidden="true">·</span> Full-Stack Developer
            </p>
            <h1 id="home-title">
              Software,
              <br />
              from interface
              <br />
              <span>to operations.</span>
            </h1>
            <p className="hero-intro">
              With 2+ years in production frontend engineering, I build with
              React, Next.js, and TypeScript, and work across C#/.NET backend
              systems and industrial ERP integrations.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#projects">
                View Projects <span aria-hidden="true">↘</span>
              </a>
              <a className="text-link" href="#contact">
                Contact Me <span aria-hidden="true">↗</span>
              </a>
            </div>
            <p className="hero-role-note">
              <span>Frontend in production</span>
              <span>Full-stack development</span>
              <span>M.Sc. Artificial Intelligence Engineering</span>
            </p>
          </div>

          <figure className="hero-portrait">
            <div className="hero-portrait-frame">
              <Image
                src="/images/profile-2.png"
                alt="Portrait of Kamyar Ganjian"
                fill
                priority
                sizes="(max-width: 760px) 88px, (max-width: 950px) 100px, (max-width: 1200px) 38vw, 430px"
              />
              <span className="portrait-image-label" aria-hidden="true">
                KG <i>·</i> 01
              </span>
            </div>
            <figcaption>
              <strong>{site.name}</strong>
              <span>{site.location} <i aria-hidden="true">·</i> Open to relocation</span>
            </figcaption>
          </figure>
        </div>

        <div className="evidence-band" role="group" aria-label="Selected professional evidence">
          <div className="page-width evidence-grid">
            {evidence.map((item) => (
              <div className="evidence-item" key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
                <p>{item.note}</p>
              </div>
            ))}
          </div>
          <p className="evidence-source page-width">
            Figures from professional work at MAM Broiler Integration.
          </p>
        </div>
      </section>

      <ProjectsSection />
      <AboutSection />
      <ExperienceSection />
      <SkillsSection />
      <ContactSection />
    </>
  );
}
