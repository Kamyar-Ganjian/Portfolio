import { profile } from "@/data/profile";

export default function Contact() {
  return (
    <section className="contact-section" id="contact" data-scroll-section aria-labelledby="contact-title">
      <div className="section-wrap contact-inner">
        <p className="section-kicker" data-reveal><span>13</span> Start a conversation</p>
        <div className="contact-main" data-reveal>
          <h2 id="contact-title">Good work starts<br />with <em>a conversation.</em></h2>
          <div className="contact-details">
            <p>I&apos;m open to software engineering opportunities and thoughtful collaborations — especially work across frontend architecture, full-stack products, and emerging AI applications.</p>
            <a className="contact-email" href={profile.links.email}>{profile.personal.email}<span aria-hidden="true">↗</span></a>
            <a className="contact-phone" href={profile.links.phone}>{profile.personal.phone}</a>
            <p className="contact-location">{profile.personal.location} <span>·</span> Open to relocation</p>
            <p className="contact-languages">{profile.languages.map((language) => `${language.name} / ${language.level}`).join("  ·  ")}</p>
            <nav className="contact-socials" aria-label="Social profiles">
              <a href={profile.links.github} target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>
              <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
              <a href={profile.links.xing} target="_blank" rel="noopener noreferrer">Xing <span aria-hidden="true">↗</span></a>
              <a href={profile.links.x} target="_blank" rel="noopener noreferrer">X <span aria-hidden="true">↗</span></a>
            </nav>
            <a className="resume-link" href={profile.links.resume} download>Download résumé <span aria-hidden="true">↓</span></a>
          </div>
        </div>
        <div className="contact-colophon"><span>FULL-STACK ENGINEERING <i>·</i> FRONTEND ARCHITECTURE <i>·</i> AI &amp; MACHINE LEARNING</span><a href="#hero">Back to top ↑</a></div>
      </div>
    </section>
  );
}
