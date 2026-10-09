import { profile } from "@/data/profile";

export default function SharedPackages() {
  return (
    <section className="packages-section section-wrap" id="packages" data-scroll-section aria-labelledby="packages-title">
      <div className="packages-heading" data-reveal>
        <p className="section-kicker"><span>07</span> Shared foundations</p>
        <div><h2 id="packages-title">Build once.<br /><em>Make it useful everywhere.</em></h2>
          <p>Six internal npm packages turned repeated interface patterns into shared tools for the frontend team.</p>
        </div>
      </div>
      <div className="packages-board" data-reveal data-reveal-delay="120">
        <div className="packages-board-head"><span>INTERNAL NPM PACKAGES</span><span>SHARED BY 5 FRONTEND DEVELOPERS</span></div>
        <ul>{profile.sharedPackages.map((name, index) => <li key={name}><span className="package-number">0{index + 1}</span><span className="package-name">{name}</span><span className="package-kind">{["UI", "LAYOUT", "ICONS", "UTILS", "CORE", "SHARED"][index]}</span></li>)}</ul>
        <div className="packages-board-foot"><span>REUSABLE BY DESIGN</span><span>PRIVATE REGISTRY <i aria-hidden="true">↗</i></span></div>
      </div>
    </section>
  );
}
