import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import CTAButton from "./CTAButton";
import { SITE } from "../data/siteConfig";

function Arrow({ previous = false }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={previous ? "m14 6-6 6 6 6" : "m10 6 6 6-6 6"} />
    </svg>
  );
}

export function ProgrammeSlide({ item, priority = false }) {
  const { tx, language } = useLanguage();
  const dateFormatter = new Intl.DateTimeFormat(
    { en: "en-GB", tr: "tr-TR", de: "de-DE" }[language] || "en-GB",
    { day: "numeric", month: "long", timeZone: "UTC" },
  );
  const formatDate = (value) => dateFormatter.format(new Date(`${value}T12:00:00Z`));
  const date = item.date && formatDate(item.date);

  return (
    <article className="happenings-slide">
      <div className={`happenings-photo${item.imageFit === "contain" ? " happenings-photo--contain" : ""}`}>
        <img src={item.image} alt={tx(item.alt)} width="1200" height="800" loading={priority ? "eager" : "lazy"} decoding="async" />
      </div>
      <div className="happenings-programme">
        <p className="happenings-date">
          {date ? <time dateTime={item.date}>{date}</time> : tx(item.schedule || "Date to be confirmed")}
          {date && item.endDate && <><span aria-hidden="true"> - </span><time dateTime={item.endDate}>{formatDate(item.endDate)}</time></>}
        </p>
        <h3>{tx(item.title)}</h3>
        <p>{tx(item.description)}</p>
        {!date && !item.schedule && <p className="happenings-preview-note">{tx("Activity preview - not a confirmed event.")}</p>}
        <div className="inline-actions happenings-actions">
          {item.to && <Link className="text-link" to={item.to}>{tx("More details")}</Link>}
          {item.detailsUrl && <a className="text-link" href={item.detailsUrl} target="_blank" rel="noopener noreferrer">{tx("More details")}</a>}
          {item.bookingTo && <CTAButton to={item.bookingTo}>Book Now</CTAButton>}
          {item.joinLabel && item.whatsAppMessage && (
            <CTAButton href={`https://wa.me/${SITE.whatsAppPhone}?text=${encodeURIComponent(tx(item.whatsAppMessage))}`} newTab>
              {item.joinLabel}
            </CTAButton>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ProgrammeSlider({ items }) {
  const { tx } = useLanguage();
  const [index, setIndex] = useState(0);
  if (!items.length) return null;
  const current = index % items.length;
  const go = (next) => setIndex((next + items.length) % items.length);

  return (
    <div className="happenings-carousel" role="region" aria-roledescription={tx("carousel")} aria-label={tx("Campus activities")}>
      {/* Manual navigation only: no timer, unexpected movement or lost focus. */}
      <div className="happenings-current" id="programme-slide" aria-live="polite" aria-atomic="true">
        <ProgrammeSlide key={items[current].id} item={items[current]} priority />
      </div>
      {items.length > 1 && <div className="happenings-controls" onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          go(current + (event.key === "ArrowRight" ? 1 : -1));
        }
      }}>
        <button type="button" className="happenings-arrow" aria-label={tx("Previous activity")} aria-controls="programme-slide" onClick={() => go(current - 1)}><Arrow previous /></button>
        <div className="happenings-pagination">
          <p>{tx("Activity {number} of {total}", { number: current + 1, total: items.length })}</p>
          <div className="happenings-dots">
            {items.map((item, itemIndex) => (
              <button key={item.id} type="button" className="happenings-dot" aria-label={tx("Show activity {number}: {title}", { number: itemIndex + 1, title: tx(item.title) })}
                aria-pressed={itemIndex === current} aria-controls="programme-slide" onClick={() => go(itemIndex)}><span aria-hidden="true" /></button>
            ))}
          </div>
        </div>
        <button type="button" className="happenings-arrow" aria-label={tx("Next activity")} aria-controls="programme-slide" onClick={() => go(current + 1)}><Arrow /></button>
      </div>}
    </div>
  );
}
