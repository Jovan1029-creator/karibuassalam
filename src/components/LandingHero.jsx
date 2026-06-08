import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { SITE } from "../data/siteConfig";
import { useLanguage } from "../context/LanguageContext";
import heroVideo from "../../AssalamHero/assalam-forward-reverse-loop.mp4";
import heroPoster from "../../AssalamHero/assalam-poster.jpg";

export default function LandingHero() {
  const { t, tx } = useLanguage();
  const stageRef = useRef(null);
  const frameRef = useRef(0);

  useEffect(() => {
    return () => {
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  function handlePointerMove(event) {
    if (event.pointerType === "touch") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const stage = stageRef.current;
    if (!stage) return;
    const bounds = stage.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    frameRef.current = window.requestAnimationFrame(() => {
      stage.style.setProperty("--hero-light-x", `${(x + 0.5) * 100}%`);
      stage.style.setProperty("--hero-light-y", `${(y + 0.5) * 100}%`);
      stage.style.setProperty("--zanzibar-rotate-x", `${8 - y * 5}deg`);
      stage.style.setProperty("--zanzibar-rotate-y", `${x * 8}deg`);
      stage.style.setProperty("--zanzibar-depth-x", `${0.085 - x * 0.035}em`);
      stage.style.setProperty("--zanzibar-depth-y", `${0.105 - y * 0.025}em`);
    });
  }

  function handlePointerLeave() {
    const stage = stageRef.current;
    if (!stage) return;
    stage.style.removeProperty("--hero-light-x");
    stage.style.removeProperty("--hero-light-y");
    stage.style.removeProperty("--zanzibar-rotate-x");
    stage.style.removeProperty("--zanzibar-rotate-y");
    stage.style.removeProperty("--zanzibar-depth-x");
    stage.style.removeProperty("--zanzibar-depth-y");
  }

  return (
    <section className="landing-hero" aria-label={tx("Karibu Assalam Zanzibar travel hero")}>
      <video
        className="landing-hero-video"
        src={heroVideo}
        poster={heroPoster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      <div className="landing-hero-overlay" aria-hidden="true" />

      <div className="container landing-hero-shell">
        <div
          className="landing-hero-stage"
          ref={stageRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
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
