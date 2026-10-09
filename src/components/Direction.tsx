export default function Direction() {
  return (
    <section className="direction-section" id="direction" aria-labelledby="direction-title">
      <div className="section-wrap direction-inner">
        <div className="direction-copy" data-reveal>
          <p className="section-kicker"><span>11</span> What comes next</p>
          <h2 id="direction-title">Better software<br />gets <em>more intelligent.</em></h2>
          <p>
            I&apos;m pursuing a Master&apos;s in Artificial Intelligence Engineering and currently studying machine learning with Python. My interest is in bringing that knowledge into useful applications — connecting sound engineering with genuinely helpful intelligent features.
          </p>
          <p className="direction-footnote">A growing technical direction, grounded in production software experience.</p>
          <a className="text-link" href="#education">My education <span aria-hidden="true">↗</span></a>
        </div>
        <div className="direction-map" role="img" aria-label="An emerging direction from software systems through data and machine learning to intelligent applications" data-reveal data-reveal-delay="130">
          <p className="direction-map-label">A direction in progress</p>
          <div className="direction-path">
            <div className="direction-node direction-node-established"><span>01</span><strong>Software<br />systems</strong><i>Production experience</i></div>
            <span className="direction-edge" aria-hidden="true">→</span>
            <div className="direction-node direction-node-active"><span>02</span><strong>Data &amp;<br />learning</strong><i>M.Sc. · in progress</i></div>
            <span className="direction-edge" aria-hidden="true">→</span>
            <div className="direction-node direction-node-future"><span>03</span><strong>Intelligent<br />applications</strong><i>Area of interest</i></div>
          </div>
          <div className="direction-map-foot"><span>FRONTEND ARCHITECTURE</span><span>PYTHON · MACHINE LEARNING</span><span>APPLIED AI</span></div>
        </div>
      </div>
    </section>
  );
}
