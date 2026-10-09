import Image from "next/image";
import { profile } from "@/data/profile";

export default function About() {
  return (
    <section className="about-section section-wrap" id="about" aria-labelledby="about-title">
      <div className="section-meta" data-reveal><span>01</span><span>Profile / perspective</span></div>
      <div className="about-grid">
        <div className="about-copy" data-reveal>
          <h2 id="about-title">One engineer.<br />More than one <em>layer.</em></h2>
          <p>
            I&apos;m Kamyar — a software engineer with a frontend foundation and a systems mindset. At MAM, I&apos;ve helped evolve enterprise ERP applications used across production, logistics, finance, and other day-to-day operations.
          </p>
          <p>
            That work has brought me from component architecture to real-time systems and integrations with industrial equipment. Now I&apos;m deepening my full-stack practice and pursuing an M.Sc. in Artificial Intelligence Engineering.
          </p>
          <a className="inline-link" href="#experience">See the production work <span aria-hidden="true">↘</span></a>
        </div>

        <div className="about-portrait" data-reveal data-reveal-delay="120">
          <div className="portrait-rails" aria-hidden="true"><span>KG / 01</span><span>FIELD NOTES</span></div>
          <div className="about-photo">
            <Image
              src={profile.assets.profileImage}
              alt="Portrait of Kamyar Ganjian"
              fill
              sizes="(max-width: 760px) 72vw, 370px"
            />
          </div>
          <div className="about-photo-caption"><span>KAMYAR GANJIAN</span><span>SOFTWARE ENGINEER <i>·</i> IRAN</span></div>
        </div>
      </div>

      <div className="about-facts" data-reveal data-reveal-delay="180">
        <div><span>NOW</span><strong>Frontend Engineer <i>@ MAM</i></strong></div>
        <div><span>STUDYING</span><strong>M.Sc. Artificial Intelligence</strong></div>
        <div><span>INTERESTS</span><strong>Systems <i>×</i> intelligent applications</strong></div>
      </div>
    </section>
  );
}
