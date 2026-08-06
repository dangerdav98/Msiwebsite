"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Lang } from "./home-content";

interface NavProps {
  lang: Lang;
  setLang: (l: Lang) => void;
  pathname: string;
}

export default function Nav({ lang, setLang, pathname }: NavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const items = [
    { href: "/", label: lang === "en" ? "Home" : "Inicio" },
    { href: "/problem", label: lang === "en" ? "The Problem" : "El Problema" },
    { href: "/services", label: lang === "en" ? "Services" : "Servicios" },
    { href: "/about", label: lang === "en" ? "About" : "Acerca" },
    { href: "/how-it-works", label: lang === "en" ? "How It Works" : "Cómo Funciona" },
  ];

  return (
    <nav>
      <div className="nav-logo">
        Surface <b>Growth</b> Advisor
      </div>
      <ul className={`nav-links ${mobileOpen ? "open" : ""}`}>
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} style={{ color: pathname === item.href ? "var(--gold)" : undefined }}>
              {item.label}
            </Link>
          </li>
        ))}
        <li>
          <Link href="/#contact" className="nav-cta">
            {lang === "en" ? "Free Call" : "Llamada Gratis"}
          </Link>
        </li>
      </ul>
      <div className="nav-right">
        <div className="lang-btns">
          <button className={`lang-btn ${lang === "en" ? "active" : ""}`} onClick={() => setLang("en")}>
            EN
          </button>
          <button className={`lang-btn ${lang === "es" ? "active" : ""}`} onClick={() => setLang("es")}>
            ES
          </button>
        </div>
        <button
          className="mobile-menu-btn"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>
    </nav>
  );
}
