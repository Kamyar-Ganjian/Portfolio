import { site } from "@/data/portfolio";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-width footer-inner">
        <p>© {new Date().getFullYear()} {site.name}</p>
        <nav aria-label="Professional profiles">
          <a href={site.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={site.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        </nav>
        <a className="back-to-top" href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}
