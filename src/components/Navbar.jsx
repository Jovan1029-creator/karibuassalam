import { NavLink, Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ECO_VILLAGE_LINKS, NAV_LINKS, SITE } from "../data/siteConfig";
import { useLanguage } from "../context/LanguageContext";
import LanguageToggle from "./LanguageToggle";
import CTAButton from "./CTAButton";

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

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ecoOpen, setEcoOpen] = useState(false);
  const [ecoMobileOpen, setEcoMobileOpen] = useState(false);
  const navRef = useRef(null);
  const { t, tx } = useLanguage();
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setEcoOpen(false);
        setEcoMobileOpen(false);
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
  }, []);

  return (
    <header className={`site-header ${isHome ? "site-header--home" : ""}`} ref={navRef}>
      <div className="container nav-shell">
        <Link to="/" className="brand-mark" onClick={() => setMobileOpen(false)}>
          <img src={SITE.logoSrc} alt={tx("Karibu Assalam logo")} />
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
                onClick={() => setEcoOpen((v) => !v)}
              >
                {t.nav.ecoVillage}
              </button>
              {ecoOpen && (
                <div className="dropdown-menu" role="menu" aria-label="Eco-Village pages">
                  {ECO_VILLAGE_LINKS.map((link) => (
                    <Link key={link.to} to={link.to} role="menuitem" onClick={() => setEcoOpen(false)}>
                      {t.nav[navLabelKey[link.label]] ?? link.label}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          </ul>
        </nav>

        <div className="nav-actions">
          <LanguageToggle />
          <CTAButton to="/booking" variant="primary" size="sm">
            {t.nav.bookNow}
          </CTAButton>
          <button
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

      <div id="mobile-nav-panel" className={`mobile-nav ${mobileOpen ? "is-open" : ""}`}>
        <div className="container">
          <nav aria-label="Mobile primary">
            <ul>
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
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
                        <NavLink to={link.to} onClick={() => setMobileOpen(false)}>
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
            <CTAButton to="/booking" onClick={() => setMobileOpen(false)}>
              {t.nav.bookNow}
            </CTAButton>
          </div>
        </div>
      </div>
    </header>
  );
}
