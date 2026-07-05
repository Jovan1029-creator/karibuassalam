import { Link } from "react-router-dom";
import { SITE } from "../data/siteConfig";
import { useLanguage } from "../context/LanguageContext";
import heroImage from "../../AssalamHero/assalam-hero.webp";
import heroImageMobile from "../../AssalamHero/assalam-hero-mobile.webp";
import heroFallback from "../../AssalamHero/assalam-hero.jpg";

export default function LandingHero() {
  const { t, tx } = useLanguage();

  return (
    <section className="landing-hero" aria-label={tx("Karibu Assalam Zanzibar travel hero")}>
      <picture className="landing-hero-picture" aria-hidden="true">
        <source media="(max-width: 700px)" srcSet={heroImageMobile} type="image/webp" />
        <source srcSet={heroImage} type="image/webp" />
        <img
          className="landing-hero-image"
          src={heroFallback}
          alt=""
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </picture>
      <div className="landing-hero-overlay" aria-hidden="true" />

      <div className="container landing-hero-shell">
        <div className="landing-hero-stage">
          <div className="landing-hero-contact" aria-label={tx("Quick contact")}>
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            <a href={`tel:${SITE.phoneTel}`}>{SITE.phoneDisplay}</a>
          </div>

          <div className="landing-hero-center">
            <p className="landing-hero-script">{tx("Explore Beautiful")}</p>
            <h1 data-text={tx("Zanzibar")}>{tx("Zanzibar")}</h1>
            <p>
              {tx(
                "Immersive halal travel, eco-village stays, and community-based retreats from Assalam Ecolodge."
              )}
            </p>
            <div className="inline-actions landing-hero-actions">
              <Link className="btn btn-primary" to="/booking">
                {t.nav.bookNow}
              </Link>
              <Link className="btn btn-secondary" to="/retreats">
                {t.common.exploreRetreats}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
