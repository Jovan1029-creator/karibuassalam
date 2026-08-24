import { useState } from "react";
import Section from "./Section";
import Lightbox from "./Lightbox";
import { SITE } from "../data/siteConfig";
import { useLanguage } from "../context/LanguageContext";
import workshopImg from "../../pics/our stories/vassalam-activities35.png";
import communityImg from "../../pics/our stories/vassalam-activities40.png";
import mealsImg from "../../pics/our stories/vassalam-activities33.png";
import educationImg from "../../pics/our stories/education-1-enhanced.webp";
import coastImg from "../../pics/rooms/Image-2-edited-enhanced.webp";
import roomImg from "../../pics/rooms/camps-22-enhanced.webp";

// Six images fill all eight cells of the 4 x 2 mosaic: one tall, one wide, four
// single. Adding or removing an entry means re-checking the spans.
const moments = [
  {
    image: workshopImg,
    alt: "Children gathered around a workshop table during a Karibu Assalam activity",
    label: "Learning together",
    className: "moment-card-tall",
  },
  {
    image: coastImg,
    alt: "Beachfront swing and gathering area at Assalam Ecolodge",
    label: "Eco-village by the coast",
    className: "moment-card-wide",
  },
  {
    image: roomImg,
    alt: "Prepared guest room at Assalam Ecolodge",
    label: "Rooms prepared for guests",
    className: "",
  },
  {
    image: communityImg,
    alt: "Visitors and local children together during a community activity",
    label: "Community moments",
    className: "",
  },
  {
    image: mealsImg,
    alt: "Guests and the kitchen team sharing a meal together",
    label: "Shared meals",
    className: "",
  },
  {
    image: educationImg,
    alt: "Participants working together during a hands-on workshop",
    label: "Hands-on workshops",
    className: "",
  },
];

export default function CampusMoments() {
  const { tx } = useLanguage();
  const [lightbox, setLightbox] = useState(null);

  return (
    <Section
      eyebrow={tx("Life at Assalam")}
      title={tx("A glimpse of camp life")}
      subtitle={tx(
        "See the spaces, workshops, and shared moments behind each stay. Open Instagram for the latest updates from the team."
      )}
      className="moments-section"
    >
      <div className="moments-grid">
        {moments.map((moment, i) => (
          <button
            type="button"
            key={moment.label}
            className={`moment-card ${moment.className}`.trim()}
            aria-label={`${tx(moment.label)} - ${tx("View photo")}`}
            onClick={() => setLightbox(i)}
          >
            <img
              src={moment.image}
              alt={tx(moment.alt)}
              loading="lazy"
              decoding="async"
              width="768"
              height="576"
            />
            <span>{tx(moment.label)}</span>
            <span className="moment-zoom" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5M11 8v6M8 11h6" strokeLinecap="round" />
              </svg>
            </span>
          </button>
        ))}
      </div>

      {lightbox !== null && (
        <Lightbox
          items={moments}
          index={lightbox}
          onChange={setLightbox}
          onClose={() => setLightbox(null)}
        />
      )}
      <div className="moments-footer">
        <p>{tx("For current photos and announcements, follow the team on Instagram.")}</p>
        <a className="btn btn-secondary" href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer">
          {tx("Follow us on Instagram")}
        </a>
      </div>
    </Section>
  );
}
