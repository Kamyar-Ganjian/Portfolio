import CaseStudyVisual from "@/components/CaseStudyVisual";
import { selectedProjects } from "@/data/portfolio";

function KeevoVisual() {
  return (
    <figure className="case-visual project-visual vault-visual">
      <p className="diagram-label">APPLICATION FLOW</p>
      <div
        className="vault-flow"
        role="img"
        aria-label="Keevo uses a Next.js interface, Auth.js authentication, server actions, and Prisma with PostgreSQL persistence."
      >
        <div>
          <span>APP</span>
          <strong>Next.js</strong>
        </div>
        <span className="vault-flow-arrow" aria-hidden="true">→</span>
        <div>
          <span>AUTH + LOGIC</span>
          <strong>Auth.js<br />Server actions</strong>
        </div>
        <span className="vault-flow-arrow" aria-hidden="true">→</span>
        <div>
          <span>DATA</span>
          <strong>Prisma<br />PostgreSQL</strong>
        </div>
      </div>
      <figcaption>
        Sensitive secret and code fields are encrypted server-side with AES-256-GCM.
      </figcaption>
    </figure>
  );
}

export default function ProjectsSection() {
  return (
    <section className="projects-section page-width" id="projects" aria-labelledby="projects-title">
      <header className="projects-heading">
        <div>
          <p className="eyebrow">Selected work</p>
          <h2 id="projects-title">Projects</h2>
        </div>
        <p>
          Two projects from my work at MAM, plus one independent full-stack
          application. Internal company systems stay private; the case studies
          focus on my contribution and the engineering details that can be shared.
        </p>
      </header>

      <div className="project-list">
        {selectedProjects.map((project) => (
          <article
            className="project-card"
            id={`project-${project.id}`}
            key={project.id}
            aria-labelledby={`${project.id}-title`}
          >
            <header className="project-card-heading">
              <p className="project-kicker">
                <span>{project.number}</span>
                {project.category}
              </p>
              <h3 id={`${project.id}-title`}>{project.title}</h3>
              <p className="project-summary">{project.summary}</p>
            </header>

            <div className="project-card-content">
              <div className="project-artifact">
                {project.visual ? <CaseStudyVisual study={project.visual} /> : <KeevoVisual />}
              </div>

              <div className="project-details">
                <div className="project-detail-block">
                  <h4>My contribution</h4>
                  {Array.isArray(project.contribution) ? (
                    <ul>
                      {project.contribution.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  ) : (
                    <p>{project.contribution}</p>
                  )}
                </div>

                <div className="project-detail-block">
                  <h4>Engineering detail</h4>
                  <p>{project.implementation}</p>
                </div>

                {project.results.length > 0 && (
                  <div className="project-results" aria-label="Project results">
                    {project.results.map((result) => (
                      <div key={result.label}>
                        <strong>{result.value}</strong>
                        <span>{result.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="project-stack">
                  <h4>Technologies &amp; methods</h4>
                  <ul>
                    {project.technologies.map((technology) => (
                      <li key={technology}>{technology}</li>
                    ))}
                  </ul>
                </div>

                {project.links.length > 0 && (
                  <div className="project-links">
                    {project.links.map((link) => (
                      <a href={link.href} key={link.href} target="_blank" rel="noreferrer">
                        {link.label} <span aria-hidden="true">↗</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
