import { useEffect, useId, useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { guestReviews, reviewSources } from "../data/guestReviews";
import { SITE } from "../data/siteConfig";
import { scheduleReviewAdvance } from "../utils/reviewAutoplay";

export function reviewIndex(index, count) {
  return count > 0 ? ((index % count) + count) % count : 0;
}

export function ReviewQuote({ review }) {
  const { language, tx } = useLanguage();
  const source = reviewSources[review.source];
  const date = review.date && new Intl.DateTimeFormat(language, { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })
    .format(new Date(`${review.date}T12:00:00Z`));

  return (
    <div className="guest-review-card">
      <figure className="guest-review-quote">
        <div className="guest-review-meta">
          <span className="guest-review-source">{source.platform}</span>
          <span>{tx(language === "en" ? "Review excerpt" : "Translated review excerpt")}</span>
        </div>
        <span className="guest-review-mark" aria-hidden="true">“</span>
        <blockquote><p>{tx(review.text)}</p></blockquote>
        <figcaption>
          <strong>{review.author}</strong>
          <span>{SITE.nonprofitName}</span>
          {date && <time dateTime={review.date}>{date}</time>}
          <a className="text-link" href={source.href} target="_blank" rel="noopener noreferrer">
            {tx(source.linkLabel)}<span aria-hidden="true"> ↗</span>
          </a>
        </figcaption>
      </figure>
      {review.response && <div className="guest-review-response">
        <p className="eyebrow">{tx("Owner response - excerpt")}</p>
        <p>{tx(review.response.text)}</p>
      </div>}
    </div>
  );
}

export default function GuestReviews({ reviews = guestReviews }) {
  const { tx } = useLanguage();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [touching, setTouching] = useState(false);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [allowsMotion, setAllowsMotion] = useState(true);
  const carouselRef = useRef(null);
  const instanceId = useId();
  const titleId = `${instanceId}-title`;
  const slideId = `${instanceId}-slide`;
  const current = reviewIndex(index, reviews.length);
  const go = (next) => setIndex(reviewIndex(next, reviews.length));
  const text = reviews[current] ? tx(reviews[current].text) : "";
  const playing = allowsMotion && inView && pageVisible && !paused && !hovered && !focused && !touching;

  useEffect(() => {
    if (!reviews.length || !carouselRef.current) return undefined;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setAllowsMotion(!preference.matches);
    const updateVisibility = () => setPageVisible(document.visibilityState === "visible");
    updatePreference();
    updateVisibility();
    preference.addEventListener("change", updatePreference);
    document.addEventListener("visibilitychange", updateVisibility);
    // Stay manual if visibility cannot be observed, rather than change unseen text.
    const observer = window.IntersectionObserver && new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting && entry.intersectionRatio >= 0.15);
    }, { threshold: [0, 0.15] });
    observer?.observe(carouselRef.current);
    return () => {
      observer?.disconnect();
      preference.removeEventListener("change", updatePreference);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, [reviews.length]);

  useEffect(() => scheduleReviewAdvance({
    enabled: playing, count: reviews.length, index: current, text, onAdvance: setIndex,
  }), [playing, reviews.length, current, text]);

  if (!reviews.length) return null;

  return (
    <section id="guest-reviews" className="section guest-reviews-section" aria-labelledby={titleId}>
      <div className="container guest-reviews-layout">
        <div className="guest-reviews-intro">
          <p className="eyebrow">{tx("Guest reviews")}</p>
          <h2 id={titleId}>{tx("From the people who’ve been here")}</h2>
          <p className="lead">{tx("Visits, workshops and volunteering - in our visitors’ own words.")}</p>
          <p>{tx("Selected excerpts about Assalam Community Foundation. Explore the original Google and Tripadvisor listings for full reviews and more perspectives.")}</p>
          <div className="guest-review-links">
            {Object.entries(reviewSources).map(([key, source]) => (
              <a key={key} className="text-link" href={source.href} target="_blank" rel="noopener noreferrer">
                {tx(source.linkLabel)}<span aria-hidden="true"> ↗</span>
              </a>
            ))}
          </div>
        </div>
        <div
          ref={carouselRef}
          className="guest-review-carousel"
          role="region"
          aria-roledescription={tx("carousel")}
          aria-label={tx("Guest reviews")}
          onPointerEnter={event => { if (event.pointerType === "mouse") setHovered(true); }}
          onPointerLeave={() => { setHovered(false); setTouching(false); }}
          onPointerDown={() => setTouching(true)}
          onPointerUp={() => setTouching(false)}
          onPointerCancel={() => setTouching(false)}
          onFocusCapture={() => setFocused(true)}
          onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
        >
          {/* Automatic changes stay silent to screen readers; manual browsing is announced. */}
          <div id={slideId} className="guest-review-slides" aria-live={playing ? "off" : "polite"} aria-atomic="true">
            {/* Overlapping grid cells reserve the tallest quote's space at every
                width/language without clipping text or measuring it after paint. */}
            {reviews.map((review, position) => (
              <div
                key={review.id}
                className={`guest-review-slide${position === current ? " is-active" : ""}`}
                aria-hidden={position !== current}
                inert={position === current ? undefined : ""}
              >
                <ReviewQuote review={review} />
              </div>
            ))}
          </div>
          {reviews.length > 1 && <div className="guest-review-controls" onKeyDown={(event) => {
            const next = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: reviews.length - 1 }[event.key];
            if (next !== undefined) { event.preventDefault(); go(next); }
          }}>
            <button type="button" aria-label={tx("Previous review")} aria-controls={slideId} onClick={() => go(current - 1)}><span aria-hidden="true">←</span></button>
            <div className="guest-review-status">
              <p role="status" aria-live={playing ? "off" : "polite"}>{tx("Review {number} of {total}", { number: current + 1, total: reviews.length })}</p>
              {allowsMotion && <button
                type="button"
                className="guest-review-toggle"
                aria-label={tx(paused ? "Resume reviews" : "Pause reviews")}
                title={tx(paused ? "Resume reviews" : "Pause reviews")}
                aria-controls={slideId}
                onClick={() => {
                  setPaused(value => !value);
                  if (paused) setFocused(false);
                }}
              >
                <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  {paused ? <path d="M6 3l11 7-11 7z" /> : <path d="M5 3h3v14H5zm7 0h3v14h-3z" />}
                </svg>
              </button>}
            </div>
            <button type="button" aria-label={tx("Next review")} aria-controls={slideId} onClick={() => go(current + 1)}><span aria-hidden="true">→</span></button>
          </div>}
        </div>
      </div>
    </section>
  );
}
