type Project = {
  number: string;
  name: string;
  descriptor: string;
  description: string;
  contribution: string;
  stack: string[];
  href: string;
  linkLabel: string;
  visual: "cv" | "vault" | "folio";
  featured?: boolean;
};

const projects: Project[] = [
  {
    number: "01",
    name: "CV Builder",
    descriptor: "Open source · Product engineering",
    description:
      "A private-by-default resume workspace built around a practical question: can a CV read clearly to both a hiring manager and an ATS? It brings together an ATS-safe document model, job-description keyword matching, actionable feedback, live preview, and PDF and DOCX exports.",
    contribution:
      "Designed as a client-side application. Resumes stay in the browser; no account or server is needed.",
    stack: ["Next.js", "TypeScript", "Zustand", "Client-side PDF / DOCX"],
    href: "https://github.com/Kamyar-Ganjian/cv-builder",
    linkLabel: "Explore the repository",
    visual: "cv",
    featured: true,
  },
  {
    number: "02",
    name: "Keevo",
    descriptor: "Personal project · Full-stack application",
    description:
      "A private vault for bringing the scattered details of technical work into one organized place — credentials, servers, domains, licenses, notes, and API keys.",
    contribution:
      "A full-stack product built with a typed Next.js application, authenticated access, and a PostgreSQL data layer.",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Neon", "Auth.js"],
    href: "https://vault-keevo.vercel.app",
    linkLabel: "Open Keevo",
    visual: "vault",
  },
  {
    number: "03",
    name: "Portfolio",
    descriptor: "Independent project · Ongoing",
    description:
      "This portfolio is an engineering project in its own right: a clear account of production systems work, independent products, and the path from frontend architecture toward AI.",
    contribution:
      "Built with the Next.js App Router, TypeScript, and a custom responsive design system — with server-rendered content and deliberately lightweight motion.",
    stack: ["Next.js 16", "React 19", "TypeScript", "CSS"],
    href: "https://github.com/Kamyar-Ganjian/Portfolio",
    linkLabel: "View the source",
    visual: "folio",
  },
];

function ProjectVisual({ type }: { type: Project["visual"] }) {
  if (type === "cv") {
    return (
      <div className="cv-preview" aria-hidden="true">
        <div className="cv-window-bar"><i /><i /><i /><span>resume.workspace</span><b>ATS REVIEW</b></div>
        <div className="cv-window-body">
          <div className="cv-sidebar"><span>DOCUMENT</span><b>Content</b><b>Design</b><b>Job match</b><b>ATS check</b><span className="cv-side-foot">SAVED LOCALLY</span></div>
          <div className="cv-paper"><div className="cv-paper-name">RESUME PREVIEW</div><div className="cv-paper-subtitle">ATS-friendly · single-column</div><i className="cv-paper-rule" /><span className="cv-paper-heading">EXPERIENCE</span><b /><b className="short" /><b /><span className="cv-paper-heading">SKILLS</span><div className="cv-keywords"><i /><i /><i /></div><b className="short" /></div>
        </div>
        <div className="cv-caption">A focused workspace. Your data stays yours.</div>
      </div>
    );
  }

  if (type === "vault") {
    return (
      <div className="vault-preview" aria-hidden="true">
        <div className="vault-top"><span className="vault-symbol">k.</span><span>PERSONAL VAULT</span><span className="vault-lock">⌑ &nbsp; PRIVATE</span></div>
        <div className="vault-heading">Everything important,<br /><em>in its place.</em></div>
        <div className="vault-list"><span><i>01</i> Credentials <b>ACCESS</b></span><span><i>02</i> Servers &amp; domains <b>INFRASTRUCTURE</b></span><span><i>03</i> Technical notes <b>REFERENCE</b></span></div>
        <div className="vault-bottom"><span>ORGANIZED BY YOU</span><span>AUTHENTICATED ACCESS&nbsp; ↗</span></div>
      </div>
    );
  }

  return (
    <div className="folio-preview" aria-hidden="true">
      <div className="folio-topline"><span>FIELD NOTES / 2026</span><span>KG—001</span></div>
      <div className="folio-letters">KG<span>↗</span></div>
      <div className="folio-diagram"><i /><i /><i /><i /><span /><span /></div>
      <div className="folio-baseline"><span>INTERFACE</span><span>SYSTEMS</span><span>INTELLIGENCE</span></div>
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className={`project-card${project.featured ? " project-card--featured" : ""}`} data-reveal data-reveal-delay={String(index * 90)}>
      <div className={`project-visual project-visual--${project.visual}`} aria-hidden="true">
        <ProjectVisual type={project.visual} />
        <span className="project-number">{project.number} / 03</span>
      </div>
      <div className="project-copy">
        <p className="project-descriptor">{project.descriptor}</p>
        <h3>{project.name}</h3>
        <p className="project-description">{project.description}</p>
        <p className="project-contribution">{project.contribution}</p>
        <ul className="project-stack" aria-label={`${project.name} technologies`}>
          {project.stack.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <a className="project-link" href={project.href} target="_blank" rel="noopener noreferrer">
          {project.linkLabel}<span aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  );
}

export default function Projects() {
  return (
    <section className="projects-section section-wrap" id="work" aria-labelledby="work-title">
      <div className="section-heading" data-reveal>
        <p className="section-kicker"><span>02</span> Selected work</p>
        <div><h2 id="work-title">Useful things,<br /><em>thoughtfully built.</em></h2>
          <p className="section-deck">Independent projects where product choices and engineering details matter.</p>
        </div>
      </div>
      <div className="projects-list">
        {projects.map((project, index) => <ProjectCard project={project} index={index} key={project.number} />)}
      </div>
    </section>
  );
}
