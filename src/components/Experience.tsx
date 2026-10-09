import { profile } from "@/data/profile";

const highlights = [
  {
    title: "Architecture migration",
    items: [
      "Helped migrate a monolithic frontend into a multi-zone, multi-repository architecture.",
      "Implemented reverse-proxy routing and shared infrastructure across multiple enterprise applications.",
      "Used a vertical-slice approach to organize features around business capabilities.",
    ],
  },
  {
    title: "Products at operational scale",
    items: [
      "Developed and maintained 25 production applications with React, Next.js, and TypeScript.",
      "Worked on data-heavy interfaces including complex tables, forms, dashboards, charts, timelines, and printing workflows.",
      "Supported applications spanning production, logistics, farming, finance, procurement, HR, commerce, and user management.",
    ],
  },
  {
    title: "Shared frontend foundations",
    items: [
      "Developed six internal npm packages for reusable components, layouts, icons, utilities, and common functionality.",
      "Shared frontend infrastructure used across projects by a team of five frontend developers.",
    ],
  },
  {
    title: "Connected software to real equipment",
    items: [
      "Integrated ten industrial weighing systems with the ERP platform, working with device-specific protocols, encoding requirements, and production connectivity.",
      "Spent 60 days on-site diagnosing hardware/software integration problems and resolving production issues.",
    ],
  },
  {
    title: "Real-time and delivery",
    items: [
      "Implemented real-time functionality with WebSockets and SignalR for live data synchronization.",
      "Contributed across Docker and Kubernetes deployments, CI/CD, Linux environments, production troubleshooting, and collaboration with backend and operations teams.",
    ],
  },
];

export default function Experience() {
  const role = profile.experience[0];

  return (
    <section className="experience-section section-wrap" id="experience" aria-labelledby="experience-title">
      <div className="experience-heading" data-reveal>
        <p className="section-kicker"><span>03</span> In production</p>
        <p className="eyebrow experience-period">SEP 2024 <span>—</span> PRESENT</p>
      </div>

      <div className="experience-body">
        <div className="experience-role" data-reveal>
          <div className="experience-company">
            <span className="company-stamp">MAM</span>
            <div>
              <h2 id="experience-title">Engineering at operational scale.</h2>
              <a href={role.website} target="_blank" rel="noopener noreferrer">{role.company} <span aria-hidden="true">↗</span></a>
              <p>{role.role} <span>·</span> {role.location}</p>
            </div>
          </div>
          <p className="experience-summary">
            A broad enterprise ERP environment across nine business domains — where dependable software has to connect interfaces, services, shared infrastructure, and physical operations.
          </p>
          <ul className="domain-list" aria-label="ERP business domains">
            {role.erpDomains.map((domain) => <li key={domain}>{domain}</li>)}
          </ul>
          <a className="company-link" href={role.website} target="_blank" rel="noopener noreferrer">About MAM <span aria-hidden="true">↗</span></a>
        </div>

        <div className="experience-detail">
          {highlights.map((group, index) => (
            <details className="experience-detail-item" data-reveal data-reveal-delay={String(index * 55)} key={group.title} open={index === 0}>
              <summary><span className="detail-index">0{index + 1}</span><span>{group.title}</span><i aria-hidden="true">+</i></summary>
              <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
