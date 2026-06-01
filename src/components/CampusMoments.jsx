import Section from "./Section";
import { SITE } from "../data/siteConfig";
import { useLanguage } from "../context/LanguageContext";
import workshopImg from "../../pics/our stories/vassalam-activities35.png";
import communityImg from "../../pics/our stories/vassalam-activities40.png";
import coastImg from "../../pics/rooms/Image-2-edited-768x576.webp";
import roomImg from "../../pics/rooms/camps-22-768x576.webp";

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
];

export default function CampusMoments() {
  const { tx } = useLanguage();

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
        {moments.map((moment) => (
          <a
            key={moment.label}
            className={`moment-card ${moment.className}`.trim()}
            href={SITE.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${tx(moment.label)} - ${tx("open Instagram")}`}
          >
            <img src={moment.image} alt={tx(moment.alt)} loading="lazy" decoding="async" />
            <span>{tx(moment.label)}</span>
          </a>
        ))}
      </div>
      <div className="moments-footer">
        <p>{tx("For current photos and announcements, follow the team on Instagram.")}</p>
        <a className="btn btn-secondary" href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer">
          {tx(`Follow ${SITE.instagramHandle}`)}
        </a>
      </div>
    </Section>
  );
}
