// src\components\Footer.jsx
import { Link } from "react-router-dom";
import { ECO_VILLAGE_LINKS, NAV_LINKS, SITE } from "../data/siteConfig";
import { useLanguage } from "../context/LanguageContext";
import LanguageToggle from "./LanguageToggle";

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

function FooterIcon({ type }) {
  if (type === "phone") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .8 3a2 2 0 0 1-.5 2.1L8.1 10a16 16 0 0 0 5.9 5.9l1.2-1.3a2 2 0 0 1 2.1-.5c1 .4 2 .7 3 .8A2 2 0 0 1 22 16.9Z" />
      </svg>
    );
  }

  if (type === "email") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FooterContactItem({ icon, label, children }) {
  return (
    <li className="footer-contact-item">
      <span className="footer-icon" aria-hidden="true">
        <FooterIcon type={icon} />
      </span>
      <span className="footer-detail">
        <span className="footer-value">
          <span className="visually-hidden">{label}: </span>
          {children}
        </span>
      </span>
    </li>
  );
}

export default function Footer() {
  const { t, tx } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-shell">
        <div className="footer-grid">
          <section className="footer-col footer-col-brand" aria-labelledby="footer-brand-heading">
            <h2 id="footer-brand-heading" className="visually-hidden">
              {SITE.brandName}
            </h2>
            <Link to="/" className="brand-mark">
              <img src={SITE.logoSrc} alt={tx("Karibu Assalam logo")} />
              <span>{SITE.brandName}</span>
            </Link>
            <p className="footer-tagline">{tx(SITE.tagline)}</p>
          </section>

          <nav className="footer-col" aria-label="Footer navigation">
            <h2 className="footer-heading">{tx("Explore")}</h2>
            <ul className="footer-links">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>{t.nav[navLabelKey[link.label]] ?? tx(link.label)}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="footer-col" aria-label="Eco-village navigation">
            <h2 className="footer-heading">{t.nav.ecoVillage}</h2>
            <ul className="footer-links">
              {ECO_VILLAGE_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>{t.nav[navLabelKey[link.label]] ?? tx(link.label)}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <section className="footer-col footer-col-contact" aria-labelledby="footer-contact-heading">
            <h2 id="footer-contact-heading" className="footer-heading">
              {t.nav.contact}
            </h2>

            <ul className="footer-contact-list">
              <FooterContactItem icon="phone" label={tx("Phone")}>
                <a href={`tel:${SITE.phoneTel}`}>{SITE.phoneDisplay}</a>
              </FooterContactItem>

              <FooterContactItem icon="email" label={tx("Email")}>
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </FooterContactItem>

              <FooterContactItem icon="instagram" label={tx("Follow Us")}>
                <a
                  className="footer-social-link"
                  href={SITE.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Karibu Assalam on Instagram"
                >
                  {SITE.instagramHandle}
                </a>
              </FooterContactItem>
            </ul>

          </section>
        </div>

        <div className="footer-bottom">
          <p className="footer-meta">
            {"\u00A9"} {year} {SITE.brandName}
          </p>
          <LanguageToggle compact />
        </div>
      </div>
    </footer>
  );
}
