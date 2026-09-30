import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { SITE } from "../data/siteConfig";
import PhotoCardMedia from "./PhotoCardMedia";
import CafeRating from "./CafeRating";

export default function EventCard({ item }) {
  const { tx } = useLanguage();
  const externalUrl = item.href || (item.external ? SITE[item.external] : null);
  return (
    <article className="event-card">
      <PhotoCardMedia photo={item.photo} />
      <h3>{tx(item.title)}</h3>
      <p>{tx(item.text)}</p>
      {item.slug === "stone-town-cafe" && <CafeRating compact />}
      <div className="event-card-action">
        {externalUrl ? (
          <a className="text-link" href={externalUrl} target="_blank" rel="noopener noreferrer">
            {tx(item.linkLabel)}<span aria-hidden="true"> ↗</span>
          </a>
        ) : (
          <Link className="text-link" to={item.to} target="_blank" rel="noopener noreferrer">
            {tx(item.linkLabel)}<span aria-hidden="true"> ↗</span>
          </Link>
        )}
      </div>
    </article>
  );
}
