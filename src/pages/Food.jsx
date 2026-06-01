import Hero from "../components/Hero";
import Section from "../components/Section";
import SEO from "../components/SEO";
import { useLanguage } from "../context/LanguageContext";
import foodImg from "../../pics/rooms/food-1.webp";

const features = ["Farm to Table", "Delicious", "Hygienic", "Multicultural", "Talented Chefs"];

export default function Food() {
  const { tx } = useLanguage();

  return (
    <main id="main-content">
      <SEO
        title={tx("Food at Assalam Ecolodge | Karibu Assalam")}
        description={tx(
          "Karibu Assalam food service includes farm-to-table meals, hygienic preparation, multicultural flavors, and beach dinners with sunset views."
        )}
        image={foodImg}
      />
      <Hero
        eyebrow={tx("Eco-Village Food")}
        title={tx("Meals prepared for camp and retreat life")}
        subtitle={tx(
          "Daily dining at Assalam Ecolodge is built around fresh meals, hygienic preparation, and shared experiences."
        )}
        imageSrc={foodImg}
        imageAlt="Farm-to-table meal prepared at Assalam Ecolodge"
        compact
      />

      <Section title={tx("Kitchen & Dining Features")}>
        <div className="pill-list">
          {features.map((feature) => (
            <span key={feature} className="pill">{tx(feature)}</span>
          ))}
        </div>
      </Section>

      <Section title={tx("Dining Experience")} className="surface-section">
        <div className="content-card">
          <p>
            {tx(
              "Camp and retreat guests are served three meals daily, prepared by talented chefs in a hygienic kitchen environment with multicultural food influences."
            )}
          </p>
          <p>
            {tx(
              "Dining also includes beach dinners with sunset views, creating a shared mealtime experience alongside the program schedule."
            )}
          </p>
        </div>
      </Section>
    </main>
  );
}
