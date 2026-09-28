import { NavLink, Link, useLocation } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { ECO_VILLAGE_LINKS, EXPERIENCE_LINKS, NAV_LINKS, NAV_LINKS_TAIL, RETREAT_LINKS, SITE } from "../data/siteConfig";
import { useLanguage } from "../context/LanguageContext";
import LanguageToggle from "./LanguageToggle";
import CTAButton from "./CTAButton";
import useHeaderState from "../hooks/useHeaderState";

const navLabelKey = {
  Home: "home",
  "About Us": "about",
  Retreats: "retreats",
  Experiences: "experiences",
  FAQ: "faq",
  Contact: "contact",
  Campus: "campus",
  Accommodations: "accommodations",
  Restaurant: "restaurant",
};

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

function DropdownChevron() {
  return (
    <svg className="nav-dropdown-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ecoOpen, setEcoOpen] = useState(false);
  const [retreatOpen, setRetreatOpen] = useState(false);
  const [experienceOpen, setExperienceOpen] = useState(false);
  const [ecoMobileOpen, setEcoMobileOpen] = useState(false);
  const [retreatMobileOpen, setRetreatMobileOpen] = useState(false);
  const [experienceMobileOpen, setExperienceMobileOpen] = useState(false);
  const navRef = useRef(null);
  const panelRef = useRef(null);
  const menuButtonRef = useRef(null);
  const { t, tx } = useLanguage();
  const location = useLocation();
  const { isHome, scrolled } = useHeaderState();

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    setEcoMobileOpen(false);
    setRetreatMobileOpen(false);
    setExperienceMobileOpen(false);
  }, []);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        if (mobileOpen) menuButtonRef.current?.focus();
        closeMobile();
        setEcoOpen(false);
        setRetreatOpen(false);
        setExperienceOpen(false);
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
        setRetreatOpen(false);
        setExperienceOpen(false);
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
    const desktop = window.matchMedia("(min-width: 961px)");
    const closeOnDesktop = () => {
      if (desktop.matches) closeMobile();
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, [closeMobile]);

  useEffect(() => {
    closeMobile();
    setEcoOpen(false);
    setRetreatOpen(false);
    setExperienceOpen(false);
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
            <span className="brand-mark__subtitle">Eco Resort · Zanzibar</span>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary">
          <ul>
            {NAV_LINKS.map((link) =>
              link.label === "Retreats" ? (
                <li
                  className="nav-dropdown"
                  key={link.to}
                  onMouseEnter={() => setRetreatOpen(true)}
                  onMouseLeave={() => setRetreatOpen(false)}
                >
                  <button
                    type="button"
                    className={`nav-dropdown-trigger ${retreatOpen || location.pathname.startsWith("/retreats") ? "is-active" : ""}`}
                    aria-expanded={retreatOpen}
                    aria-controls="retreat-menu"
                    onClick={() => setRetreatOpen(true)}
                  >
                    {t.nav.retreats}
                    <DropdownChevron />
                  </button>
                  {retreatOpen && (
                    <ul id="retreat-menu" className="dropdown-menu retreat-dropdown-menu">
                      <li className="dropdown-menu-heading" role="presentation">{t.nav.retreats}</li>
                      {RETREAT_LINKS.map((item) => (
                        <li key={item.to}>
                          <Link to={item.to} onClick={() => setRetreatOpen(false)}>{tx(item.name)}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ) : link.label === "Experiences" ? (
                <li
                  className="nav-dropdown"
                  key={link.to}
                  onMouseEnter={() => setExperienceOpen(true)}
                  onMouseLeave={() => setExperienceOpen(false)}
                >
                  <button
                    type="button"
                    className={`nav-dropdown-trigger ${experienceOpen || location.pathname.startsWith("/experiences") ? "is-active" : ""}`}
                    aria-expanded={experienceOpen}
                    aria-controls="experience-menu"
                    onClick={() => setExperienceOpen(true)}
                  >
                    {t.nav.experiences}
                    <DropdownChevron />
                  </button>
                  {experienceOpen && (
                    <ul id="experience-menu" className="dropdown-menu experience-dropdown-menu">
                      <li className="dropdown-menu-heading" role="presentation">{t.nav.experiences}</li>
                      {EXPERIENCE_LINKS.map((item) => (
                        <li key={item.to}>
                          <Link to={item.to} onClick={() => setExperienceOpen(false)}>{tx(item.name)}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ) : (
                <li key={link.to}>
                  <NavLink to={link.to} className={({ isActive }) => (isActive ? "is-active" : "")}>
                    {t.nav[navLabelKey[link.label]] ?? link.label}
                  </NavLink>
                </li>
              )
            )}
            {/* Opens on hover for pointers, on click for touch and keyboard. */}
            <li
              className="nav-dropdown"
              onMouseEnter={() => setEcoOpen(true)}
              onMouseLeave={() => setEcoOpen(false)}
            >
              <button
                type="button"
                className={`nav-dropdown-trigger ${ecoOpen ? "is-active" : ""}`}
                aria-expanded={ecoOpen}
                aria-controls="eco-village-menu"
                onClick={() => setEcoOpen(true)}
              >
                {t.nav.ecoVillage}
                <DropdownChevron />
              </button>
              {ecoOpen && (
                <ul id="eco-village-menu" className="dropdown-menu">
                  <li className="dropdown-menu-heading" role="presentation">{t.nav.ecoVillage}</li>
                  {ECO_VILLAGE_LINKS.map((link) => (
                    <li key={link.to}>
                      <Link to={link.to} onClick={() => setEcoOpen(false)}>
                        {link.name ? tx(link.name) : t.nav[navLabelKey[link.label]] ?? link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            {NAV_LINKS_TAIL.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className={({ isActive }) => (isActive ? "is-active" : "")}>
                  {t.nav[navLabelKey[link.label]] ?? link.label}
                </NavLink>
              </li>
            ))}
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
              {NAV_LINKS.map((link) =>
                link.label === "Retreats" ? (
                  <li key={link.to}>
                    <button
                      type="button"
                      className="mobile-submenu-trigger"
                      aria-expanded={retreatMobileOpen}
                      onClick={() => setRetreatMobileOpen((value) => !value)}
                    >
                      {t.nav.retreats}
                      <DropdownChevron />
                    </button>
                    {retreatMobileOpen && (
                      <ul className="mobile-submenu">
                        {RETREAT_LINKS.map((item) => (
                          <li key={item.to}><NavLink to={item.to} onClick={closeMobile}>{tx(item.name)}</NavLink></li>
                        ))}
                      </ul>
                    )}
                  </li>
                ) : link.label === "Experiences" ? (
                  <li key={link.to}>
                    <button
                      type="button"
                      className="mobile-submenu-trigger"
                      aria-expanded={experienceMobileOpen}
                      onClick={() => setExperienceMobileOpen((value) => !value)}
                    >
                      {t.nav.experiences}
                      <DropdownChevron />
                    </button>
                    {experienceMobileOpen && (
                      <ul className="mobile-submenu">
                        {EXPERIENCE_LINKS.map((item) => (
                          <li key={item.to}><NavLink to={item.to} onClick={closeMobile}>{tx(item.name)}</NavLink></li>
                        ))}
                      </ul>
                    )}
                  </li>
                ) : (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      onClick={closeMobile}
                      className={({ isActive }) => (isActive ? "is-active" : "")}
                    >
                      {t.nav[navLabelKey[link.label]] ?? link.label}
                    </NavLink>
                  </li>
                )
              )}
              <li>
                <button
                  type="button"
                  className="mobile-submenu-trigger"
                  aria-expanded={ecoMobileOpen}
                  onClick={() => setEcoMobileOpen((v) => !v)}
                >
                  {t.nav.ecoVillage}
                  <DropdownChevron />
                </button>
                {ecoMobileOpen && (
                  <ul className="mobile-submenu">
                    {ECO_VILLAGE_LINKS.map((link) => (
                      <li key={link.to}>
                        <NavLink to={link.to} onClick={closeMobile}>
                          {link.name ? tx(link.name) : t.nav[navLabelKey[link.label]] ?? link.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              {NAV_LINKS_TAIL.map((link) => (
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
