import { NavLink, Link, useLocation } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { ECO_VILLAGE_LINKS, NAV_LINKS, SITE } from "../data/siteConfig";
import { useLanguage } from "../context/LanguageContext";
import LanguageToggle from "./LanguageToggle";
import CTAButton from "./CTAButton";
import useHeaderState from "../hooks/useHeaderState";

const navLabelKey = {
  Home: "home",
  About: "about",
  Retreats: "retreats",
  Zanzibar: "zanzibar",
  FAQ: "faq",
  Contact: "contact",
  Campus: "campus",
  Rooms: "rooms",
  Food: "food",
};

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ecoOpen, setEcoOpen] = useState(false);
  const [ecoMobileOpen, setEcoMobileOpen] = useState(false);
  const navRef = useRef(null);
  const panelRef = useRef(null);
  const menuButtonRef = useRef(null);
  const { t, tx } = useLanguage();
  const location = useLocation();
  const { isHome, scrolled } = useHeaderState();

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    setEcoMobileOpen(false);
  }, []);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        if (mobileOpen) menuButtonRef.current?.focus();
        closeMobile();
        setEcoOpen(false);
        return;
      }

      // Keep focus inside the menu panel while it is open.
      if (event.key === "Tab" && mobileOpen && panelRef.current) {
        const items = [
          menuButtonRef.current,
          ...panelRef.current.querySelectorAll(FOCUSABLE),
        ].filter(Boolean);
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    function onPointerDown(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setEcoOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [closeMobile, mobileOpen]);

  // Stop the page scrolling behind the open panel.
  useEffect(() => {
    if (!mobileOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  useEffect(() => {
    closeMobile();
    setEcoOpen(false);
  }, [closeMobile, location.pathname]);

  const headerClass = [
    "site-header",
    isHome ? "site-header--home" : "",
    isHome && scrolled ? "is-scrolled" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={headerClass} ref={navRef}>
      <div className="container nav-shell">
        <Link to="/" className="brand-mark" onClick={closeMobile}>
          <img src={SITE.logoSrc} alt={tx("Karibu Assalam logo")} width="44" height="44" />
          <span className="brand-mark__stack">
            <span className="brand-mark__title">{SITE.brandName}</span>
            <span className="brand-mark__subtitle">Assalam {t.nav.campus}</span>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary">
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className={({ isActive }) => (isActive ? "is-active" : "")}>
                  {t.nav[navLabelKey[link.label]] ?? link.label}
                </NavLink>
              </li>
            ))}
            <li className="nav-dropdown">
              <button
                type="button"
                className={`nav-dropdown-trigger ${ecoOpen ? "is-active" : ""}`}
                aria-expanded={ecoOpen}
                aria-controls="eco-village-menu"
                onClick={() => setEcoOpen((v) => !v)}
              >
                {t.nav.ecoVillage}
              </button>
              {ecoOpen && (
                <ul id="eco-village-menu" className="dropdown-menu">
                  {ECO_VILLAGE_LINKS.map((link) => (
                    <li key={link.to}>
                      <Link to={link.to} onClick={() => setEcoOpen(false)}>
                        {t.nav[navLabelKey[link.label]] ?? link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>
        </nav>

        <div className="nav-actions">
          <CTAButton to="/booking" variant="primary" size="sm">
            {t.nav.bookNow}
          </CTAButton>
          <button
            ref={menuButtonRef}
            type="button"
            className={`mobile-menu-button ${mobileOpen ? "is-open" : ""}`}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-panel"
            aria-label={t.nav.menu}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className="mobile-menu-button__icon" aria-hidden="true">
              <span className="mobile-menu-button__bar" />
              <span className="mobile-menu-button__bar" />
              <span className="mobile-menu-button__bar" />
            </span>
            <span className="visually-hidden">{t.nav.menu}</span>
          </button>
        </div>
      </div>

      <div
        id="mobile-nav-panel"
        className={`mobile-nav ${mobileOpen ? "is-open" : ""}`}
        ref={panelRef}
        hidden={!mobileOpen}
      >
        <div className="container">
          <nav aria-label="Mobile primary">
            <ul>
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    onClick={closeMobile}
                    className={({ isActive }) => (isActive ? "is-active" : "")}
                  >
                    {t.nav[navLabelKey[link.label]] ?? link.label}
                  </NavLink>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  className="mobile-submenu-trigger"
                  aria-expanded={ecoMobileOpen}
                  onClick={() => setEcoMobileOpen((v) => !v)}
                >
                  {t.nav.ecoVillage}
                </button>
                {ecoMobileOpen && (
                  <ul className="mobile-submenu">
                    {ECO_VILLAGE_LINKS.map((link) => (
                      <li key={link.to}>
                        <NavLink to={link.to} onClick={closeMobile}>
                          {t.nav[navLabelKey[link.label]] ?? link.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            </ul>
          </nav>

          <div className="mobile-panel-actions">
            <CTAButton to="/booking" onClick={closeMobile}>
              {t.nav.bookNow}
            </CTAButton>

            <div className="mobile-panel-lang">
              <span>{t.nav.language}</span>
              <LanguageToggle compact />
            </div>

            <div className="mobile-panel-contact">
              <a href={`https://wa.me/${SITE.whatsAppPhone}`} target="_blank" rel="noopener noreferrer">
                {tx("Message us on WhatsApp")}
              </a>
              <a href={`tel:${SITE.phoneTel}`}>{SITE.phoneDisplay}</a>
            </div>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <button
          type="button"
          className="mobile-nav-backdrop"
          aria-label={tx("Close menu")}
          onClick={closeMobile}
        />
      )}
    </header>
  );
}
