export const site = {
  name: "Kamyar Ganjian",
  title: "Software Engineer · Full-Stack Developer",
  location: "Babol, Iran",
  email: "kamyarganjian@gmail.com",
  phone: "+98 939 355 1014",
  phoneHref: "tel:+989393551014",
  github: "https://github.com/Kamyar-Ganjian",
  linkedin: "https://www.linkedin.com/in/kamy-ganj-668201435/",
  resume: "/files/Kamyar_Ganjian_Frontend_engineer_CV.pdf",
  url: "https://kamyar-ganjian-portfolio.vercel.app",
} as const;

export const experienceHighlights = [
  "Migrated a monolithic frontend to Next.js Multi-Zones and multi-repository architecture, enabling independent builds and deployments across 25+ web applications.",
  "Reduced build and deployment scope by 96%, with average zone build times of 8 minutes and deployment impact isolated to a single application.",
  "Developed and improved features across 25+ production React, Next.js, and TypeScript applications serving 600–1,000 daily users across 10+ ERP domains, with REST APIs, state management, and real-time integrations.",
  "Developed 6 shared internal npm packages for reusable components, layouts, icons, and utilities, adopted across 20+ applications by a 5-developer frontend team.",
  "Integrated 10 industrial weighing systems with the ERP platform, implementing device-specific communication protocols and encoding/decoding logic across complex hardware–software interfaces.",
  "Resolved production-critical hardware–software integration issues across a large-scale industrial slaughterhouse and feed factory, with 60 days of on-site troubleshooting in demanding physical and operational environments.",
] as const;

export type ProjectDiagram = {
  slug: string;
  visual: "architecture" | "industrial";
  diagramCaption: string;
};

export const projectDiagrams = {
  frontendPlatform: {
    slug: "frontend-platform",
    visual: "architecture",
    diagramCaption:
      "Simplified view of the documented migration; internal application details are omitted.",
  },
  industrialSystems: {
    slug: "industrial-systems",
    visual: "industrial",
    diagramCaption:
      "Conceptual ERP-to-equipment boundary; device vendors and protocol details are not shown.",
  },
} as const;

export const galleryImages = [
  {
    src: "/mam/slaughterhouse-office.jpg",
    alt: "Office space at MAM",
    caption: "A place to plan the work",
  },
  {
    src: "/mam/conference2.png",
    alt: "A team meeting at MAM",
    caption: "Solving things together",
  },
  {
    src: "/mam/problem-solving.png",
    alt: "Working through a technical problem",
    caption: "Finding the way through",
  },
  {
    src: "/mam/slaughterhouse.png",
    alt: "Production facility corridor and surrounding grounds",
    caption: "The environment behind the software",
  },
  {
    src: "/mam/slaughterhouse-also-again.jpg",
    alt: "Industrial yard at night",
    caption: "On-site after dark",
  },
  {
    src: "/mam/slaughterhouse-again.jpg",
    alt: "Mountain landscape near the work site",
    caption: "A view from the work site",
  },
  {
    src: "/mam/office.png",
    alt: "Moments in and around the office",
    caption: "Day-to-day at MAM",
  },
  {
    src: "/mam/problem-solving-again.jpg",
    alt: "Working at a laptop beside a whiteboard",
    caption: "Working through a challenge",
  },
  {
    src: "/mam/working-late.jpg",
    alt: "Working late at the office",
    caption: "A late finish, shared effort",
  },
] as const;

export const selectedProjects = [
  {
    id: "frontend-platform",
    number: "01",
    category: "Professional · MAM Broiler Integration",
    title: "A frontend platform for independent releases",
    summary:
      "A monolithic frontend served more than 25 ERP applications. I moved the platform to Next.js Multi-Zones and multiple repositories so builds and deployments could be handled independently.",
    contribution: [experienceHighlights[0], experienceHighlights[3]],
    implementation:
      "The migration changed the release boundary at the application level. Alongside it, shared packages for components, layouts, icons, and utilities gave the frontend team reusable building blocks across the portfolio.",
    results: [
      { value: "96%", label: "smaller build and deployment scope" },
      { value: "8 min", label: "average zone build" },
      { value: "6 → 20+", label: "packages adopted across applications" },
    ],
    technologies: ["React", "Next.js Multi-Zones", "TypeScript", "npm"],
    visual: projectDiagrams.frontendPlatform,
    links: [],
  },
  {
    id: "industrial-systems",
    number: "02",
    category: "Professional · MAM Broiler Integration",
    title: "ERP integrations for industrial weighing systems",
    summary:
      "Ten industrial weighing systems needed to communicate with the ERP platform through device-specific protocols and encoding/decoding logic.",
    contribution: [experienceHighlights[4], experienceHighlights[5]],
    implementation:
      "The work crossed from software into factory operations: resolving production-critical hardware–software issues at a large-scale slaughterhouse and feed factory, including 60 days on-site.",
    results: [
      { value: "10", label: "weighing systems integrated" },
      { value: "60 days", label: "on-site troubleshooting" },
    ],
    technologies: ["ERP integration", "Device protocols", "Encoding / decoding"],
    visual: projectDiagrams.industrialSystems,
    links: [],
  },
  {
    id: "keevo",
    number: "03",
    category: "Independent · Full-stack application",
    title: "Keevo · Personal information vault",
    summary:
      "A personal vault for organizing credentials, account details, access notes, and other digital records.",
    contribution:
      "Built authenticated vault flows with per-user ownership checks and server actions for creating, editing, searching, and organizing records.",
    implementation:
      "The app uses Prisma and PostgreSQL for persistence. Sensitive secret and code fields are encrypted on the server with AES-256-GCM before storage.",
    results: [],
    technologies: ["Next.js", "TypeScript", "Auth.js", "Prisma", "PostgreSQL"],
    visual: null,
    links: [
      { label: "Live demo", href: "https://vault-keevo.vercel.app" },
      { label: "Source code", href: "https://github.com/Kamyar-Ganjian/Vault-Keevo" },
    ],
  },
] as const;

export const technicalAreas = [
  {
    label: "Programming languages",
    value: "JavaScript (ES6+), TypeScript, C#, Python",
  },
  {
    label: "Frontend development",
    value:
      "React, Next.js, HTML, CSS, Tailwind CSS, Material UI, TanStack Query, Redux, Zustand, React Hook Form",
  },
  {
    label: "Backend & APIs",
    value: "C#, .NET, ASP.NET Core, REST APIs, WebSockets, Auth.js",
  },
  {
    label: "Databases & persistence",
    value: "PostgreSQL, Prisma",
  },
  {
    label: "Architecture & infrastructure",
    value:
      "Next.js Multi-Zones, component architecture, shared npm packages, Git, Docker, CI/CD",
  },
  {
    label: "AI engineering · academic focus",
    value: "M.Sc. Artificial Intelligence Engineering (in progress)",
  },
] as const;
