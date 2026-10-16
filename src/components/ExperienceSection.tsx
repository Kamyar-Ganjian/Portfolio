import { experienceHighlights, site } from "@/data/portfolio";

const selectedHighlights = [
  experienceHighlights[1],
  experienceHighlights[2],
];

export default function ExperienceSection() {
  return (
    <section className="experience-section page-width" id="experience" aria-labelledby="experience-title">
      <header className="content-section-heading">
        <p className="eyebrow">Experience</p>
        <h2 id="experience-title">Production experience</h2>
      </header>

      <article className="experience-entry">
        <div className="experience-entry-heading">
          <div>
            <h3>Frontend Engineer</h3>
            <p className="experience-company">MAM Broiler Integration · {site.location}</p>
          </div>
          <p className="experience-dates">September 2024 — Present</p>
        </div>
        <ul className="experience-highlights">
          {selectedHighlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      </article>
    </section>
  );
}
