"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLang } from "./lang-context";
import Nav from "./nav";
import Footer from "./footer";
import "./home.css";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const { lang, setLang } = useLang();
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const revealEls = root.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    revealEls.forEach((el) => obs.observe(el));

    return () => obs.disconnect();
  }, [pathname]);

  return (
    <div className="home-page" ref={rootRef}>
      <Nav lang={lang} setLang={setLang} pathname={pathname} />
      {children}
      <Footer lang={lang} />
    </div>
  );
}
