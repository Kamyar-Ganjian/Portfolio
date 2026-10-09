import { profile } from "@/data/profile";

export default function ErpDomains() {
  const domains = profile.experience[0].erpDomains;

  return (
    <section className="erp-domains" aria-labelledby="erp-domains-title">
      <div className="section-wrap">
        <div className="erp-domains-heading" data-reveal>
          <div><p className="section-kicker"><span>05</span> Business domains</p><h2 id="erp-domains-title">A connected enterprise.</h2></div>
          <p>Applications supporting the breadth of day-to-day business operations.</p>
        </div>
        <ul className="erp-domain-list">{domains.map((domain, index) => <li data-reveal data-reveal-delay={String(index * 35)} key={domain}><span>0{index + 1}</span>{domain}</li>)}</ul>
      </div>
    </section>
  );
}
