"use client";

import { homeContent } from "../home-content";
import { useLang } from "../lang-context";

export default function HowItWorksPage() {
  const { lang } = useLang();
  const t = homeContent[lang];

  return (
    <section id="process">
      <div className="process-inner">
        <div className="eyebrow reveal">{t["proc-eyebrow"]}</div>
        <h2 className="reveal">{t["proc-h2"]}</h2>
        <div className="process-steps">
          <div className="process-step reveal">
            <div className="step-num">1</div>
            <div className="step-content">
              <h3>{t.pr1h}</h3>
              <p>{t.pr1p}</p>
            </div>
          </div>
          <div className="process-step reveal">
            <div className="step-num">2</div>
            <div className="step-content">
              <h3>{t.pr2h}</h3>
              <p>{t.pr2p}</p>
            </div>
          </div>
          <div className="process-step reveal">
            <div className="step-num">3</div>
            <div className="step-content">
              <h3>{t.pr3h}</h3>
              <p>{t.pr3p}</p>
            </div>
          </div>
          <div className="process-step reveal">
            <div className="step-num">4</div>
            <div className="step-content">
              <h3>{t.pr4h}</h3>
              <p>{t.pr4p}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
