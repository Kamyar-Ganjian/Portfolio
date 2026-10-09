import { profile } from "@/data/profile";

export default function Education() {
  return (
    <section className="education-section section-wrap" id="education" data-scroll-section aria-labelledby="education-title">
      <div className="education-heading" data-reveal>
        <p className="section-kicker"><span>10</span> Study &amp; foundations</p>
        <h2 id="education-title">Building the<br /><em>next layer.</em></h2>
        <p>Formal computer engineering, now extending into artificial intelligence.</p>
      </div>
      <div className="education-list">
        {profile.education.map((entry, index) => (
          <article className="education-item" data-reveal data-reveal-delay={String(index * 80)} key={entry.degree}>
            <span className="education-index">0{index + 1}</span>
            <div><p className="education-years">{entry.startYear} — {entry.endYear}</p><h3>{entry.degree}</h3>
              <a href={entry.website} target="_blank" rel="noopener noreferrer">{entry.institution}<span aria-hidden="true"> ↗</span></a>
            </div>
            {index === 0 && <span className="education-current">IN PROGRESS</span>}
          </article>
        ))}
      </div>
    </section>
  );
}
