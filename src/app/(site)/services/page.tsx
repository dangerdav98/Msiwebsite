"use client";

import { homeContent } from "../home-content";
import { useLang } from "../lang-context";

export default function ServicesPage() {
  const { lang } = useLang();
  const t = homeContent[lang];

  return (
    <section id="services">
      <div className="section-inner">
        <div className="eyebrow reveal">{t["svc-eyebrow"]}</div>
        <h2 className="reveal">{t["svc-h2"]}</h2>
        <p className="section-lead reveal">{t["svc-lead"]}</p>
        <div className="services-grid">
          <div className="service-card reveal">
            <div className="service-num">01</div>
            <h3>{t.s1h}</h3>
            <p>{t.s1p}</p>
            <div className="service-tags">
              <span className="tag">{t.s1t1}</span>
              <span className="tag">{t.s1t2}</span>
              <span className="tag">{t.s1t3}</span>
            </div>
          </div>
          <div className="service-card reveal">
            <div className="service-num">02</div>
            <h3>{t.s2h}</h3>
            <p>{t.s2p}</p>
            <div className="service-tags">
              <span className="tag">Google Ads</span>
              <span className="tag">Meta Ads</span>
              <span className="tag">SEO</span>
              <span className="tag">Website</span>
            </div>
          </div>
          <div className="service-card reveal">
            <div className="service-num">03</div>
            <h3>{t.s3h}</h3>
            <p>{t.s3p}</p>
            <div className="service-tags">
              <span className="tag">{t.s3t1}</span>
              <span className="tag">{t.s3t2}</span>
              <span className="tag">{t.s3t3}</span>
            </div>
          </div>
          <div className="service-card reveal">
            <div className="service-num">04</div>
            <h3>{t.s4h}</h3>
            <p>{t.s4p}</p>
            <div className="service-tags">
              <span className="tag">{t.s4t1}</span>
              <span className="tag">{t.s4t2}</span>
              <span className="tag">{t.s4t3}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
