"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import "./pricing.css";
import { pricingContent, type Lang } from "./pricing-content";

export default function PricingPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [currentPlan, setCurrentPlan] = useState<3 | 12>(3);
  const [deposit, setDeposit] = useState(1500);
  const [name, setName] = useState("");
  const [openFaq, setOpenFaq] = useState<Set<number>>(new Set());

  const t = pricingContent[lang];

  function switchPlan(n: 3 | 12) {
    setCurrentPlan(n);
    setDeposit(1500);
  }

  const calc = useMemo(() => {
    const total = currentPlan === 3 ? 5000 : 18000;
    const monthly = deposit || 0;
    const remaining = total - monthly;
    let months = remaining <= 0 ? 1 : Math.ceil(remaining / monthly) + 1;
    const cap = currentPlan === 3 ? 12 : 24;
    if (months > cap) months = cap;
    if (months < 1 || !isFinite(months)) months = 1;
    const payMonths = months - 1;

    // Split the remaining balance as evenly as possible across payMonths so
    // deposit + every subsequent payment sums exactly to the plan total.
    let schedule: number[] = [];
    if (payMonths > 0) {
      const base = Math.floor(remaining / payMonths);
      const remainder = remaining - base * payMonths;
      schedule = Array.from({ length: payMonths }, (_, i) => base + (i < remainder ? 1 : 0));
    }
    const minPayment = schedule.length ? Math.min(...schedule) : monthly;
    const maxPayment = schedule.length ? Math.max(...schedule) : monthly;

    return { total, monthly, months, payMonths, schedule, minPayment, maxPayment };
  }, [currentPlan, deposit]);

  const checkoutHref = `/checkout?plan=${currentPlan}&deposit=${calc.monthly}&months=${calc.months}&lang=${lang}&name=${encodeURIComponent(name)}`;

  const timelineBars = [];
  for (let i = 0; i < Math.min(calc.payMonths, 12); i++) {
    timelineBars.push({ n: i + 1, amount: calc.schedule[i] });
  }

  function toggleFaq(i: number) {
    setOpenFaq((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <div className="pricing-page">
      {/* NAV */}
      <nav>
        <div className="nav-logo">
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
      </nav>

      {/* HERO */}
      <div className="page-hero">
        <div className="hero-eyebrow">{t.heroEyebrow}</div>
        <h1 dangerouslySetInnerHTML={{ __html: t.heroH1 }} />
        <p>{t.heroP}</p>
      </div>

      <main>
        {/* PLAN CARDS */}
        <div className="plans-grid" style={{ marginTop: 40 }}>
          {/* 3 MONTH */}
          <div className="plan-card">
            <div className="plan-header">
              <div className="plan-tag">{t.tag3mo}</div>
              <div className="plan-name">{t.name3mo}</div>
              <div className="plan-total">
                $5,000<span>{t.per3mo}</span>
              </div>
              <div className="plan-duration">{t.dur3mo}</div>
              <div className="plan-deposit-box">
                <div className="deposit-label">{t.depLabel3mo}</div>
                <div className="deposit-amount">{lang === "es" ? "Usted Elige" : "You Choose"}</div>
                <div className="deposit-note">{t.depNote3mo}</div>
              </div>
            </div>
            <div className="plan-body">
              <div className="plan-schedule-label">{t.schedLabel3mo}</div>
              <div className="schedule-row">
                <span className="schedule-label">{t.s3_1}</span>
                <span className="schedule-amt deposit-highlight">$5,000</span>
              </div>
              <div className="schedule-row">
                <span className="schedule-label">{t.s3_2}</span>
                <span className="schedule-amt">$5,000</span>
              </div>
              <div className="schedule-row">
                <span className="schedule-label">{t.s3_3}</span>
                <span className="schedule-amt">$5,000</span>
              </div>
              <div className="schedule-row">
                <span className="schedule-label">{t.s3_4}</span>
                <span className="schedule-amt">$5,000</span>
              </div>
              <div className="schedule-row">
                <span className="schedule-label" style={{ fontWeight: 700 }}>
                  {t.s3total}
                </span>
                <span className="schedule-amt" style={{ color: "var(--green)" }}>
                  ↓
                </span>
              </div>
            </div>
            <div className="plan-footer">
              <a
                href="#calculator"
                className="btn-choose btn-choose-light"
                onClick={() => switchPlan(3)}
              >
                {t.btn3mo}
              </a>
            </div>
          </div>

          {/* 12 MONTH */}
          <div className="plan-card featured">
            <div className="plan-header">
              <div className="plan-tag">{t.tag12mo}</div>
              <div className="plan-name">{t.name12mo}</div>
              <div className="plan-total">
                $18,000<span>{t.per12mo}</span>
              </div>
              <div className="plan-duration">{t.dur12mo}</div>
              <div className="plan-deposit-box">
                <div className="deposit-label">{t.depLabel12mo}</div>
                <div className="deposit-amount">{lang === "es" ? "Usted Elige" : "You Choose"}</div>
                <div className="deposit-note">{t.depNote12mo}</div>
              </div>
            </div>
            <div className="plan-body">
              <div className="plan-schedule-label">{t.schedLabel12mo}</div>
              <div className="schedule-row">
                <span className="schedule-label">{t.ex1}</span>
                <span className="schedule-amt" style={{ color: "var(--gold)" }}>
                  $18,000
                </span>
              </div>
              <div className="schedule-row">
                <span className="schedule-label">{t.ex2}</span>
                <span className="schedule-amt" style={{ color: "var(--gold)" }}>
                  $18,000
                </span>
              </div>
              <div className="schedule-row">
                <span className="schedule-label">{t.ex3}</span>
                <span className="schedule-amt" style={{ color: "var(--gold)" }}>
                  $18,000
                </span>
              </div>
              <div className="schedule-row">
                <span className="schedule-label">{t.ex4}</span>
                <span className="schedule-amt" style={{ color: "var(--gold)" }}>
                  $18,000
                </span>
              </div>
            </div>
            <div className="plan-footer">
              <a
                href="#calculator"
                className="btn-choose btn-choose-gold"
                onClick={() => switchPlan(12)}
              >
                {t.btn12mo}
              </a>
            </div>
          </div>
        </div>

        {/* CALCULATOR */}
        <div className="calc-section" id="calculator">
          <div className="calc-header">
            <h2>{t.calcTitle}</h2>
            <p>{t.calcSub}</p>
          </div>
          <div className="calc-body">
            <div className="calc-plan-tabs">
              <button className={`calc-tab ${currentPlan === 3 ? "active" : ""}`} onClick={() => switchPlan(3)}>
                <span>{t.tab3}</span>
              </button>
              <button className={`calc-tab ${currentPlan === 12 ? "active" : ""}`} onClick={() => switchPlan(12)}>
                <span>{t.tab12}</span>
              </button>
            </div>

            <div className="calc-input-row">
              <div className="input-group">
                <div className="input-label">{t.depInputLabel}</div>
                <div className="input-wrapper">
                  <span>$</span>
                  <input
                    type="number"
                    className="calc-input"
                    value={deposit}
                    min={1500}
                    max={currentPlan === 3 ? 5000 : 18000}
                    onChange={(e) => setDeposit(parseFloat(e.target.value) || 0)}
                    onBlur={(e) => {
                      const v = parseFloat(e.target.value) || 0;
                      if (v < 1500) setDeposit(1500);
                    }}
                  />
                </div>
                <div className="input-hint">{t.depHint}</div>
              </div>
              <div className="input-group">
                <div className="input-label">{t.nameInputLabel}</div>
                <div className="input-wrapper" style={{ paddingLeft: 0 }}>
                  <input
                    type="text"
                    className="calc-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Carlos"
                    style={{ paddingLeft: 14, fontSize: 16, fontWeight: 400 }}
                  />
                </div>
                <div className="input-hint">{t.nameHint}</div>
              </div>
            </div>

            {/* RESULT */}
            <div className="calc-result">
              <div className="calc-result-grid">
                <div className="result-item">
                  <div className="result-num gold">${calc.monthly.toLocaleString()}</div>
                  <div className="result-lbl">{t.resDepLbl}</div>
                </div>
                <div className="result-item">
                  <div className="result-num">
                    {calc.payMonths === 0
                      ? lang === "es"
                        ? "Pagado"
                        : "Paid in Full"
                      : calc.minPayment === calc.maxPayment
                        ? `$${calc.minPayment.toLocaleString()}`
                        : `$${calc.minPayment.toLocaleString()}–$${calc.maxPayment.toLocaleString()}`}
                  </div>
                  <div className="result-lbl">{t.resMoLbl}</div>
                </div>
                <div className="result-item">
                  <div className="result-num green">
                    {calc.months}
                    {lang === "es" ? " meses" : " mo"}
                  </div>
                  <div className="result-lbl">{t.resMoCountLbl}</div>
                </div>
              </div>

              <div className="payment-timeline">
                <div className="timeline-label">{t.timelineLbl}</div>
                <div className="timeline-bars">
                  <div className="timeline-bar deposit-bar" data-tip={`${lang === "es" ? "Depósito: " : "Deposit: "}$${calc.monthly.toLocaleString()}`}>
                    Dep.
                  </div>
                  {timelineBars.map(({ n, amount }) => (
                    <div
                      key={n}
                      className="timeline-bar"
                      data-tip={`${lang === "es" ? "Mes" : "Mo"} ${n}: $${amount.toLocaleString()}`}
                    >
                      {n}
                    </div>
                  ))}
                  {calc.payMonths > 12 && (
                    <div className="timeline-bar" style={{ background: "var(--mid)" }}>
                      ...
                    </div>
                  )}
                </div>
              </div>

              <div className="calc-cta">
                <Link href={checkoutHref} className="btn-calc-gold">
                  {t.calcCtaBtn}
                </Link>
                <Link href="/audit" className="btn-calc-ghost">
                  {t.calcAuditBtn}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* WHAT'S INCLUDED */}
        <div className="included-section">
          <div className="section-label">{t.includedLabel}</div>
          <div className="included-grid">
            {t.included.map((item, i) => (
              <div className="included-card" key={i}>
                <h4>{item.h}</h4>
                <p>{item.p}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="faq-section">
          <div className="section-label">{t.faqLabel}</div>
          <div>
            {t.faqs.map((f, i) => (
              <div key={i} className={`faq-item ${openFaq.has(i) ? "open" : ""}`} onClick={() => toggleFaq(i)}>
                <div className="faq-q">
                  {f.q} <span className="faq-icon">+</span>
                </div>
                <div className="faq-a">{f.a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FINAL CTA */}
        <div className="final-cta">
          <h2>{t.fctaH}</h2>
          <p>{t.fctaP}</p>
          <div className="final-cta-btns">
            <Link href="/audit" className="btn-final-dark">
              {t.fctaAudit}
            </Link>
            <a href="mailto:david@surfacegrowthco.com" className="btn-final-ghost">
              {t.fctaEmail}
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
