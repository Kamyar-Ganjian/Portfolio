import { profile } from "@/data/profile";

export default function Hero() {
  return (
    <section className="hero" id="hero" aria-labelledby="hero-title">
      <div className="hero-layout section-wrap">
        <div className="hero-content">
          <div className="hero-kicker"><span className="hero-kicker-dot" />Systems, from interface to infrastructure <i>·</i> Babol, Iran</div>
          <h1 id="hero-title"><span>Building</span><span>systems.</span><span className="hero-title-shift">Exploring</span><span className="hero-title-shift"><em>intelligence.</em></span></h1>
          <div className="hero-bottom">
            <div>
              <p className="hero-role">{profile.personal.name}<span>/</span> Full-Stack Software Engineer</p>
              <p className="hero-focus">Frontend architecture <i>·</i> Connected systems <i>·</i> AI &amp; machine learning</p>
            </div>
            <div className="hero-actions">
              <a className="button button-primary" href="#work">Enter selected work <span aria-hidden="true">↘</span></a>
              <a className="hero-contact-link" href={profile.links.email}>Contact <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </div>

        <aside className="hero-field-index" aria-label="Explore the engineering field">
          <span className="hero-field-index-label">A system, in layers</span>
          <a href="#work"><i>01</i><span>Interfaces</span></a>
          <a href="#architecture"><i>02</i><span>Architecture</span></a>
          <a href="#integration"><i>03</i><span>Physical systems</span></a>
          <a href="#direction"><i>04</i><span>Intelligence</span></a>
          <span className="hero-field-index-foot">SCROLL TO TRAVEL THROUGH THE FIELD</span>
        </aside>
      </div>

      <a className="scroll-indicator" href="#about" aria-label="Scroll to introduction">
        <span>Move through the system</span><i aria-hidden="true" />
      </a>
      <div className="hero-index"><span>KG—001</span><span>PRODUCTION SYSTEMS / FIELD STUDY</span></div>
    </section>
  );
}
