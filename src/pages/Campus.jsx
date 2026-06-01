// src\pages\Campus.jsx
import Hero from "../components/Hero";
import Section from "../components/Section";
import SEO from "../components/SEO";
import { useLanguage } from "../context/LanguageContext";
import campusImg from "../../pics/rooms/Image-2-edited-768x576.webp";

const features = [
  "International School",
  "Permaculture Garden",
  "Renewable Energy",
  "Oceanside",
  "Multicultural",
];

export default function Campus() {
  const { tx } = useLanguage();

  return (
    <main id="main-content">
      <SEO
        title={tx("Eco-Village Campus | Karibu Assalam")}
        description={tx(
          "Explore the Karibu Assalam eco-village campus with an international school setting, permaculture garden, renewable energy, and oceanside learning spaces."
        )}
        image={campusImg}
      />
      <Hero
        eyebrow={tx("Eco-Village")}
        title={tx("Assalam eco-village campus")}
        subtitle={tx(
          "An oceanside, multicultural campus environment designed for learning, community activities, and sustainability-focused living."
        )}
        imageSrc={campusImg}
        imageAlt="Assalam eco-village campus gathering area"
        compact
      />

      <Section title={tx("Campus Features")}>
        <div className="pill-list">
          {features.map((feature) => (
            <span key={feature} className="pill">
              {tx(feature)}
            </span>
          ))}
        </div>
      </Section>

      <Section title={tx("Campus Life")} className="surface-section">
        <div className="content-card">
          <p>
            {tx(
              "The campus includes renewable energy systems such as solar panels, an amphitheater for group gatherings, a communal eating area, and a pool designed for the youngest learners."
            )}
          </p>
          <p>
            {tx(
              "Its oceanside setting supports community-based learning, shared meals, and daily activities in a multicultural environment."
            )}
          </p>
        </div>
      </Section>
    </main>
  );
}
