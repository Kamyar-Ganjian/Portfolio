import type { ProjectDiagram } from "@/data/portfolio";

export default function CaseStudyVisual({ study }: { study: ProjectDiagram }) {
  if (study.visual === "architecture") {
    return (
      <figure className="case-visual" aria-labelledby={`${study.slug}-visual-caption`}>
        <p className="diagram-label">DOCUMENTED ARCHITECTURE CHANGE</p>
        <div
          className="architecture-diagram"
          role="img"
          aria-label="A monolithic frontend leads to a multi-zone, multi-repository architecture supporting more than 25 web applications."
        >
          <div className="diagram-node diagram-origin">
            <span>BEFORE</span>
            <strong>Monolithic<br />frontend</strong>
          </div>
          <div className="diagram-connector" aria-hidden="true">
            <span>Next.js Multi-Zones</span>
            <i />
          </div>
          <div className="diagram-node diagram-destinations">
            <span>AFTER · MULTI-REPOSITORY</span>
            <strong>25+ applications</strong>
            <div className="app-units" aria-hidden="true">
              {Array.from({ length: 12 }, (_, index) => (
                <i key={index} />
              ))}
            </div>
            <small>Independent builds &amp; deployments</small>
          </div>
        </div>
        <figcaption id={`${study.slug}-visual-caption`}>{study.diagramCaption}</figcaption>
      </figure>
    );
  }

  return (
    <figure className="case-visual" aria-labelledby={`${study.slug}-visual-caption`}>
      <p className="diagram-label">ERP ↔ INDUSTRIAL EQUIPMENT</p>
      <div
        className="industrial-diagram"
        role="img"
          aria-label="An ERP platform connected to ten industrial weighing systems through device-specific communication and encoding logic."
        >
        <div className="erp-node">
          <span>BUSINESS SOFTWARE</span>
          <strong>ERP platform</strong>
        </div>
        <div className="industrial-link">
          <span>Device-specific protocols<br />Encoding / decoding</span>
          <i />
        </div>
          <div className="scale-grid" aria-hidden="true">
            {Array.from({ length: 10 }, (_, index) => (
              <span key={index} />
            ))}
        </div>
        <p>10 industrial weighing systems</p>
      </div>
      <figcaption id={`${study.slug}-visual-caption`}>{study.diagramCaption}</figcaption>
    </figure>
  );
}
