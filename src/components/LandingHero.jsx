import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import heroPoster from "../../AssalamHero/hero-poster.webp";
import heroPosterMobile from "../../AssalamHero/hero-poster-mobile.webp";
import heroVideo from "../../pics/video/hero-720.mp4";

const MOBILE_QUERY = "(max-width: 700px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

// The video is only worth its bytes on a connection and a screen that can use
// it. Small screens, reduced-motion and data-saver visitors get the poster.
function useWantsVideo() {
  const [wantsVideo, setWantsVideo] = useState(false);

  useEffect(() => {
    const small = window.matchMedia(MOBILE_QUERY);
    const reduced = window.matchMedia(REDUCED_MOTION_QUERY);
    const saveData = navigator.connection?.saveData === true;

    const update = () => setWantsVideo(!small.matches && !reduced.matches && !saveData);
    update();

    small.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => {
      small.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  return wantsVideo;
}

export default function LandingHero() {
  const { t, tx } = useLanguage();
  const wantsVideo = useWantsVideo();
  const videoRef = useRef(null);

  useEffect(() => {
    if (wantsVideo) videoRef.current?.play?.().catch(() => {});
  }, [wantsVideo]);

  return (
    <section className="landing-hero" aria-label={tx("Karibu Assalam Zanzibar travel hero")}>
      {wantsVideo ? (
        <video
          ref={videoRef}
          className="landing-hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={heroPoster}
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
      ) : (
        <picture>
          <source media={MOBILE_QUERY} srcSet={heroPosterMobile} />
          <img
            className="landing-hero-video"
            src={heroPoster}
            alt=""
            width="1600"
            height="900"
            fetchpriority="high"
          />
        </picture>
      )}

      <div className="landing-hero-overlay" aria-hidden="true" />

      <div className="container landing-hero-shell">
        <div className="landing-hero-copy">
          <p className="landing-hero-eyebrow">
            <span className="live-dot" aria-hidden="true" />
            {tx("Zanzibar's only community-run eco-village")}
          </p>

          <h1>
            {tx("Explore Beautiful")} <em>{tx("Zanzibar")}</em>
          </h1>

          <p>
            {tx(
              "A halal-friendly eco-village in Zanzibar where your stay funds local schools, women's training and youth camps. Running since 2017."
            )}
          </p>

          <div className="inline-actions landing-hero-actions">
            <Link className="btn btn-primary btn-lg" to="/booking">
              {t.nav.bookNow}
            </Link>
            <Link className="btn btn-secondary" to="/retreats">
              {t.common.exploreRetreats}
            </Link>
          </div>

          <a className="landing-hero-scroll" href="#plan-your-stay">
            {tx("Scroll to explore")}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 5v14M6 13l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
