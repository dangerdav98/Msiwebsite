import { LangProvider } from "./lang-context";
import SiteChrome from "./site-chrome";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <LangProvider>
      <SiteChrome>{children}</SiteChrome>
    </LangProvider>
  );
}
