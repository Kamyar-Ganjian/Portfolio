import { technicalAreas } from "@/data/portfolio";

export default function SkillsSection() {
  return (
    <section className="skills-section" id="skills" aria-labelledby="skills-title">
      <header className="content-section-heading">
        <p className="eyebrow">Skills</p>
        <div>
          <h2 id="skills-title">A practical technical toolkit</h2>
          <p>Grouped by the work and systems I use them in.</p>
        </div>
      </header>

      <dl className="skills-grid">
        {technicalAreas.map((area) => (
          <div className="skill-group" key={area.label}>
            <dt>{area.label}</dt>
            <dd>{area.value}</dd>
          </div>
        ))}
      </dl>
      <p className="spoken-languages">
        <strong>Languages</strong>
        Persian · Native <span aria-hidden="true">／</span>
        English · Professional working proficiency <span aria-hidden="true">／</span>
        German · Basic
      </p>
    </section>
  );
}
