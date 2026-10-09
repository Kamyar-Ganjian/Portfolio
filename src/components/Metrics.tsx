import { profile } from "@/data/profile";

const outcomes = [
  { value: "25", label: "production applications", note: "across enterprise ERP" },
  { value: "600–1,000", label: "daily active users", note: "in a production environment" },
  { value: "06", label: "shared npm packages", note: "used across the frontend team" },
  { value: "10", label: "industrial integrations", note: "connected to ERP workflows" },
];

export default function Metrics() {
  return (
    <section className="metrics-band" aria-label="Professional work at a glance">
      <div className="metrics-inner section-wrap">
        <p className="eyebrow metrics-label" data-reveal>A little context <span>—</span></p>
        {outcomes.map((item, index) => (
          <div className="metric-item" data-reveal data-reveal-delay={String(index * 60)} key={item.label}>
            <span className="metric-index">0{index + 1}</span>
            <strong>{item.value}</strong>
            <span className="metric-label">{item.label}</span>
            <span className="metric-note">{item.note}</span>
          </div>
        ))}
        <p className="metrics-footnote">Figures from my work at {profile.experience[0].companyShort}</p>
      </div>
    </section>
  );
}
