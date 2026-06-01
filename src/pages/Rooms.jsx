import Hero from "../components/Hero";
import Section from "../components/Section";
import SEO from "../components/SEO";
import { useLanguage } from "../context/LanguageContext";
import roomsImg from "../../pics/rooms/camps-22-768x576.webp";
import roomsAltImg from "../../pics/rooms/Image-2-edited-768x576.webp";

const features = ["25 m2", "5 bed capacity", "AC", "Renewable Energy", "Ocean or Garden View"];

export default function Rooms() {
  const { tx } = useLanguage();

  return (
    <main id="main-content">
      <SEO
        title={tx("Rooms at Assalam Ecolodge | Karibu Assalam")}
        description={tx(
          "Explore room features at Assalam Ecolodge including 25 m2 spaces, 5 bed capacity, AC, renewable energy, and ocean or garden views."
        )}
        image={roomsImg}
      />
      <Hero
        eyebrow={tx("Eco-Village Rooms")}
        title={tx("Comfortable stays at Assalam Ecolodge")}
        subtitle={tx(
          "Rooms are designed to support camp and retreat stays with practical comfort and proximity to the sea."
        )}
        imageSrc={roomsImg}
        imageAlt="Rooms area at Assalam Ecolodge in Zanzibar"
        compact
      />

      <Section title={tx("Room Features")}>
        <div className="pill-list">
          {features.map((feature) => (
            <span key={feature} className="pill">{tx(feature)}</span>
          ))}
        </div>
      </Section>

      <Section title={tx("Room Description")} className="surface-section">
        <div className="split">
          <div className="split-content">
            <p>
              {tx(
                "Rooms include a balcony, mosquito nets, and a location close to the sea. Each room setup includes a bathroom and bed configurations suitable for group and retreat stays."
              )}
            </p>
            <p>
              {tx(
                "Views may face the ocean or garden, and the accommodation environment is supported by renewable energy systems."
              )}
            </p>
          </div>
          <div className="split-media">
            <img src={roomsAltImg} alt="Assalam eco-village room and campus view" loading="lazy" decoding="async" />
          </div>
        </div>
      </Section>
    </main>
  );
}
