"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { homeContent } from "./home-content";
import { useLang } from "./lang-context";

export default function HomePage() {
  const { lang } = useLang();
  const [submitted, setSubmitted] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const bizRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const msgRef = useRef<HTMLTextAreaElement>(null);

  const t = homeContent[lang];

  function submitForm() {
    if (!nameRef.current?.value.trim() && !emailRef.current?.value.trim()) {
      nameRef.current?.focus();
      return;
    }
    setSubmitted(true);
    [nameRef, bizRef, emailRef, phoneRef, msgRef].forEach((r) => {
      if (r.current) r.current.value = "";
    });
  }

  return (
    <>
      {/* HERO */}
      <section id="hero">
        <div className="hero-inner">
          <div className="hero-eyebrow">{t["hero-eyebrow"]}</div>
          <h1 dangerouslySetInnerHTML={{ __html: t["hero-h1"] }} />
          <p className="hero-sub">{t["hero-sub"]}</p>
          <div className="hero-actions">
            <Link href="/audit" className="btn-gold">
              {t["hero-btn1"]}
            </Link>
            <a href="#contact" className="btn-ghost">
              {t["hero-btn2"]}
            </a>
          </div>
          <div className="hero-stats">
            <div>
              <div className="stat-num">10</div>
              <div className="stat-lbl">{t.stat1}</div>
            </div>
            <div>
              <div className="stat-num">2</div>
              <div className="stat-lbl">{t.stat2}</div>
            </div>
            <div>
              <div className="stat-num">5 min</div>
              <div className="stat-lbl">{t.stat3}</div>
            </div>
            <div>
              <div className="stat-num">30 min</div>
              <div className="stat-lbl">{t.stat4}</div>
            </div>
          </div>
        </div>
      </section>

      {/* WHO I HELP */}
      <section id="who">
        <div className="section-inner">
          <div className="eyebrow reveal">{t["who-eyebrow"]}</div>
          <h2 className="reveal">{t["who-h2"]}</h2>
          <p className="section-lead reveal">{t["who-lead"]}</p>
          <div className="who-grid">
            <div className="who-card reveal">
              <div className="who-icon">🪨</div>
              <h3>{t.w1h}</h3>
              <p>{t.w1p}</p>
            </div>
            <div className="who-card reveal">
              <div className="who-icon">🏠</div>
              <h3>{t.w2h}</h3>
              <p>{t.w2p}</p>
            </div>
            <div className="who-card reveal">
              <div className="who-icon">🔨</div>
              <h3>{t.w3h}</h3>
              <p>{t.w3p}</p>
            </div>
            <div className="who-card reveal">
              <div className="who-icon">🌎</div>
              <h3>{t.w4h}</h3>
              <p>{t.w4p}</p>
            </div>
          </div>
        </div>
      </section>

      {/* BILINGUAL */}
      <section id="bilingual">
        <h2>{t["bil-h2"]}</h2>
        <p>{t["bil-p"]}</p>
        <Link href="/audit" className="btn-bilingual">
          {t["bil-btn"]}
        </Link>
      </section>

      {/* AUDIT CTA */}
      <section id="audit-cta">
        <div className="audit-cta-inner">
          <div className="eyebrow reveal">{t["acta-eyebrow"]}</div>
          <h2 className="reveal">{t["acta-h2"]}</h2>
          <p className="reveal">{t["acta-p"]}</p>
          <div className="audit-cta-btns reveal">
            <Link href="/audit" className="btn-dark">
              {t["acta-btn1"]}
            </Link>
            <Link href="/audit?lang=es" className="btn-outline">
              {t["acta-btn2"]}
            </Link>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact">
        <div className="contact-inner">
          <div className="contact-left">
            <div className="eyebrow">{t["con-eyebrow"]}</div>
            <h2>{t["con-h2"]}</h2>
            <p>{t["con-p"]}</p>
            <div className="contact-detail">
              <div className="contact-detail-icon">◈</div>
              <div className="contact-detail-text">
                <b>{t.cd1b}</b>
                <span>{t.cd1t}</span>
              </div>
            </div>
            <div className="contact-detail">
              <div className="contact-detail-icon">◈</div>
              <div className="contact-detail-text">
                <b>{t.cd2b}</b>
                <span>{t.cd2t}</span>
              </div>
            </div>
            <div className="contact-detail">
              <div className="contact-detail-icon">◈</div>
              <div className="contact-detail-text">
                <b>{t.cd3b}</b>
                <span>{t.cd3t}</span>
              </div>
            </div>
            <div className="contact-detail">
              <div className="contact-detail-icon">◈</div>
              <div className="contact-detail-text">
                <b>{t.cd4b}</b>
                <span>{t.cd4t}</span>
              </div>
            </div>
          </div>
          <div className="contact-form-wrap">
            <div className="contact-form">
              <div className="form-row">
                <input ref={nameRef} type="text" placeholder={t["f-name"]} />
                <input ref={bizRef} type="text" placeholder={t["f-biz"]} />
              </div>
              <input ref={emailRef} type="email" placeholder={t["f-email"]} />
              <input ref={phoneRef} type="tel" placeholder={t["f-phone"]} />
              <select defaultValue="">
                <option value="" disabled>
                  {t["f-sel-placeholder"]}
                </option>
                <option>{t["f-o1"]}</option>
                <option>{t["f-o2"]}</option>
                <option>{t["f-o3"]}</option>
                <option>{t["f-o4"]}</option>
                <option>{t["f-o5"]}</option>
              </select>
              <textarea ref={msgRef} placeholder={t["f-msg"]} />
              <button
                className="btn-submit"
                onClick={submitForm}
                disabled={submitted}
                style={submitted ? { background: "#16A34A" } : undefined}
              >
                {submitted ? t["f-sent"] : t["f-btn"]}
              </button>
              <p className="form-note">{t["f-note"]}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
