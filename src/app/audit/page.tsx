"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import "./audit.css";
import { audit, allQuestions, type Lang } from "./audit-content";

type Screen = "hero" | "audit" | "gate" | "results";
type Answer = "yes" | "no";

export default function AuditPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [screen, setScreen] = useState<Screen>("hero");
  const [sIdx, setSIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [gapCount, setGapCount] = useState(0);
  const [selected, setSelected] = useState<Answer | null>(null);
  const [stickyVisible, setStickyVisible] = useState(false);
  const [displayName, setDisplayName] = useState("");

  const [gateName, setGateName] = useState("");
  const [gateBiz, setGateBiz] = useState("");
  const [gatePhone, setGatePhone] = useState("");
  const [gateEmail, setGateEmail] = useState("");
  const [gateNameError, setGateNameError] = useState(false);
  const [gateSubmitting, setGateSubmitting] = useState(false);
  const gateNameRef = useRef<HTMLInputElement>(null);

  const c = audit[lang];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("lang") === "es") setLang("es");
  }, []);

  function startAudit() {
    setSIdx(0);
    setQIdx(0);
    setAnswers({});
    setGapCount(0);
    setSelected(null);
    setScreen("audit");
  }

  function answer(val: Answer) {
    const section = c.sections[sIdx];
    const q = section.questions[qIdx];
    setAnswers((prev) => ({ ...prev, [q.id]: val }));
    const isGap = (q.positive && val === "no") || (!q.positive && val === "yes");
    if (isGap) setGapCount((g) => g + 1);
    setSelected(val);

    setTimeout(() => {
      setSelected(null);
      if (qIdx + 1 < section.questions.length) {
        setQIdx(qIdx + 1);
      } else if (sIdx + 1 < c.sections.length) {
        setSIdx(sIdx + 1);
        setQIdx(0);
      } else {
        setScreen("gate");
      }
    }, 300);
  }

  async function revealResults() {
    if (!gateName.trim() && !gatePhone.trim() && !gateEmail.trim()) {
      setGateNameError(true);
      gateNameRef.current?.focus();
      return;
    }

    setGateSubmitting(true);
    const numberedAnswers = allQuestions(lang).reduce<Record<string, Answer | null>>((acc, q, i) => {
      acc[String(i + 1)] = answers[q.id] ?? null;
      return acc;
    }, {});
    try {
      await fetch("/api/audit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: gateName.trim(),
          businessName: gateBiz.trim(),
          phone: gatePhone.trim(),
          email: gateEmail.trim(),
          lang,
          gapCount,
          answers: numberedAnswers,
        }),
      });
    } catch {
      // Non-blocking: still show results even if the lead save/notify fails.
    }
    setGateSubmitting(false);

    setDisplayName(gateName.trim() || gateBiz.trim());
    setScreen("results");
    setTimeout(() => setStickyVisible(true), 1500);
  }

  function restartAudit() {
    setStickyVisible(false);
    setScreen("hero");
  }

  const total = allQuestions(lang).length;
  const totalAnswered = Object.keys(answers).length;
  const section = c.sections[sIdx];
  const question = section.questions[qIdx];
  const qNum = c.sections.slice(0, sIdx).reduce((a, s) => a + s.questions.length, 0) + qIdx + 1;

  const lo = gapCount * 1500;
  const hi = gapCount * 3000;

  const bookHref = `/book?lang=${lang}&name=${encodeURIComponent(gateName.trim())}&email=${encodeURIComponent(gateEmail.trim())}&phone=${encodeURIComponent(gatePhone.trim())}&business=${encodeURIComponent(gateBiz.trim())}`;

  return (
    <div className="audit-page">
      {/* LANG BAR */}
      <div className="lang-bar">
        <div className="lang-logo">
          Surface <b>Growth</b> Advisor
        </div>
        <div className="lang-btns">
          <button className={`lang-btn ${lang === "en" ? "active" : ""}`} onClick={() => setLang("en")}>
            EN
          </button>
          <button className={`lang-btn ${lang === "es" ? "active" : ""}`} onClick={() => setLang("es")}>
            ES
          </button>
        </div>
      </div>

      {/* SCREEN: HERO */}
      <div className={`screen ${screen === "hero" ? "active" : ""}`} id="screen-hero">
        <div className="hero-inner">
          <div className="hero-tag">{lang === "en" ? "Free Business Growth Audit" : "Auditoría Gratuita de Crecimiento"}</div>
          <h1
            dangerouslySetInnerHTML={{
              __html:
                lang === "en"
                  ? "Is your shop leaving <em>money on the table?</em>"
                  : "¿Está su negocio dejando <em>dinero sobre la mesa?</em>",
            }}
          />
          <p>
            {lang === "en"
              ? "Answer 13 quick questions. We'll show you exactly where your fabrication or surface shop has untapped revenue — and what to do about it."
              : "Responda 13 preguntas rápidas. Le mostraremos exactamente dónde tiene ingresos sin capturar — y qué hacer al respecto."}
          </p>
          <div className="hero-stats">
            <div>
              <div className="stat-num">10</div>
              <div className="stat-lbl">{lang === "en" ? "Years in the Trade" : "Años en la Industria"}</div>
            </div>
            <div>
              <div className="stat-num">5</div>
              <div className="stat-lbl">{lang === "en" ? "Minutes to Complete" : "Minutos para Completar"}</div>
            </div>
            <div>
              <div className="stat-num">13</div>
              <div className="stat-lbl">{lang === "en" ? "Questions" : "Preguntas"}</div>
            </div>
            <div>
              <div className="stat-num">{lang === "en" ? "Free" : "Gratis"}</div>
              <div className="stat-lbl">{lang === "en" ? "Always" : "Siempre"}</div>
            </div>
          </div>
          <button className="btn-start" onClick={startAudit}>
            {lang === "en" ? "Start My Free Audit →" : "Comenzar Mi Auditoría Gratuita →"}
          </button>
          <p className="hero-note">
            {lang === "en" ? "No sign-up to start. Takes about 5 minutes." : "No requiere registro. Toma unos 5 minutos."}
          </p>
        </div>
      </div>

      {/* SCREEN: AUDIT */}
      <div className={`screen ${screen === "audit" ? "active" : ""}`} id="screen-audit">
        <div className="audit-wrap">
          <div className="progress-area">
            <div className="progress-top">
              <span className="section-pill">
                {section.icon} {section.label}
              </span>
              <span className="q-counter">
                {qNum} {c.of} {total}
              </span>
            </div>
            <div className="progress-track">
              <div className="progress-bar" style={{ width: `${(totalAnswered / total) * 100}%` }} />
            </div>
          </div>
          <div className={`section-context ${qIdx === 0 ? "visible" : ""}`}>
            <p>{section.intro}</p>
          </div>
          <div className="q-card">
            <p>{question.text}</p>
            <div className="ans-row">
              <button className={`ans-btn yes ${selected === "yes" ? "selected-yes" : ""}`} onClick={() => answer("yes")}>
                {c.yes}
              </button>
              <button className={`ans-btn no ${selected === "no" ? "selected-no" : ""}`} onClick={() => answer("no")}>
                {c.no}
              </button>
            </div>
          </div>
          <div className="section-dots">
            {c.sections.map((s, i) => (
              <div key={s.id} className={`sdot ${i < sIdx ? "done" : i === sIdx ? "current" : ""}`} />
            ))}
          </div>
        </div>
      </div>

      {/* SCREEN: GATE */}
      <div className={`screen ${screen === "gate" ? "active" : ""}`} id="screen-gate">
        <div className="gate-inner">
          <div className="gate-icon">📊</div>
          <h2 dangerouslySetInnerHTML={{ __html: c.gateHeading(gapCount) }} />
          <p>{c.gateSub}</p>
          <div className="gate-form">
            <input
              ref={gateNameRef}
              type="text"
              placeholder={c.gateName}
              value={gateName}
              onChange={(e) => {
                setGateName(e.target.value);
                setGateNameError(false);
              }}
              style={gateNameError ? { borderColor: "var(--gold)" } : undefined}
            />
            <input type="text" placeholder={c.gateBiz} value={gateBiz} onChange={(e) => setGateBiz(e.target.value)} />
            <input type="tel" placeholder={c.gatePhone} value={gatePhone} onChange={(e) => setGatePhone(e.target.value)} />
            <input type="email" placeholder={c.gateEmail} value={gateEmail} onChange={(e) => setGateEmail(e.target.value)} />
            <button className="btn-reveal" onClick={revealResults} disabled={gateSubmitting}>
              {gateSubmitting ? (lang === "es" ? "Enviando..." : "Sending...") : c.gateBtn}
            </button>
          </div>
          <p className="gate-privacy">{c.gatePrivacy}</p>
        </div>
      </div>

      {/* SCREEN: RESULTS */}
      <div className={`screen ${screen === "results" ? "active" : ""}`} id="screen-results">
        <div className="results-hero">
          <div className="eyebrow">{c.resultsEyebrow(displayName)}</div>
          <h2 dangerouslySetInnerHTML={{ __html: c.resultsHeadline(gapCount) }} />
          <p dangerouslySetInnerHTML={{ __html: c.resultsSub(gapCount, lo, hi) }} />
        </div>
        <div className="results-body">
          {c.sections.map((s) => {
            const gapQs = s.questions.filter((q) => {
              const a = answers[q.id];
              if (!a) return false;
              return (q.positive && a === "no") || (!q.positive && a === "yes");
            });
            const score = s.questions.length - gapQs.length;
            const pct = score / s.questions.length;
            const color = pct >= 0.8 ? "var(--green)" : pct >= 0.5 ? "var(--gold)" : "var(--red)";
            return (
              <div className="result-card" key={s.id}>
                <div className="result-card-top">
                  <span className="result-card-title">
                    {s.icon} {s.label}
                  </span>
                  <span className="result-score" style={{ color }}>
                    {score}/{s.questions.length}
                  </span>
                </div>
                <div className="result-bar-track">
                  <div className="result-bar-fill" style={{ width: `${pct * 100}%`, background: color }} />
                </div>
                {gapQs.length > 0 ? (
                  <>
                    <p className="gap-list-label">{c.gapsFound}</p>
                    {gapQs.map((q) => (
                      <div className="gap-row" key={q.id}>
                        <span className="gap-x">✗</span>
                        <span className="gap-text">{q.text}</span>
                      </div>
                    ))}
                  </>
                ) : (
                  <p className="all-good">{c.allGood}</p>
                )}
              </div>
            );
          })}

          {/* About strip */}
          <div className="about-strip">
            <div className="about-icon">D</div>
            <div className="about-text">
              <h4>{c.aboutName} — Surface Growth Advisor</h4>
              <p>{c.aboutDesc}</p>
            </div>
          </div>

          {/* CTA */}
          <div className="cta-card">
            <div className="eyebrow">{c.ctaEyebrow}</div>
            <h3>{c.ctaHead}</h3>
            <p>{c.ctaBody(gapCount)}</p>
            <Link href={bookHref} className="btn-cta-gold">
              {c.ctaBtn}
            </Link>
            <Link href="/pricing" className="btn-pricing-link">
              {c.pricingLinkText}
            </Link>
            <button className="btn-restart-ghost" onClick={restartAudit}>
              {c.ctaRestart}
            </button>
          </div>
        </div>
      </div>

      {/* STICKY CTA */}
      <div className={`sticky-cta ${stickyVisible && screen === "results" ? "visible" : ""}`}>
        <p>{c.stickyText}</p>
        <Link href={bookHref}>{c.stickyLink}</Link>
      </div>
    </div>
  );
}
