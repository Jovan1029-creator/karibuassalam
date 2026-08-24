import Hero from "../components/Hero";
import Section from "../components/Section";
import TornEdge from "../components/TornEdge";
import CTAButton from "../components/CTAButton";
import PhotoSlot from "../components/PhotoSlot";
import SEO from "../components/SEO";
import { useLanguage } from "../context/LanguageContext";
import campusImg from "../../pics/rooms/Image-2-edited-enhanced.webp";

const points = [
  {
    title: "Park on the campus",
    text: "Space to park inside the eco-village, within the same grounds as the lodge and the school.",
  },
  {
    title: "Use the village facilities",
    text: "Bathrooms, the kitchen and the communal areas are shared with everyone staying on site.",
  },
  {
    title: "Join the programme",
    text: "Campers are welcome at the daily campus tour, the workshops and the shared meals.",
  },
];

export default function Campers() {
  const { tx } = useLanguage();

  return (
    <main id="main-content">
      <SEO
        title={tx("Campers at Assalam Ecolodge | Karibu Assalam")}
        description={tx(
          "Space for campers inside the Karibu Assalam eco-village, with shared facilities and access to the daily programme."
        )}
        image={campusImg}
      />

      <Hero
        eyebrow={tx("Eco-Village")}
        title={tx("Arriving in your own camper")}
        subtitle={tx(
          "There is room inside the eco-village for travellers arriving with their own vehicle."
        )}
        imageSrc={campusImg}
        imageAlt={tx("Assalam eco-village campus gathering area")}
        compact
        ctaPrimary={{ to: "/booking", label: tx("Check dates and availability") }}
      />

      <div className="torn-band">
        <TornEdge position="top" color="var(--bg)" />

        <div className="set-intro">
          <p className="eyebrow">{tx("Campers")}</p>
          <h2 className="script-heading">{tx("Room for your own vehicle")}</h2>
          <p className="section-lead">
            {tx(
              "Details are confirmed with the team when you enquire — space is limited and depends on what else is running that week."
            )}
          </p>
        </div>

        <div className="container feature-split">
          <div className="feature-split-media">
            <PhotoSlot
              label={tx("Campers")}
              alt={tx("Camper parking inside the eco-village")}
              ratio="4 / 3"
            />
          </div>
          <div>
            <div className="amenity-grid amenity-grid-stacked">
              {points.map((point) => (
                <div className="amenity" key={point.title}>
                  <h3>{tx(point.title)}</h3>
                  <p>{tx(point.text)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <TornEdge position="bottom" color="var(--bg)" />
      </div>

      <Section
        scriptTitle
        eyebrow={tx("Before you come")}
        title={tx("Ask the team first")}
        subtitle={tx(
          "Because camper space depends on the week, please confirm with the team before you set off rather than arriving unannounced."
        )}
      >
        <div className="section-actions">
          <CTAButton to="/booking">{tx("Check dates and availability")}</CTAButton>
        </div>
      </Section>
    </main>
  );
}
