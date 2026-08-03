"use client";

import { homeContent } from "../home-content";
import { useLang } from "../lang-context";

export default function ProblemPage() {
  const { lang } = useLang();
  const t = homeContent[lang];

  return (
    <section id="problem">
      <div className="section-inner">
        <div className="eyebrow reveal">{t["prob-eyebrow"]}</div>
        <h2 className="reveal" dangerouslySetInnerHTML={{ __html: t["prob-h2"] }} />
        <div className="problem-grid">
          <div className="problem-card reveal">
            <div className="problem-icon">◧</div>
            <h3>{t.p1h}</h3>
            <p>{t.p1p}</p>
          </div>
          <div className="problem-card reveal">
            <div className="problem-icon">◨</div>
            <h3>{t.p2h}</h3>
            <p>{t.p2p}</p>
          </div>
          <div className="problem-card reveal">
            <div className="problem-icon">◩</div>
            <h3>{t.p3h}</h3>
            <p>{t.p3p}</p>
          </div>
          <div className="problem-card reveal">
            <div className="problem-icon">◪</div>
            <h3>{t.p4h}</h3>
            <p>{t.p4p}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
