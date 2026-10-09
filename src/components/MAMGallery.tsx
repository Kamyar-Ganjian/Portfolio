import Image from "next/image";

const images = [
  { src: "/mam/slaughterhouse-office.jpg", alt: "Office space at MAM", caption: "A place to plan the work" },
  { src: "/mam/conference2.png", alt: "A team meeting at MAM", caption: "Solving things together" },
  { src: "/mam/problem-solving.png", alt: "Working through a technical problem", caption: "Finding the way through" },
  { src: "/mam/slaughterhouse.png", alt: "Production facility corridor and surrounding grounds", caption: "The environment behind the software" },
  { src: "/mam/slaughterhouse-also-again.jpg", alt: "Industrial yard at night", caption: "On-site after dark" },
  { src: "/mam/slaughterhouse-again.jpg", alt: "Mountain landscape near the work site", caption: "A view from the work site" },
  { src: "/mam/office.png", alt: "Moments in and around the office", caption: "Day-to-day at MAM" },
  { src: "/mam/problem-solving-again.jpg", alt: "Working at a laptop beside a whiteboard", caption: "Working through a challenge" },
  { src: "/mam/working-late.jpg", alt: "Working late at the office", caption: "A late finish, shared effort" },
];

export default function MAMGallery() {
  return (
    <section className="gallery-section" aria-labelledby="gallery-title">
      <div className="section-wrap">
        <div className="gallery-heading" data-reveal>
          <p className="section-kicker"><span>08</span> The people and places</p>
          <div><h2 id="gallery-title">More than<br /><em>the workplace.</em></h2>
            <p>A few memories from the places I worked, the problems we solved, and the people I shared the journey with. The friendships made along the way matter just as much as the work.</p>
          </div>
        </div>
        <div className="gallery-strip" role="region" aria-label="Memories from working at MAM" tabIndex={0}>
          {images.map((image, index) => (
            <figure className="gallery-frame" data-reveal data-reveal-delay={String(index * 25)} key={image.src}>
              <div className="gallery-image"><Image src={image.src} alt={image.alt} fill sizes="(max-width: 650px) 78vw, (max-width: 1000px) 42vw, 29vw" loading="lazy" /></div>
              <figcaption><span>0{index + 1} / 09</span>{image.caption}</figcaption>
            </figure>
          ))}
        </div>
        <p className="gallery-scroll-hint">Scroll to see more <span aria-hidden="true">→</span></p>
      </div>
    </section>
  );
}
