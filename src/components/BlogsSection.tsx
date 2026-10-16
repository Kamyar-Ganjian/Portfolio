export default function BlogsSection() {
  return (
    <section className="blogs-section page-width" id="blogs" aria-labelledby="blogs-title">
      <header className="content-section-heading">
        <p className="eyebrow">Blog</p>
        <div>
          <h2 id="blogs-title">Writing</h2>
          <p>Technical notes on software engineering, systems, and AI.</p>
        </div>
      </header>
      <p className="blog-empty-state">No articles published yet.</p>
    </section>
  );
}
