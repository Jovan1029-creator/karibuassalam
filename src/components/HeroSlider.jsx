import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import TornEdge from "./TornEdge";
import { retreats } from "../data/retreats";
import { useLanguage } from "../context/LanguageContext";

const INTERVAL = 7000;

function Arrow({ direction }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path
        d={direction === "prev" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HeroSlider() {
  const { t, tx, language } = useLanguage();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const regionRef = useRef(null);

  const count = retreats.length;
  const go = useCallback((next) => setIndex(((next % count) + count) % count), [count]);

  // Autoplay, paused on hover, focus, tab-hidden and reduced-motion.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (paused || reduced) return undefined;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL);
    return () => window.clearInterval(timer);
  }, [count, paused]);

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  function onKeyDown(event) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(index - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      go(index + 1);
    }
  }

  const active = retreats[index];
  const nights = active.durationDays ?? active.itineraryDays.length;
  const price = new Intl.NumberFormat(language, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(active.priceFrom);

  return (
    <section
      className="hero-slider"
      ref={regionRef}
      aria-roledescription="carousel"
      aria-label={tx("Karibu Assalam Zanzibar travel hero")}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={onKeyDown}
    >
      {retreats.map((retreat, i) => (
        <div
          key={retreat.slug}
          className={`hero-slide ${i === index ? "is-active" : ""}`.trim()}
          aria-hidden={i === index ? undefined : "true"}
        >
          <img
            src={retreat.heroImage}
            alt=""
            width="1600"
            height="900"
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
            fetchpriority={i === 0 ? "high" : "auto"}
          />
        </div>
      ))}

      <div className="hero-slider-scrim" aria-hidden="true" />

      <button
        type="button"
        className="hero-arrow prev"
        aria-label={tx("Previous slide")}
        onClick={() => go(index - 1)}
      >
        <Arrow direction="prev" />
      </button>
      <button
        type="button"
        className="hero-arrow next"
        aria-label={tx("Next slide")}
        onClick={() => go(index + 1)}
      >
        <Arrow direction="next" />
      </button>

      <div className="container hero-slider-center">
        {/* aria-live keeps screen readers informed as slides change. */}
        <h1 className="hero-script" aria-live="polite">
          {tx(active.title)}
        </h1>
        <div className="hero-slider-actions">
          <Link className="btn btn-primary btn-lg" to={`/booking?retreat=${active.slug}`}>
            {t.nav.bookNow}
          </Link>
          <Link className="btn btn-outline btn-lg" to={`/retreats/${active.slug}`}>
            {tx("More info")}
          </Link>
        </div>
      </div>

      <div className="container hero-slider-meta">
        <div>
          <p className="hero-meta-title">{tx("Assalam Ecolodge, Zanzibar")}</p>
          <dl className="hero-meta-facts">
            <div>
              <dt>{tx("Duration")}:</dt>
              <dd>
                {nights} {tx("days")}
              </dd>
            </div>
            <div>
              <dt>{tx("From")}:</dt>
              <dd>{price}</dd>
            </div>
          </dl>
        </div>
        <p className="hero-meta-desc">{tx(active.shortPromise)}</p>
      </div>

      <div className="hero-dots" role="tablist" aria-label={tx("Choose a retreat")}>
        {retreats.map((retreat, i) => (
          <button
            key={retreat.slug}
            type="button"
            role="tab"
            className={`hero-dot ${i === index ? "is-active" : ""}`.trim()}
            aria-selected={i === index}
            aria-label={tx(retreat.title)}
            onClick={() => go(i)}
          />
        ))}
      </div>

      <TornEdge position="bottom" color="var(--ink)" />
    </section>
  );
}
