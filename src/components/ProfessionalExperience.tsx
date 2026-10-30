import Link from "next/link";
import { profile, professionalExperience as experience } from "@/data/site";

export default function ProfessionalExperience() {
  return <section id="experience" className="section experience-summary" aria-labelledby="experience-title">
    <p className="eyebrow">01 / PROFESSIONAL EXPERIENCE</p>
    <div className="experience-heading">
      <div><h2 id="experience-title">{experience.role}</h2><p className="experience-company">{experience.company}</p></div>
      <p className="experience-dates">{experience.dates}<br />Babol, Iran</p>
    </div>
    <p>My work at MAM spans production ERP development, frontend architecture, shared tooling, and the hardware–software integrations used in industrial operations.</p>
    <dl className="experience-evidence">{experience.highlights.map(item => <div key={item.title}><dt>{item.title}</dt><dd>{item.description}</dd></div>)}</dl>
    <div className="links"><Link href="/work">Explore my professional work →</Link><a href={profile.resume} download>Download résumé (PDF) ↓</a></div>
  </section>;
}
