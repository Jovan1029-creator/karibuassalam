import { useLanguage } from "../context/LanguageContext";
import { SPICE_ROUTE_CAFE } from "../data/siteConfig";

// Intentionally venue-specific: these reviews must never imply a resort rating.
export default function CafeRating() {
  const { language, tx } = useLanguage();
  const rating = new Intl.NumberFormat(language, { minimumFractionDigits: 1, maximumFractionDigits: 1 })
    .format(SPICE_ROUTE_CAFE.rating);
  const date = new Intl.DateTimeFormat(language, { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" })
    .format(new Date(`${SPICE_ROUTE_CAFE.checkedAt}T00:00:00Z`));

  return (
    <div className="cafe-rating" role="group" aria-label={tx("Tripadvisor rating for The Spice Route Cafe")}>
      <p className="eyebrow">{tx("Cafe reviews on Tripadvisor")}</p>
      <div className="cafe-rating-summary">
        <strong className="cafe-rating-score" aria-label={tx("{rating} out of 5", { rating })}>
          {rating}<span aria-hidden="true"> / 5</span>
        </strong>
        <a href={SPICE_ROUTE_CAFE.tripAdvisorUrl} target="_blank" rel="noopener noreferrer">
          {tx("{count} Tripadvisor reviews", { count: SPICE_ROUTE_CAFE.reviewCount })}
          <span aria-hidden="true"> ↗</span>
        </a>
      </div>
      <small className="cafe-rating-note">
        {tx("Rating snapshot checked {date}. See Tripadvisor for the latest reviews.", { date })}
      </small>
    </div>
  );
}
