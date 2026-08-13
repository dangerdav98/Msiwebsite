export type Lang = "en" | "es";

export interface IncludedItem {
  h: string;
  p: string;
}
export interface FaqItem {
  q: string;
  a: string;
}

export interface PricingContent {
  heroEyebrow: string;
  heroH1: string;
  heroP: string;
  tag3mo: string;
  name3mo: string;
  per3mo: string;
  dur3mo: string;
  depLabel3mo: string;
  depNote3mo: string;
  schedLabel3mo: string;
  s3_1: string;
  s3_2: string;
  s3_3: string;
  s3_4: string;
  s3total: string;
  btn3mo: string;
  tag12mo: string;
  name12mo: string;
  per12mo: string;
  dur12mo: string;
  depLabel12mo: string;
  depNote12mo: string;
  schedLabel12mo: string;
  ex1: string;
  ex2: string;
  ex3: string;
  ex4: string;
  btn12mo: string;
  calcTitle: string;
  calcSub: string;
  tab3: string;
  tab12: string;
  depInputLabel: string;
  depHint: string;
  nameInputLabel: string;
  nameHint: string;
  resDepLbl: string;
  resMoLbl: string;
  resMoCountLbl: string;
  timelineLbl: string;
  calcCtaBtn: string;
  calcAuditBtn: string;
  includedLabel: string;
  faqLabel: string;
  fctaH: string;
  fctaP: string;
  fctaAudit: string;
  fctaEmail: string;
  included: IncludedItem[];
  faqs: FaqItem[];
}

export const pricingContent: Record<Lang, PricingContent> = {
  en: {
    heroEyebrow: "Simple, Flexible Pricing",
    heroH1: `Two plans. <em>One clear path</em><br/>to growing your business.`,
    heroP: "No hidden fees. No confusing contracts. Start with a deposit and build from there.",
    tag3mo: "3-Month Plan",
    name3mo: "Quick Start",
    per3mo: " total",
    dur3mo: "3 months of focused growth work",
    depLabel3mo: "Your Deposit Sets Your Monthly",
    depNote3mo: "Whatever you put down becomes your monthly payment.",
    schedLabel3mo: "Example Schedules",
    s3_1: "$2,000 deposit → $1,000/mo x 3",
    s3_2: "$2,900 deposit → $700/mo x 3",
    s3_3: "$3,800 deposit → $400/mo x 3",
    s3_4: "$5,000 deposit → Paid in full",
    s3total: "Use calculator below",
    btn3mo: "Calculate My Plan →",
    tag12mo: "12-Month Plan",
    name12mo: "Growth Partner",
    per12mo: " total",
    dur12mo: "Full year of strategy, marketing & digital execution",
    depLabel12mo: "Your Deposit Sets Your Monthly",
    depNote12mo: "Whatever you put down becomes your monthly payment.",
    schedLabel12mo: "Example Schedules",
    ex1: "$1,500 deposit → $1,375/mo x 12",
    ex2: "$1,800 deposit → $1,350/mo x 12",
    ex3: "$3,000 deposit → $1,250/mo x 12",
    ex4: "Saves vs. month-to-month",
    btn12mo: "Calculate My Plan →",
    calcTitle: "Payment Plan Calculator",
    calcSub: "Enter your deposit to see your exact payment schedule before you commit.",
    tab3: "3-Month — $5,000",
    tab12: "12-Month — $18,000",
    depInputLabel: "Your Deposit Amount",
    depHint: "This is due before work begins. $1,500 minimum.",
    nameInputLabel: "Your Name (optional)",
    nameHint: "Personalizes your payment plan",
    resDepLbl: "Deposit Today",
    resMoLbl: "Monthly Payment",
    resMoCountLbl: "Months to Complete",
    timelineLbl: "Payment Timeline",
    calcCtaBtn: "Start With This Plan →",
    calcAuditBtn: "Take Free Audit First",
    includedLabel: "What's Included in Both Plans",
    faqLabel: "Common Questions",
    fctaH: "Not sure which plan is right?",
    fctaP: "Start with the free growth audit. We'll show you exactly where your business has untapped revenue — then you decide if and how you want to work together.",
    fctaAudit: "Take the Free Audit →",
    fctaEmail: "Email David Directly",
    included: [
      { h: "Strategy Calls", p: "Regular focused sessions to identify your biggest growth opportunity each month." },
      { h: "Marketing Assets", p: "Emails, flyers, price lists, showroom materials — delivered every month." },
      { h: "Ads Management", p: "Google and Meta ads set up, run, and optimized. You pay ad spend direct to the platform." },
      { h: "SEO & Website", p: "We improve how you show up on Google and keep your site current." },
      { h: "Competitive Analysis", p: "Know what your competitors are doing and have a strategy to counter it." },
      { h: "Direct Access", p: "Text and call David directly. Fast responses, real conversation — not a ticket system." },
    ],
    faqs: [
      {
        q: "What happens if I miss a monthly payment?",
        a: "We'll reach out immediately. One missed payment doesn't cancel your plan — but work pauses until we're caught up. We want this to work for your business, so let's communicate early if things get tight.",
      },
      {
        q: "Does the deposit count toward my total?",
        a: "Yes — your deposit is part of the total. For the 3-month plan: $1,500 deposit + $3,500 remaining = $5,000 total. For the 12-month plan: your deposit is your first payment, and the rest follows at the same rate.",
      },
      {
        q: "Can I cancel early?",
        a: "Yes, with 30 days written notice. Work stops at end of the current period. The deposit is non-refundable as it covers the initial strategy and setup work.",
      },
      {
        q: "What if I want to upgrade from 3-month to 12-month?",
        a: "Easy — we apply what you've paid toward the 12-month total and adjust your payment schedule from there.",
      },
      {
        q: "When does work actually start?",
        a: "As soon as your deposit clears. Usually within 1–2 business days we're scheduling your first strategy call.",
      },
      {
        q: "Do I pay for ads on top of this?",
        a: "Yes — ad spend (what Google or Meta actually charges to show your ads) is separate and billed directly to your card by the platform. We agree on your budget together before anything goes live.",
      },
    ],
  },
  es: {
    heroEyebrow: "Precios Simples y Flexibles",
    heroH1: `Dos planes. <em>Un camino claro</em><br/>para hacer crecer su negocio.`,
    heroP: "Sin cargos ocultos. Sin contratos confusos. Empiece con un depósito y avance desde ahí.",
    tag3mo: "Plan de 3 Meses",
    name3mo: "Inicio Rápido",
    per3mo: " total",
    dur3mo: "3 meses de trabajo enfocado en crecimiento",
    depLabel3mo: "Su Depósito Determina Su Pago Mensual",
    depNote3mo: "Lo que ponga de depósito se convierte en su pago mensual.",
    schedLabel3mo: "Ejemplos de Planes",
    s3_1: "$2,000 depósito → $1,000/mes x 3",
    s3_2: "$2,900 depósito → $700/mes x 3",
    s3_3: "$3,800 depósito → $400/mes x 3",
    s3_4: "$5,000 depósito → Pagado completo",
    s3total: "Use la calculadora abajo",
    btn3mo: "Calcule Mi Plan →",
    tag12mo: "Plan de 12 Meses",
    name12mo: "Socio de Crecimiento",
    per12mo: " total",
    dur12mo: "Un año completo de estrategia, mercadotecnia y ejecución digital",
    depLabel12mo: "Su Depósito Determina Su Pago Mensual",
    depNote12mo: "Lo que ponga de depósito se convierte en su pago mensual.",
    schedLabel12mo: "Ejemplos de Planes",
    ex1: "$1,500 depósito → $1,375/mes x 12",
    ex2: "$1,800 depósito → $1,350/mes x 12",
    ex3: "$3,000 depósito → $1,250/mes x 12",
    ex4: "Ahorra vs. pago mensual regular",
    btn12mo: "Calcule Mi Plan →",
    calcTitle: "Calculadora de Plan de Pagos",
    calcSub: "Ingrese su depósito para ver su calendario de pagos exacto antes de comprometerse.",
    tab3: "3 Meses — $5,000",
    tab12: "12 Meses — $18,000",
    depInputLabel: "Monto de Su Depósito",
    depHint: "Se paga antes de que comience el trabajo. Mínimo $1,500.",
    nameInputLabel: "Su Nombre (opcional)",
    nameHint: "Personaliza su plan de pagos",
    resDepLbl: "Depósito Hoy",
    resMoLbl: "Pago Mensual",
    resMoCountLbl: "Meses para Completar",
    timelineLbl: "Línea de Tiempo de Pagos",
    calcCtaBtn: "Comenzar Con Este Plan →",
    calcAuditBtn: "Primero Tome la Auditoría Gratuita",
    includedLabel: "Qué Incluye Cada Plan",
    faqLabel: "Preguntas Frecuentes",
    fctaH: "¿No sabe cuál plan es el correcto?",
    fctaP: "Comience con la auditoría de crecimiento gratuita. Le mostraremos exactamente dónde tiene ingresos sin capturar — luego usted decide si y cómo quiere trabajar juntos.",
    fctaAudit: "Tome la Auditoría Gratuita →",
    fctaEmail: "Envíele un Correo a David",
    included: [
      { h: "Llamadas de Estrategia", p: "Sesiones enfocadas para identificar su mayor oportunidad de crecimiento cada mes." },
      { h: "Materiales de Mercadotecnia", p: "Correos, volantes, listas de precios, materiales para showroom — entregados cada mes." },
      { h: "Manejo de Anuncios", p: "Anuncios en Google y Meta configurados, corridos y optimizados. Usted paga el gasto directo a la plataforma." },
      { h: "SEO y Sitio Web", p: "Mejoramos cómo aparece en Google y mantenemos su sitio actualizado." },
      { h: "Análisis de Competencia", p: "Sepa lo que hacen sus competidores y tenga una estrategia para contrarrestarlo." },
      { h: "Acceso Directo", p: "Escríbale o llame a David directamente. Respuestas rápidas, conversación real — no un sistema de tickets." },
    ],
    faqs: [
      {
        q: "¿Qué pasa si me atraso en un pago mensual?",
        a: "Le contactaremos de inmediato. Un pago atrasado no cancela su plan — pero el trabajo se pausa hasta ponernos al corriente. Queremos que esto funcione para su negocio, así que avísenos con anticipación si las cosas se ponen difíciles.",
      },
      {
        q: "¿El depósito cuenta hacia el total?",
        a: "Sí — su depósito es parte del total. Para el plan de 3 meses: $1,500 depósito + $3,500 restante = $5,000 total. Para el plan de 12 meses: su depósito es su primer pago y el resto sigue al mismo ritmo.",
      },
      {
        q: "¿Puedo cancelar antes de tiempo?",
        a: "Sí, con 30 días de aviso por escrito. El trabajo se detiene al final del período actual. El depósito no es reembolsable ya que cubre el trabajo inicial de estrategia y configuración.",
      },
      {
        q: "¿Qué pasa si quiero cambiar del plan de 3 meses al de 12 meses?",
        a: "Fácil — aplicamos lo que ha pagado al total de 12 meses y ajustamos su calendario de pagos desde ahí.",
      },
      {
        q: "¿Cuándo comienza el trabajo?",
        a: "En cuanto se acredite su depósito. Generalmente en 1 a 2 días hábiles ya estamos programando su primera llamada de estrategia.",
      },
      {
        q: "¿El gasto en anuncios es adicional?",
        a: "Sí — el gasto en anuncios (lo que Google o Meta cobra realmente por mostrar sus anuncios) es aparte y se factura directamente a su tarjeta por la plataforma. Acordamos su presupuesto juntos antes de que salga cualquier campaña al aire.",
      },
    ],
  },
};
