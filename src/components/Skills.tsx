const groups = [
  {
    number: "01",
    title: "Frontend engineering",
    context: "Production foundation",
    description: "Interfaces, application architecture, and shared systems in production.",
    skills: ["React", "Next.js", "TypeScript", "JavaScript", "HTML", "CSS", "Tailwind CSS", "Material UI", "Zustand", "Redux", "TanStack Query", "React Hook Form", "Yup", "Zod"],
    featured: true,
  },
  {
    number: "02",
    title: "Backend, APIs & data",
    context: "Full-stack development",
    description: "A growing practice across application services, API design, authentication, and persistence.",
    skills: ["C#", ".NET", "ASP.NET Core", "Node.js", "REST APIs", "PostgreSQL", "Prisma", "Auth.js", "WebSockets", "SignalR"],
  },
  {
    number: "03",
    title: "AI & machine learning",
    context: "Academic focus · in progress",
    description: "Python and machine learning as part of an M.Sc. in Artificial Intelligence Engineering.",
    skills: ["Python", "Artificial intelligence", "Machine learning"],
  },
  {
    number: "04",
    title: "Architecture & delivery",
    context: "Systems in practice",
    description: "Connecting teams, tools, and independently maintained applications.",
    skills: ["Multi-zone applications", "Reverse-proxy routing", "Feature-sliced design", "Vertical slices", "Shared npm packages", "Git", "Docker", "Kubernetes", "Linux", "CI/CD", "Agile", "Scrum", "Kanban", "Code review"],
  },
];

export default function Skills() {
  return (
    <section className="skills-section section-wrap" id="skills" aria-labelledby="skills-title">
      <div className="section-heading" data-reveal>
        <p className="section-kicker"><span>09</span> Technical toolkit</p>
        <div><h2 id="skills-title">Breadth with<br /><em>a point of view.</em></h2>
          <p className="section-deck">An honest map of where I work in production, where I&apos;m building depth, and what I&apos;m studying.</p>
        </div>
      </div>
      <div className="skills-grid">
        {groups.map((group) => (
          <article className={`skill-group${group.featured ? " skill-group--featured" : ""}`} data-reveal data-reveal-delay={String(Number(group.number) * 65)} key={group.number}>
            <p className="skill-group-top"><span>{group.number} / CAPABILITY</span><span>{group.context}</span></p>
            <h3>{group.title}</h3>
            <p className="skill-description">{group.description}</p>
            <ul className="skill-tags">{group.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
          </article>
        ))}
      </div>
    </section>
  );
}
