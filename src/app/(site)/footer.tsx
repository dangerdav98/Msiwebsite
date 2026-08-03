import { homeContent, type Lang } from "./home-content";

export default function Footer({ lang }: { lang: Lang }) {
  const t = homeContent[lang];
  return (
    <footer>
      <div className="footer-logo">
        Surface <b>Growth</b> Advisor
      </div>
      <p>{t["footer-txt"]}</p>
    </footer>
  );
}
