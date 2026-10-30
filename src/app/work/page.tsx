import Link from "next/link";
import ProjectList from "@/components/ProjectList";
import { professionalProjects, personalProjects, professionalExperience } from "@/data/site";

export const metadata = {
  title: "Work",
  description: "Professional engineering at MAM Broiler Integration: production ERP applications, independent releases, shared packages, and industrial integrations.",
  alternates: { canonical: "/work" },
};

export default function Work() {
  return <div className="page-width page">
    <p className="eyebrow">WORK / MAM BROILER INTEGRATION</p>
    <h1>Engineering for production.</h1>
    <p className="lede">Frontend Engineer · {professionalExperience.dates}</p>
    <p className="work-introduction">At MAM, I develop and maintain ERP software used by 600–1,000 people daily across 10+ domains. My contributions span 25+ applications, independent release architecture, shared internal packages, and industrial hardware integrations.</p>
    <section aria-labelledby="professional-work-heading">
      <h2 id="professional-work-heading">Professional work</h2>
      <p className="muted">Case studies describe my contributions. Internal source, operational records, and proprietary screenshots remain confidential.</p>
      <ProjectList projects={professionalProjects} />
    </section>
    <section id="personal-projects" className="section personal-projects" aria-labelledby="personal-projects-title">
      <p className="eyebrow">ALSO / INDEPENDENT WORK</p>
      <h2 id="personal-projects-title">Personal projects</h2>
      <p className="muted">Smaller independent applications built outside my role at MAM.</p>
      {personalProjects.map(project => <article className="personal-project-row" key={project.slug}>
        <h3><Link href={`/work/${project.slug}`}>{project.title}</Link></h3>
        <p>{project.description}</p>
        <div className="links"><Link href={`/work/${project.slug}`}>Details →</Link>{project.source && <a href={project.source}>Source ↗</a>}{project.live && <a href={project.live}>Live demo ↗</a>}</div>
      </article>)}
    </section>
  </div>;
}
