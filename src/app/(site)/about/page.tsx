"use client";

import { homeContent } from "../home-content";
import { useLang } from "../lang-context";

export default function AboutPage() {
  const { lang } = useLang();
  const t = homeContent[lang];

  return (
    <section id="about">
      <div className="about-inner">
        <div>
          <div className="eyebrow reveal">{t["about-eyebrow"]}</div>
          <h2 className="reveal">{t["about-h2"]}</h2>
          <p className="section-lead reveal">{t["about-lead"]}</p>
          <ul className="cred-list reveal">
            <li>{t.c1}</li>
            <li>{t.c2}</li>
            <li>{t.c3}</li>
            <li>{t.c4}</li>
            <li>{t.c5}</li>
            <li>{t.c6}</li>
          </ul>
        </div>
        <div className="quote-block reveal">
          <div className="quote-text">{t["quote-text"]}</div>
          <div className="quote-attr">{t["quote-attr"]}</div>
          <div className="quote-body">{t["quote-body"]}</div>
        </div>
      </div>
    </section>
  );
}
