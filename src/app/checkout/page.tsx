"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import "./checkout.css";

function CheckoutContent() {
  const params = useSearchParams();
  const lang = params.get("lang") === "es" ? "es" : "en";
  const planParam = params.get("plan") === "12" ? "12" : "3";
  const deposit = Number(params.get("deposit"));
  const months = Number(params.get("months"));

  const [name, setName] = useState(params.get("name") || "");
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid = Number.isFinite(deposit) && deposit >= 1500 && Number.isFinite(months) && months >= 1;

  const total = planParam === "12" ? 18000 : 5000;
  const planLabel =
    planParam === "12" ? (lang === "es" ? "Plan de 12 Meses" : "12-Month Plan") : lang === "es" ? "Plan de 3 Meses" : "3-Month Plan";

  const t =
    lang === "es"
      ? {
          heading: "Finalizar Inscripción",
          sub: "Revise su plan y complete sus datos para continuar al pago seguro con Stripe.",
          tag: "Su Plan",
          deposit: "Depósito de Hoy",
          monthly: "Pago Mensual",
          monthsLbl: "Meses",
          totalLbl: "Total del Plan",
          name: "Su nombre",
          business: "Nombre del negocio",
          phone: "Número de teléfono",
          email: "Correo electrónico",
          btn: "Continuar al Pago →",
          sending: "Redirigiendo...",
          note: "Será redirigido a la página de pago segura de Stripe.",
          missing: "Falta información del plan. Vuelva a la página de precios y use la calculadora.",
          backLink: "← Volver a Precios",
        }
      : {
          heading: "Complete Your Enrollment",
          sub: "Review your plan and enter your details to continue to secure payment with Stripe.",
          tag: "Your Plan",
          deposit: "Deposit Today",
          monthly: "Monthly Payment",
          monthsLbl: "Months",
          totalLbl: "Total Plan Value",
          name: "Your name",
          business: "Business name",
          phone: "Phone number",
          email: "Email address",
          btn: "Continue to Payment →",
          sending: "Redirecting...",
          note: "You'll be redirected to Stripe's secure payment page.",
          missing: "Missing plan details. Please go back to the pricing page and use the calculator.",
          backLink: "← Back to Pricing",
        };

  async function submit() {
    if (!name.trim() || !email.trim()) {
      setError(lang === "es" ? "Nombre y correo son obligatorios." : "Name and email are required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: planParam === "12" ? "12mo" : "3mo",
          deposit,
          months,
          name,
          businessName,
          phone,
          email,
          lang,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Checkout failed");
      }
      window.location.href = data.url;
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      setError(
        message && message !== "Checkout failed"
          ? message
          : lang === "es"
            ? "No se pudo iniciar el pago. Intente de nuevo."
            : "Could not start checkout. Please try again."
      );
      setSubmitting(false);
    }
  }

  if (!valid) {
    return (
      <main>
        <p className="checkout-error">{t.missing}</p>
        <p style={{ textAlign: "center", marginTop: 16 }}>
          <Link href="/pricing">{t.backLink}</Link>
        </p>
      </main>
    );
  }

  return (
    <main>
      <h1>{t.heading}</h1>
      <p className="checkout-sub">{t.sub}</p>

      <div className="summary-card">
        <div className="summary-tag">{t.tag}</div>
        <div className="summary-plan">{planLabel}</div>
        <div className="summary-row">
          <span>{t.deposit}</span>
          <span>${deposit.toLocaleString()}</span>
        </div>
        <div className="summary-row">
          <span>{t.monthly}</span>
          <span>${deposit.toLocaleString()}</span>
        </div>
        <div className="summary-row">
          <span>{t.monthsLbl}</span>
          <span>{months}</span>
        </div>
        <div className="summary-row total">
          <span>{t.totalLbl}</span>
          <span>${total.toLocaleString()}</span>
        </div>
      </div>

      <div className="checkout-form">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">{t.name}</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">{t.business}</label>
            <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">{t.phone}</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">{t.email}</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>
        <button className="btn-pay" onClick={submit} disabled={submitting}>
          {submitting ? t.sending : t.btn}
        </button>
        {error && <p className="checkout-error">{error}</p>}
        <p className="checkout-note">{t.note}</p>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <div className="checkout-page">
      <div className="checkout-nav">
        <Link href="/">
          Surface <b>Growth</b> Advisor
        </Link>
      </div>
      <Suspense fallback={null}>
        <CheckoutContent />
      </Suspense>
    </div>
  );
}
