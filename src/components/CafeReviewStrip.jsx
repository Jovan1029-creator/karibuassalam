import { useLanguage } from "../context/LanguageContext";
import { SPICE_ROUTE_CAFE } from "../data/siteConfig";
import CafeRating from "./CafeRating";

export default function CafeReviewStrip() {
  const { tx } = useLanguage();

  return (
    <aside className="cafe-review-strip">
      <div className="cafe-review-strip-copy">
        <p className="eyebrow">{tx("Stone Town")}</p>
        <h3>{SPICE_ROUTE_CAFE.name}</h3>
        <p className="cafe-location-note">
          {tx("This cafe is in Stone Town, separate from our eco-village in Kizimkazi.")}
        </p>
      </div>
      <CafeRating />
    </aside>
  );
}
