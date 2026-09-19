"use client";

import type { IconType } from "react-icons";
import {
  FiActivity,
  FiBox,
  FiColumns,
  FiGitBranch,
  FiGitPullRequest,
  FiGrid,
  FiLayout,
  FiLayers,
  FiPackage,
  FiRadio,
  FiServer,
  FiZap,
  FiCheckSquare,
} from "react-icons/fi";
import {
  SiCss,
  SiDocker,
  SiGit,
  SiHtml5,
  SiJavascript,
  SiLinux,
  SiMui,
  SiNextdotjs,
  SiPython,
  SiReact,
  SiReacthookform,
  SiRedux,
  SiTailwindcss,
  SiTypescript,
  SiZod,
} from "react-icons/si";
import Reveal from "@/components/Reveal";
import { profile } from "@/data/profile";

type SkillGroup = {
  label: string;
  items: readonly string[];
};

const SKILL_ICONS: Record<string, IconType> = {
  JavaScript: SiJavascript,
  TypeScript: SiTypescript,
  Python: SiPython,
  React: SiReact,
  "Next.js": SiNextdotjs,
  HTML: SiHtml5,
  CSS: SiCss,
  "Material UI": SiMui,
  "Tailwind CSS": SiTailwindcss,
  "TanStack React Query": FiActivity,
  Redux: SiRedux,
  Zustand: FiBox,
  "React Hook Form": SiReacthookform,
  Yup: FiCheckSquare,
  Zod: SiZod,
  "REST APIs": FiServer,
  WebSockets: FiRadio,
  SignalR: FiZap,
  "Multi-zone Applications": FiGrid,
  "Multi-repository Architecture": FiGitBranch,
  "Feature-Sliced Design": FiLayout,
  "Vertical Slice Architecture": FiLayers,
  "Component Architecture": FiBox,
  "Shared Package Development": FiPackage,
  Agile: FiZap,
  Scrum: FiActivity,
  Kanban: FiColumns,
  "Code Review": FiGitPullRequest,
  Git: SiGit,
  Docker: SiDocker,
  Linux: SiLinux,
};

function SkillChip({ name }: { name: string }) {
  const Icon = SKILL_ICONS[name] ?? FiBox;
  return (
    <li
      className="chip chip-hover text-sm"
      title={SKILL_ICONS[name] ? undefined : name}
    >
      <Icon className="shrink-0 text-zinc-500" aria-hidden="true" />
      <span>{name}</span>
    </li>
  );
}

function SkillGroupBlock({ group }: { group: SkillGroup }) {
  return (
    <div>
      <h4 className="font-mono text-xs uppercase tracking-widest text-zinc-500">
        {group.label}
      </h4>
      <ul className="mt-3 flex flex-wrap gap-2">
        {group.items.map((item) => (
          <SkillChip key={item} name={item} />
        ))}
      </ul>
    </div>
  );
}

export default function Skills() {
  const skills = profile.skills;

  const groups: SkillGroup[] = [
    { label: "Languages", items: skills.languages },
    { label: "Frontend", items: skills.frontend },
    { label: "State & Data", items: skills.stateAndData },
    { label: "Forms & Validation", items: skills.formsAndValidation },
    { label: "APIs", items: skills.apis },
    { label: "Architecture", items: skills.architecture },
    { label: "Practices", items: skills.practices },
    { label: "Tools & DevOps", items: skills.toolsAndDevOps },
  ];

  return (
    <section id="skills" className="relative border-t border-zinc-800/70 py-24 md:py-32">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-8">
        <Reveal>
          <p className="mb-3 font-mono text-sm uppercase tracking-widest text-accent">
            04 / Skills
          </p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Technical skills
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-5 max-w-2xl leading-relaxed text-zinc-400">
            Technologies and practices I use across frontend development,
            state management, architecture, and delivery.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-x-10 gap-y-10 md:grid-cols-2">
          {groups.map((group, i) => (
            <Reveal key={group.label} delay={0.05 * i}>
              <SkillGroupBlock group={group} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}