import { site } from "@/data/portfolio";

const links = [
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export default function Navigation() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="site-header">
        <div className="header-inner">
          <a className="wordmark" href="#top" aria-label="Kamyar Ganjian home">
            <span className="wordmark-mark" aria-hidden="true">
              KG
            </span>
            <span>Kamyar Ganjian</span>
          </a>

          <nav className="desktop-nav" aria-label="Main navigation">
            {links.map((link) => (
              <a href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          <a className="header-resume" href={site.resume} download>
            Résumé <span aria-hidden="true">↓</span>
          </a>

          <details className="mobile-nav">
            <summary>Menu</summary>
            <nav aria-label="Mobile navigation">
              {links.map((link) => (
                <a href={link.href} key={link.href}>
                  {link.label}
                </a>
              ))}
            </nav>
          </details>
        </div>
      </header>
    </>
  );
}
