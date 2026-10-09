import { profile } from "@/data/profile";

export default function IndustrialIntegration() {
  const integration = profile.industrialIntegration;

  return (
    <section className="integration-section section-wrap" id="integration" data-scroll-section aria-labelledby="integration-title">
      <div className="integration-count" data-reveal><span>CONNECTED TO ERP</span><strong>×{integration.count}</strong><span>INDUSTRIAL SCALES</span></div>
      <div className="integration-copy" data-reveal data-reveal-delay="90">
        <p className="section-kicker"><span>06</span> Beyond the browser</p>
        <h2 id="integration-title">Software meets<br /><em>the physical world.</em></h2>
        <p>I integrated industrial weighing systems with an ERP platform: working through device-specific communication protocols, data encodings, and connectivity in production environments.</p>
        <p>That meant stepping beyond the screen. I spent 60 days on-site diagnosing hardware/software integration problems and resolving production issues alongside the people who use the systems.</p>
        <ul className="integration-tags">{integration.aspects.map((aspect) => <li key={aspect}>{aspect}</li>)}</ul>
      </div>
      <blockquote className="integration-note" data-reveal data-reveal-delay="170"><span className="quote-mark">“</span><p>Reliable software depends on understanding the system it has to work in.</p><cite>FIELD NOTES <span>·</span> 60 DAYS ON-SITE</cite></blockquote>
    </section>
  );
}
