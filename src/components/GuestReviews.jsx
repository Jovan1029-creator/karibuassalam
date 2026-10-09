import { useId, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { guestReviews, reviewSources } from "../data/guestReviews";
import { SITE } from "../data/siteConfig";

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
        <p className="eyebrow">{tx("Owner response — excerpt")}</p>
        <p>{tx(review.response.text)}</p>
      </div>}
    </div>
  );
}

export default function GuestReviews({ reviews = guestReviews }) {
  const { tx } = useLanguage();
  const [index, setIndex] = useState(0);
  const instanceId = useId();
  const titleId = `${instanceId}-title`;
  const slideId = `${instanceId}-slide`;
  if (!reviews.length) return null;
  const current = reviewIndex(index, reviews.length);
  const go = (next) => setIndex(reviewIndex(next, reviews.length));

  return (
    <section id="guest-reviews" className="section guest-reviews-section" aria-labelledby={titleId}>
      <div className="container guest-reviews-layout">
        <div className="guest-reviews-intro">
          <p className="eyebrow">{tx("Guest reviews")}</p>
          <h2 id={titleId}>{tx("From the people who’ve been here")}</h2>
          <p className="lead">{tx("Visits, workshops and volunteering — in our visitors’ own words.")}</p>
          <p>{tx("Selected excerpts about Assalam Community Foundation. Explore the original Google and Tripadvisor listings for full reviews and more perspectives.")}</p>
          <div className="guest-review-links">
            {Object.entries(reviewSources).map(([key, source]) => (
              <a key={key} className="text-link" href={source.href} target="_blank" rel="noopener noreferrer">
                {tx(source.linkLabel)}<span aria-hidden="true"> ↗</span>
              </a>
            ))}
          </div>
        </div>
        <div className="guest-review-carousel" role="region" aria-roledescription={tx("carousel")} aria-label={tx("Guest reviews")}>
          {/* No autoplay, photos, inferred stars or combined venue scores. */}
          <div id={slideId} aria-live="polite" aria-atomic="true">
            <ReviewQuote review={reviews[current]} />
          </div>
          {reviews.length > 1 && <div className="guest-review-controls" onKeyDown={(event) => {
            const next = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: reviews.length - 1 }[event.key];
            if (next !== undefined) { event.preventDefault(); go(next); }
          }}>
            <button type="button" aria-label={tx("Previous review")} aria-controls={slideId} onClick={() => go(current - 1)}><span aria-hidden="true">←</span></button>
            <p role="status">{tx("Review {number} of {total}", { number: current + 1, total: reviews.length })}</p>
            <button type="button" aria-label={tx("Next review")} aria-controls={slideId} onClick={() => go(current + 1)}><span aria-hidden="true">→</span></button>
          </div>}
        </div>
      </div>
    </section>
  );
}
