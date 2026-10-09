import Link from "next/link";
import SystemNetwork from "@/components/SystemNetwork";
import { profile } from "@/data/profile";

export default function Hero() {
  return (
    <section className="hero" id="hero" aria-labelledby="hero-title">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-layout section-wrap">
        <div className="hero-content">
          <div className="hero-kicker"><span className="hero-kicker-dot" />Independent engineer <i>·</i> Babol, Iran <i>·</i> Open to relocation</div>
          <h1 id="hero-title"><span>Building</span><span>systems.</span><span>Exploring</span><span><em>intelligence.</em></span></h1>
          <div className="hero-bottom">
            <div>
              <p className="hero-role">{profile.personal.name}<span>/</span> Full-Stack Software Engineer</p>
              <p className="hero-focus">Frontend architecture <i>·</i> Backend systems <i>·</i> AI &amp; machine learning</p>
            </div>
            <div className="hero-actions">
              <Link className="button button-primary" href="#work">View selected work <span aria-hidden="true">↘</span></Link>
              <Link className="hero-contact-link" href={profile.links.email}>Contact <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <SystemNetwork />
          <div className="scene-layer-labels" aria-hidden="true">
            {[
              ["01", "Interface"],
              ["02", "Routing"],
              ["03", "APIs"],
              ["04", "Data"],
              ["05", "Intelligence"],
            ].map(([index, label]) => (
              <span key={index}><i>{index}</i>{label}</span>
            ))}
          </div>
          <span className="scene-coordinate scene-coordinate--top">SYSTEMS / FIELD 01</span>
          <span className="scene-coordinate scene-coordinate--bottom">SIGNAL / LIVE</span>
        </div>
      </div>

      <a className="scroll-indicator" href="#about" aria-label="Scroll to introduction">
        <span>Scroll to explore</span><i aria-hidden="true" />
      </a>
      <div className="hero-index"><span>KG—001</span></div>
    </section>
  );
}
