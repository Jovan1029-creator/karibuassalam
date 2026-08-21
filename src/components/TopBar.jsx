import LanguageToggle from "./LanguageToggle";
import { SITE } from "../data/siteConfig";
import { useLanguage } from "../context/LanguageContext";
import useHeaderState from "../hooks/useHeaderState";

/** Thin utility strip above the header: direct line + language, as on the reference. */
export default function TopBar() {
  const { tx } = useLanguage();
  const { isHome, scrolled } = useHeaderState();

  return (
    <div
      className={["topbar", isHome ? "topbar--over" : "", isHome && scrolled ? "is-scrolled" : ""]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="container topbar-inner">
        <span>
          {tx("Zanzibar")}:{" "}
          <a href={`tel:${SITE.phoneTel}`}>{SITE.phoneDisplay}</a>
        </span>
        <LanguageToggle />
      </div>
    </div>
  );
}
