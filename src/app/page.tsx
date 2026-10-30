import Image from "next/image";
import Link from "next/link";
import portrait from "../../public/images/profile-2.png";
import { profile as p, projects, professionalExperience } from "@/data/site";
import ProjectList from "@/components/ProjectList";
import { getPosts } from "@/lib/blog";

export const metadata = { alternates: { canonical: "/" } };

export default function Home() {
  const posts = getPosts();
  const selected = ["frontend-platform", "industrial-systems", "cv-builder"]
    .map(slug => projects.find(project => project.slug === slug)!);

  return <div className="page-width">
    <section className="hero hero-with-portrait" id="top">
      <div className="hero-copy">
        <p className="eyebrow">BABOL, IRAN · OPEN TO RELOCATION</p>
        <h1>Kamyar Ganjian<span>Full-Stack Engineer</span></h1>
        <p className="hero-description">{p.description}</p>
        <p className="hero-support">Frontend Engineer at MAM Broiler Integration, working across 25+ production applications serving 600–1,000 daily users.</p>
        <div className="actions">
          <Link className="button" href="/work">View work <span aria-hidden="true">↗</span></Link>
          <a className="button secondary" href={`mailto:${p.email}`}>Email me</a>
        </div>
      </div>
      <Image className="hero-portrait" src={portrait} alt="Kamyar Ganjian" width={280} height={320} sizes="(max-width: 600px) 88px, (max-width: 900px) 220px, 280px" preload />
    </section>

    <section id="projects" className="section">
      <div className="section-heading"><div><p className="eyebrow">01 / SELECTED WORK</p><h2>Built for real use.</h2></div><Link href="/work">All work →</Link></div>
      <ProjectList projects={selected} />
    </section>

    <section id="experience" className="section experience-summary">
      <p className="eyebrow">02 / PROFESSIONAL EXPERIENCE</p>
      <div className="experience-heading"><div><h2>{professionalExperience.role}</h2><p className="experience-company">{professionalExperience.company}</p></div><p className="experience-dates">{professionalExperience.dates}<br />Babol, Iran</p></div>
      <p>Building and maintaining production ERP software across 10+ domains, from application architecture and shared tooling to the equipment used on the factory floor.</p>
      <dl className="experience-evidence">{professionalExperience.highlights.map(item => <div key={item.title}><dt>{item.title}</dt><dd>{item.description}</dd></div>)}</dl>
      <div className="links"><Link href="/about#experience">Full experience & background →</Link><a href={p.resume} download>Download résumé (PDF) ↓</a></div>
    </section>
    <div className="home-background-links"><Link id="about" href="/about">About Kamyar →</Link><Link id="blogs" href="/blog">Engineering notes →</Link></div>
    {posts.length > 0 && <section className="section"><h2>Latest writing</h2>{posts.slice(0, 3).map(post => <p key={post.slug}><Link href={`/blog/${post.slug}`}>{post.title}</Link></p>)}</section>}
  </div>;
}
