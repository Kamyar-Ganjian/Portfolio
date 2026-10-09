import { profile } from "@/data/profile";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="section-wrap footer-inner">
        <span>© {new Date().getFullYear()} {profile.personal.name}</span>
        <span>Designed &amp; built with care <i>·</i> Next.js / TypeScript</span>
        <a href="#hero">KG <span aria-hidden="true">↑</span></a>
      </div>
    </footer>
  );
}
