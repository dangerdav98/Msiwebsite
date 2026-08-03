export type Lang = "en" | "es";

export interface Question {
  id: string;
  text: string;
  positive: boolean;
}

export interface Section {
  id: string;
  label: string;
  icon: string;
  intro: string;
  questions: Question[];
}

export interface AuditContent {
  yes: string;
  no: string;
  of: string;
  gateHeading: (g: number) => string;
  gateSub: string;
  gateName: string;
  gateBiz: string;
  gatePhone: string;
  gateEmail: string;
  gateBtn: string;
  gatePrivacy: string;
  resultsEyebrow: (n: string) => string;
  resultsHeadline: (g: number) => string;
  resultsSub: (g: number, lo: number, hi: number) => string;
  gapsFound: string;
  allGood: string;
  ctaEyebrow: string;
  ctaHead: string;
  ctaBody: (g: number) => string;
  ctaBtn: string;
  ctaRestart: string;
  aboutName: string;
  aboutDesc: string;
  stickyText: string;
  stickyLink: string;
  pricingLinkText: string;
  sections: Section[];
}

export const audit: Record<Lang, AuditContent> = {
  en: {
    yes: "✓  Yes",
    no: "✗  No",
    of: "of",
    gateHeading: (g) => `Your audit is ready — <span>${g} ${g === 1 ? "gap" : "gaps"} found</span>`,
    gateSub:
      "Where should we send your results? Enter your info below to see your full breakdown — and we'll follow up with specific recommendations for your shop.",
    gateName: "Your name",
    gateBiz: "Business name",
    gatePhone: "Phone number",
    gateEmail: "Email address",
    gateBtn: "Show My Full Results →",
    gatePrivacy: "We never spam. Your info is used only to follow up with your results.",
    resultsEyebrow: (n) => (n ? `${n} — Audit Complete` : "Audit Complete"),
    resultsHeadline: (g) => `You have <span>${g} growth ${g === 1 ? "gap" : "gaps"}</span>`,
    resultsSub: (g, lo, hi) => `Estimated monthly revenue opportunity: $${lo.toLocaleString()}–$${hi.toLocaleString()}`,
    gapsFound: "Gaps found:",
    allGood: "✓ Strong area — no major gaps",
    ctaEyebrow: "Your Next Step",
    ctaHead: "Let's close these gaps together",
    ctaBody: (g) =>
      g === 0
        ? "Your operation looks strong. Let's talk about where to go next."
        : `${g} gap${g !== 1 ? "s" : ""} means real revenue sitting uncaptured every month. Let's fix that — starting this month.`,
    ctaBtn: "Book Your Free 30-Min Strategy Call",
    ctaRestart: "↺ Start Over",
    aboutName: "David",
    aboutDesc:
      "10 years in building products distribution. Google & Meta Ads certified. I help fabricators and surface shops grow the business behind the craft.",
    stickyText: "Ready to close your gaps?",
    stickyLink: "Book Free Call →",
    pricingLinkText: "View Pricing & Payment Plans",
    sections: [
      {
        id: "product",
        label: "Product Mix",
        icon: "◈",
        intro: "You're leaving revenue on the table every time a customer buys flooring or cabinets somewhere else.",
        questions: [
          { id: "p1", text: "Do you sell anything beyond countertops — like flooring, cabinets, or vanities?", positive: true },
          { id: "p2", text: "Do you actively upsell adjacent products to your countertop customers?", positive: true },
          { id: "p3", text: "Do you know which product categories your customers buy from competitors?", positive: true },
        ],
      },
      {
        id: "marketing",
        label: "Marketing",
        icon: "◉",
        intro: "Your craft is strong — but if people can't find you or don't remember you, you lose jobs you should win.",
        questions: [
          { id: "m1", text: "Do you have a professional brochure or leave-behind for prospects?", positive: true },
          { id: "m2", text: "Do you send marketing emails to past customers?", positive: true },
          { id: "m3", text: "Does your showroom clearly communicate who you serve and what makes you different?", positive: true },
          { id: "m4", text: "Do you have a consistent and active presence on social media?", positive: true },
        ],
      },
      {
        id: "sales",
        label: "Sales Strategy",
        icon: "◎",
        intro: "Most shops finish the job and move on. The ones that grow have a system that turns every install into future revenue.",
        questions: [
          { id: "s1", text: "Do you have a formal follow-up process after every install?", positive: true },
          { id: "s2", text: "Do you ask every customer for a referral?", positive: true },
          { id: "s3", text: "Do you have active relationships with local designers or builders who send you work?", positive: true },
        ],
      },
      {
        id: "pricing",
        label: "Pricing & Positioning",
        icon: "◇",
        intro: "Shops that don't review pricing regularly undercharge — and end up competing on price instead of value.",
        questions: [
          { id: "pr1", text: "Do you have a premium tier or package targeting higher-budget clients?", positive: true },
          { id: "pr2", text: "Do you review and update your pricing at least every three months?", positive: true },
          { id: "pr3", text: "Do you know your average invoice value vs. your top competitors?", positive: true },
        ],
      },
      {
        id: "competitive",
        label: "Competitive Awareness",
        icon: "◐",
        intro: "If you don't know what your competitors are doing, you can't counter it.",
        questions: [
          { id: "c1", text: "Do you know what your top 3 competitors are currently promoting?", positive: true },
          { id: "c2", text: "Have you visited a competitor's showroom in the last 6 months?", positive: true },
          { id: "c3", text: "Do you have a clear strategy to counter competitors gaining visibility with your clients?", positive: true },
        ],
      },
    ],
  },
  es: {
    yes: "✓  Sí",
    no: "✗  No",
    of: "de",
    gateHeading: (g) => `Su auditoría está lista — <span>${g} ${g === 1 ? "brecha" : "brechas"} encontrada${g === 1 ? "" : "s"}</span>`,
    gateSub:
      "¿A dónde enviamos sus resultados? Ingrese su información para ver el desglose completo — y le enviaremos recomendaciones específicas para su negocio.",
    gateName: "Su nombre",
    gateBiz: "Nombre del negocio",
    gatePhone: "Número de teléfono",
    gateEmail: "Correo electrónico",
    gateBtn: "Ver Mis Resultados Completos →",
    gatePrivacy: "Nunca enviamos spam. Su información solo se usa para darle seguimiento a sus resultados.",
    resultsEyebrow: (n) => (n ? `${n} — Auditoría Completa` : "Auditoría Completa"),
    resultsHeadline: (g) => `Tiene <span>${g} ${g === 1 ? "área de oportunidad" : "áreas de oportunidad"}</span>`,
    resultsSub: (g, lo, hi) => `Oportunidad de ingresos mensuales estimada: $${lo.toLocaleString()}–$${hi.toLocaleString()}`,
    gapsFound: "Oportunidades encontradas:",
    allGood: "✓ Área sólida — sin oportunidades mayores",
    ctaEyebrow: "Su Siguiente Paso",
    ctaHead: "Cerremos estas brechas juntos",
    ctaBody: (g) =>
      g === 0
        ? "Su operación se ve sólida. Hablemos sobre cómo seguir creciendo."
        : `${g} ${g === 1 ? "brecha" : "brechas"} significa ingresos reales sin capturar cada mes. Arreglemos eso — comenzando este mes.`,
    ctaBtn: "Reserve Su Llamada Estratégica Gratuita",
    ctaRestart: "↺ Comenzar de Nuevo",
    aboutName: "David",
    aboutDesc:
      "10 años en distribución de productos de construcción. Certificado en Google y Meta Ads. Ayudo a fabricadores y talleres a hacer crecer el negocio detrás del trabajo.",
    stickyText: "¿Listo para cerrar sus brechas?",
    stickyLink: "Reserve Su Llamada →",
    pricingLinkText: "Ver Precios y Planes de Pago",
    sections: [
      {
        id: "product",
        label: "Mezcla de Productos",
        icon: "◈",
        intro: "Está dejando dinero sobre la mesa cada vez que un cliente compra pisos o gabinetes en otro lugar.",
        questions: [
          { id: "p1", text: "¿Vende algo más allá de encimeras — como pisos, gabinetes o vanidades?", positive: true },
          { id: "p2", text: "¿Ofrece activamente productos adicionales a sus clientes de encimeras?", positive: true },
          { id: "p3", text: "¿Sabe qué categorías de productos sus clientes compran a la competencia?", positive: true },
        ],
      },
      {
        id: "marketing",
        label: "Mercadotecnia",
        icon: "◉",
        intro: "Su trabajo es excelente — pero si la gente no lo encuentra ni lo recuerda, pierde trabajos que debería ganar.",
        questions: [
          { id: "m1", text: "¿Tiene un folleto profesional o material para dejar con clientes potenciales?", positive: true },
          { id: "m2", text: "¿Envía correos de mercadotecnia a clientes anteriores?", positive: true },
          { id: "m3", text: "¿Su showroom comunica claramente a quién sirve y qué lo hace diferente?", positive: true },
          { id: "m4", text: "¿Tiene una presencia activa y consistente en redes sociales?", positive: true },
        ],
      },
      {
        id: "sales",
        label: "Estrategia de Ventas",
        icon: "◎",
        intro:
          "La mayoría de los talleres terminan el trabajo y siguen adelante. Los que crecen tienen un sistema que convierte cada instalación en ingresos futuros.",
        questions: [
          { id: "s1", text: "¿Tiene un proceso formal de seguimiento después de cada instalación?", positive: true },
          { id: "s2", text: "¿Le pide a cada cliente que lo refiera con alguien más?", positive: true },
          { id: "s3", text: "¿Tiene relaciones activas con diseñadores o constructores locales que le envían trabajo?", positive: true },
        ],
      },
      {
        id: "pricing",
        label: "Precios y Posicionamiento",
        icon: "◇",
        intro: "Los talleres que no revisan sus precios regularmente cobran de menos — y terminan compitiendo por precio en lugar de valor.",
        questions: [
          { id: "pr1", text: "¿Tiene un paquete o nivel premium dirigido a clientes de mayor presupuesto?", positive: true },
          { id: "pr2", text: "¿Revisa y actualiza sus precios al menos cada tres meses?", positive: true },
          { id: "pr3", text: "¿Sabe cuál es su valor promedio de factura comparado con sus principales competidores?", positive: true },
        ],
      },
      {
        id: "competitive",
        label: "Conocimiento de la Competencia",
        icon: "◐",
        intro: "Si no sabe qué están haciendo sus competidores, no puede contrarrestarlo.",
        questions: [
          { id: "c1", text: "¿Sabe qué están promoviendo actualmente sus 3 principales competidores?", positive: true },
          { id: "c2", text: "¿Ha visitado el showroom de un competidor en los últimos 6 meses?", positive: true },
          { id: "c3", text: "¿Tiene una estrategia clara para contrarrestar a competidores que ganan visibilidad con sus clientes?", positive: true },
        ],
      },
    ],
  },
};

export function allQuestions(lang: Lang): Question[] {
  return audit[lang].sections.flatMap((s) => s.questions);
}
