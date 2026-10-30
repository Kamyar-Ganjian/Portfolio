import Image from "next/image";
import Link from "next/link";
import portrait from "../../public/images/profile-2.png";
import { profile as p, professionalProjects } from "@/data/site";
import ProfessionalExperience from "@/components/ProfessionalExperience";
import ProjectList from "@/components/ProjectList";
import { getPosts } from "@/lib/blog";

export const metadata = { alternates: { canonical: "/" } };

export default function Home() {
  const posts = getPosts();


  return <div className="page-width">
    <section className="hero hero-with-portrait" id="top">
      <div className="hero-copy">
        <p className="eyebrow">BABOL, IRAN · OPEN TO RELOCATION</p>
        <h1>Kamyar Ganjian<span>Full-Stack Engineer</span></h1>
        <p className="hero-description">{p.description}</p>
        <p className="hero-support">Frontend Engineer at MAM Broiler Integration, working across 25+ production applications serving 600–1,000 daily users.</p>
        <div className="actions">
          <Link className="button" href="#experience">Professional experience <span aria-hidden="true">↗</span></Link>
          <a className="button secondary" href={`mailto:${p.email}`}>Email me</a>
        </div>
      </div>
      <Image className="hero-portrait" src={portrait} alt="Kamyar Ganjian" width={280} height={280} sizes="(max-width: 600px) 88px, (max-width: 900px) 220px, 280px" preload />
    </section>

    <ProfessionalExperience />
    <section id="projects" className="section" aria-labelledby="professional-work-title">
      <div className="section-heading"><div><p className="eyebrow">02 / WORK AT MAM</p><h2 id="professional-work-title">Production engineering, in detail.</h2></div><Link href="/work">All work →</Link></div>
      <ProjectList projects={professionalProjects} />
    </section>
    <aside className="personal-work-note"><h2>Outside my professional work</h2><p>I also build independent applications to explore ideas and develop my skills.</p><Link href="/work#personal-projects">Explore personal projects →</Link></aside>
    <div className="home-background-links"><Link id="about" href="/about">About Kamyar →</Link><Link id="blogs" href="/blog">Engineering notes →</Link></div>
    {posts.length > 0 && <section className="section"><h2>Latest writing</h2>{posts.slice(0, 3).map(post => <p key={post.slug}><Link href={`/blog/${post.slug}`}>{post.title}</Link></p>)}</section>}
  </div>;
}
