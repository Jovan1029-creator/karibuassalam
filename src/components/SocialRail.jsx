import { SITE } from "../data/siteConfig";
import { useLanguage } from "../context/LanguageContext";
import useHeaderState from "../hooks/useHeaderState";

function Icon({ type }) {
  if (type === "instagram") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (type === "whatsapp") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.5 3.5A11.9 11.9 0 0 0 12.1 0C5.5 0 .2 5.3.2 11.9c0 2.1.5 4.1 1.6 5.9L0 24l6.4-1.7a11.8 11.8 0 0 0 5.7 1.5c6.5 0 11.9-5.3 11.9-11.9 0-3.2-1.2-6.2-3.5-8.4Zm-8.4 18.3a9.9 9.9 0 0 1-5-1.4l-.4-.2-3.8 1 1-3.7-.2-.4a9.9 9.9 0 0 1-1.5-5.2c0-5.5 4.4-9.9 9.9-9.9 2.6 0 5.1 1 7 2.9a9.8 9.8 0 0 1 2.9 7c0 5.4-4.4 9.9-9.9 9.9Zm5.4-7.4c-.3-.2-1.8-.9-2-1s-.5-.1-.7.1-.8 1-.9 1.2-.4.2-.7.1-1.3-.5-2.4-1.5a9 9 0 0 1-1.7-2.1c-.2-.3 0-.5.1-.6l.5-.5.3-.5c.1-.2 0-.4 0-.5l-.9-2.2c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4s-1 1-1 2.5 1.1 2.9 1.2 3.1 2.1 3.2 5.1 4.5c.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4s.3-1.3.2-1.4Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

/** Fixed rail on the left edge, as on the reference site. */
export default function SocialRail() {
  const { tx } = useLanguage();
  const { isHome, scrolled } = useHeaderState();

  const links = [
    { type: "instagram", href: SITE.instagramUrl, label: tx("Follow us on Instagram"), external: true },
    { type: "whatsapp", href: `https://wa.me/${SITE.whatsAppPhone}`, label: tx("Message us on WhatsApp"), external: true },
    { type: "email", href: `mailto:${SITE.email}`, label: tx("Email"), external: false },
  ];

  // White marks read on the hero photograph; anywhere else they need ink.
  const onLight = !isHome || scrolled;

  return (
    <nav
      className={["social-rail", onLight ? "on-light" : ""].filter(Boolean).join(" ")}
      aria-label={tx("Stay connected")}
    >
      {links.map((link) => (
        <a
          key={link.type}
          href={link.href}
          aria-label={link.label}
          title={link.label}
          {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          <Icon type={link.type} />
        </a>
      ))}
    </nav>
  );
}
