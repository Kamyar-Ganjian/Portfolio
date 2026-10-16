import MAMGallery from "@/components/MAMGallery";

export default function AboutSection() {
  return (
    <section className="about-section page-width" id="about" aria-labelledby="about-title">
      <header className="content-section-heading">
        <p className="eyebrow">About</p>
        <h2 id="about-title">Software, considered from every side.</h2>
      </header>

      <div className="about-copy">
        <p>
          I’m drawn to the questions around software as much as the interface:
          where responsibility should sit, how shared code earns adoption, and
          what a system must account for when it connects to physical equipment.
          Working across those boundaries keeps engineering grounded in the
          actual problem.
        </p>
        <p>
          I’m a full-stack software engineer with professional frontend
          experience and backend capability in C#/.NET. I hold a B.Sc. in
          Computer Engineering and am pursuing an M.Sc. in Artificial
          Intelligence Engineering at Mazandaran University of Science and
          Technology. AI and machine learning are part of my direction; software
          engineering remains the foundation.
        </p>
      </div>

      <MAMGallery />
    </section>
  );
}
