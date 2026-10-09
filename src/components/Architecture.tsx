export default function Architecture() {
  return (
    <section className="architecture-section" id="architecture" data-scroll-section aria-labelledby="architecture-title">
      <div className="section-wrap architecture-inner">
        <div className="architecture-intro" data-reveal>
          <p className="section-kicker"><span>04</span> Systems thinking</p>
          <h2 id="architecture-title">One platform.<br /><em>Many independent parts.</em></h2>
          <p>
            I contributed to evolving a monolithic frontend into a multi-zone, multi-repository setup. Reverse-proxy routing connects independently organized applications, while shared packages carry common UI and utilities across the system.
          </p>
          <p className="architecture-aside">A change in structure, shaped around business capabilities and shared ownership.</p>
        </div>
        <div className="architecture-visual" data-reveal data-reveal-delay="130">
          <div className="architecture-topline"><span>APPLICATION MAP</span><span>NOT TO SCALE</span></div>
          <div className="architecture-flow">
            <div className="architecture-origin"><span>01 / ORIGIN</span><strong>Monolithic<br />frontend</strong></div>
            <div className="architecture-connector"><i /><i /><i /><span>reverse-proxy routing</span></div>
            <div className="architecture-zones">
              <span className="architecture-zone-label">02 / MULTI-ZONE APPS</span>
              <div className="zone-node">PRODUCTION</div>
              <div className="zone-node">LOGISTICS</div>
              <div className="zone-node">FINANCE</div>
              <div className="zone-node zone-node-more">+ business domains</div>
            </div>
          </div>
          <div className="architecture-footer"><span>03 / MULTI-REPOSITORY</span><span>04 / SHARED PACKAGES</span><span>05 / VERTICAL SLICES</span></div>
        </div>
      </div>
    </section>
  );
}
