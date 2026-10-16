import { site } from "@/data/portfolio";

export default function ContactSection() {
  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-title">
      <div className="page-width contact-inner">
        <div>
          <p className="eyebrow">Contact</p>
          <h2 id="contact-title">Have an interesting project in mind?</h2>
          <p className="contact-copy">
            Feel free to reach out to talk about software engineering, full-stack
            products, AI, or a challenging technical problem.
          </p>
          <p className="contact-location">
            {site.location} <span aria-hidden="true">·</span> Open to relocation
          </p>
          <p className="contact-languages">
            Persian · Native <span aria-hidden="true">／</span>
            English · Professional working proficiency <span aria-hidden="true">／</span>
            German · Basic
          </p>
        </div>
        <div className="contact-actions">
          <a className="contact-email" href={`mailto:${site.email}`}>
            {site.email} <span aria-hidden="true">↗</span>
          </a>
          <div className="contact-links">
            <a href={site.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
            <a href={site.github} target="_blank" rel="noreferrer">GitHub ↗</a>
            <a href={site.phoneHref}>{site.phone}</a>
            <a href={site.resume} download>Download résumé ↓</a>
          </div>
        </div>
      </div>
    </section>
  );
}
