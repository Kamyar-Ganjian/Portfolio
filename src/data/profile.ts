export const profile = {
  personal: {
    name: "Kamyar Ganjian",
    title: "Frontend Engineer",
    specialization: ["React", "Next.js", "TypeScript"],
    location: "Babol, Iran",
    openToRelocation: true,
    relocationDestination: "",
    email: "kamyarganjian@gmail.com",
    phone: "+98 939 355 1014",
  },

  links: {
    github: "https://github.com/Kamyar-Ganjian",
    linkedin:
      "https://www.linkedin.com/in/kamy-ganj-668201435/?utm_source=chatgpt.com",
    xing: "https://www.xing.com/profile/Kamyar_Ganjian/web_profiles?nwt_nav=profile_icon",
    x: "https://x.com/KamyarGanjia",
    email: "mailto:kamyarganjian@gmail.com",
    phone: "tel:+989393551014",
    portfolio: "/",
    resume: "/files/Kamyar_Ganjian_Frontend_engineer_CV.pdf",
  },

  assets: {
    profileImage: "/images/profile-2.png",
    companyLogo: "/images/mam.png",
    universityLogo: "/images/university.png",
    githubLogo: "/images/github.png",
    linkedinLogo: "/images/linkedin.png",
    xingLogo: "/images/xing.png",
  },

  summary: {
    short:
      "Dedicated Frontend Engineer with 2 years of experience building and optimizing 25 high-performing production applications using React, Next.js, and TypeScript, serving 600–1,000 daily active users in enterprise environments.",
    about:
      "I work as a Frontend Engineer at MAM, developing and maintaining enterprise ERP applications with React, Next.js, and TypeScript. I helped migrate the frontend from a monolithic application to a multi-zone, multi-repository architecture, and my work includes shared frontend packages, real-time functionality, data-intensive interfaces, and integrations with industrial weighing systems. I'm currently pursuing a Master's in Artificial Intelligence Engineering and exploring the intersection of frontend development and AI.",
  },

  metrics: {
    eyebrow: "The numbers behind the work",
    groups: [
      {
        id: "product-scale",
        title: "Product Scale",
        icon: "scale",
        accent: false,
        footnote: "Real production software used across a large enterprise.",
        metrics: [
          {
            value: 25,
            prefix: "",
            suffix: "",
            range: "",
            label: "Production applications",
            description:
              "React, Next.js, and TypeScript across multiple ERP domains.",
          },
          {
            value: 600,
            prefix: "",
            suffix: "+",
            range: "600–1,000",
            label: "Daily active users",
            description:
              "Production software used across enterprise operations.",
          },
        ],
      },
      {
        id: "infrastructure",
        title: "Engineering Infrastructure",
        icon: "infrastructure",
        accent: false,
        footnote: "Reusable packages used across the team's projects.",
        metrics: [
          {
            value: 6,
            prefix: "",
            suffix: "",
            range: "",
            label: "Shared frontend packages",
            description: "Reusable components, layouts, icons, and utilities.",
          },
          {
            value: 5,
            prefix: "",
            suffix: "",
            range: "",
            label: "Frontend developers",
            description: "Shared frontend infrastructure used across the team.",
          },
        ],
      },
      {
        id: "industrial",
        title: "Industrial Engineering",
        icon: "industrial",
        accent: true,
        footnote: "Weighing systems in production environments.",
        metrics: [
          {
            value: 10,
            prefix: "",
            suffix: "",
            range: "",
            label: "Industrial integrations",
            description:
              "ERP-connected weighing systems with varied protocols and data formats.",
          },
          {
            value: 60,
            prefix: "",
            suffix: "",
            range: "",
            label: "Days on-site",
            description: "Industrial troubleshooting and integration work.",
          },
        ],
      },
    ],
  },

  experience: [
    {
      company: "MAM — Morgh Ajdad Mazandaran",
      companyShort: "MAM",
      website: "https://mamco.ir/en/",
      role: "Frontend Engineer",
      location: "Babol, Iran",
      startDate: "09/2024",
      endDate: "Present",
      highlights: [
        "Migrated the frontend from a monolithic application to a multi-zone, multi-repository architecture, implementing reverse-proxy routing and shared infrastructure across multiple enterprise applications while adopting vertical slice architecture to organize features around business capabilities.",
        "Developed and maintained 25 production applications using React, Next.js, and TypeScript across ERP domains including production, slaughterhouse operations, logistics, farming, finance, procurement, HR, commerce, and user management.",
        "Developed 6 shared internal NPM packages for reusable components, layouts, icons, utilities, and common functionality — adopted across projects by 5 frontend developers.",
        "Integrated 10 industrial weighing systems with the ERP platform, handling device-specific communication protocols, encoding requirements, and production connectivity issues.",
        "Spent 60 days on-site at industrial facilities, diagnosing hardware/software integration issues and resolving production-critical problems with minimal disruption.",
        "Built data-intensive enterprise interfaces including complex tables, forms, dashboards, charts, timelines, and printing workflows.",
        "Implemented real-time functionality using WebSockets and SignalR for live data synchronization across enterprise applications.",
        "Contributed across the full delivery lifecycle including Docker/Kubernetes deployments, CI/CD, Linux environments, production troubleshooting, and collaboration with backend and operations teams.",
      ],
      erpDomains: [
        "Production",
        "Slaughterhouse Operations",
        "Logistics",
        "Farming",
        "Finance",
        "Procurement",
        "HR",
        "Commerce",
        "User Management",
      ],
    },
  ],

  architecture: {
    steps: [
      "Monolithic Frontend",
      "Multi-Zone Architecture",
      "Multi-Repository Architecture",
      "Reverse-Proxy Routing",
      "Shared Infrastructure",
      "Vertical Slice Architecture",
      "25 Enterprise Applications",
    ],
  },

  sharedPackages: [
    "Reusable Components",
    "Shared Layouts",
    "Shared Icons",
    "Shared Utilities",
    "Common Functionality",
    "Enterprise Packages",
  ],

  industrialIntegration: {
    title: "Industrial Weighing Systems",
    count: 10,
    aspects: [
      "Device Communication Protocols",
      "Encoding Requirements",
      "Production Connectivity",
      "Hardware/Software Troubleshooting",
      "On-Site Industrial Work",
    ],
  },

  skills: {
    languages: ["JavaScript", "TypeScript", "Python"],
    frontend: [
      "React",
      "Next.js",
      "HTML",
      "CSS",
      "Material UI",
      "Tailwind CSS",
    ],
    stateAndData: ["TanStack React Query", "Redux", "Zustand"],
    formsAndValidation: ["React Hook Form", "Yup", "Zod"],
    apis: ["REST APIs", "WebSockets", "SignalR"],
    architecture: [
      "Multi-zone Applications",
      "Multi-repository Architecture",
      "Feature-Sliced Design",
      "Vertical Slice Architecture",
      "Component Architecture",
      "Shared Package Development",
    ],
    practices: ["Agile", "Scrum", "Kanban", "Code Review"],
    toolsAndDevOps: ["Git", "Docker", "Linux"],
  },

  education: [
    {
      degree: "Master of Science in Artificial Intelligence Engineering",
      institution: "Mazandaran University of Science and Technology",
      website: "https://www.ustmb.ac.ir/En/",
      startYear: "2025",
      endYear: "Present",
      logo: "/images/university.png",
    },
    {
      degree: "Bachelor of Science in Computer Engineering",
      institution: "Mazandaran University of Science and Technology",
      website: "https://www.ustmb.ac.ir/En/",
      startYear: "2021",
      endYear: "2025",
      logo: "/images/university.png",
    },
  ],

  courses: [
    {
      title: "Complete React.js + Next.js + Redux",
      provider: "Udemy / Maktabkhooneh",
      url: "https://maktabkhooneh.org/course/%D8%A2%D9%85%D9%88%D8%B2%D8%B4-%D8%AC%D8%A7%D9%85%D8%B9-%D8%B1%DB%8C-%D8%A7%DA%A9%D8%AA-%D9%86%DA%A9%D8%B3%D8%AA-%D8%AC%DB%8C-%D8%A7%D8%B3-mk14420/",
      status: "completed" as const,
      logo: "/images/udemy-2.png",
    },
    {
      title: "JavaScript — Beginner to Advanced",
      provider: "Sabzlearn",
      url: "https://sabzlearn.ir/course/java-script-zero-to-hero/",
      status: "completed" as const,
      logo: "/images/sabzlearn-2.png",
    },
    {
      title: "Practical TypeScript",
      provider: "Sabzlearn",
      url: "https://sabzlearn.ir/course/typescript/",
      status: "completed" as const,
      logo: "/images/sabzlearn-2.png",
    },
    {
      title: "Professional Tech Lead Training",
      provider: "Maktabkhooneh",
      url: "https://maktabkhooneh.org/course/%D8%AF%D9%88%D8%B1%D9%87-%D8%A2%D9%85%D9%88%D8%B2%D8%B4%DB%8C-%D8%AA%DA%A9-%D9%84%DB%8C%D8%AF-%D8%AD%D8%B1%D9%81%D9%87-%D8%A7%DB%8C-mk15577",
      status: "completed" as const,
      logo: "/images/maktabkhooneh.png",
    },
    {
      title: "Machine Learning A-Z: AI, Python",
      provider: "Udemy / Maktabkhooneh",
      url: "https://maktabkhooneh.org/course/%DB%8C%D8%A7%D8%AF%DA%AF%DB%8C%D8%B1%DB%8C-%D9%85%D8%A7%D8%B4%DB%8C%D9%86-%D8%B5%D9%81%D8%B1-%D8%B5%D8%AF-%D9%87%D9%88%D8%B4-%D9%85%D8%B5%D9%86%D9%88%D8%B9%DB%8C-%D9%BE%D8%A7%DB%8C%D8%AA%D8%A7%D9%86-r-chat-gpt-mk12531",
      status: "ongoing" as const,
      logo: "/images/udemy-2.png",
    },
  ],

  languages: [
    { name: "Persian", level: "Native" },
    { name: "English", level: "Professional Working Proficiency" },
  ],

  nav: [
    { label: "About", href: "#about" },
    { label: "Experience", href: "#experience" },
    { label: "Architecture", href: "#architecture" },
    { label: "Skills", href: "#skills" },
    { label: "Education", href: "#education" },
    { label: "Contact", href: "#contact" },
  ],
} as const;

export type Profile = typeof profile;
