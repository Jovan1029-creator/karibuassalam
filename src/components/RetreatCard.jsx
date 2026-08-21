import { Link } from "react-router-dom";
import Card from "./Card";
import { useLanguage } from "../context/LanguageContext";

// Currency position differs by locale: "€900" in English, "900 €" in Turkish
// and German. Intl handles all three.
function formatPrice(priceFrom, language) {
  return new Intl.NumberFormat(language, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(priceFrom);
}

export default function RetreatCard({ retreat }) {
  const { tx, language } = useLanguage();

  return (
    <Card className="retreat-card">
      <div className="media-frame">
        <img
          src={retreat.heroImage}
          alt={`${tx(retreat.title)} ${tx("retreat preview")}`}
          loading="lazy"
          decoding="async"
          width="768"
          height="576"
        />
      </div>
      <div className="card-body">
        <div className="card-meta">
          <span className="pill">
            {tx("From")} {formatPrice(retreat.priceFrom, language)}
          </span>
          <span className="pill muted">
            {retreat.durationDays ?? retreat.itineraryDays.length} {tx("days")}
          </span>
        </div>
        <h3>{tx(retreat.title)}</h3>
        <p>{tx(retreat.shortPromise)}</p>
        <Link className="text-link" to={`/retreats/${retreat.slug}`}>
          {tx("View details")}
        </Link>
      </div>
    </Card>
  );
}
