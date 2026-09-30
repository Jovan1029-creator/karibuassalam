import Hero from "../components/Hero";
import Section from "../components/Section";
import SEO from "../components/SEO";
import CafeRating from "../components/CafeRating";
import CTAButton from "../components/CTAButton";
import { SPICE_ROUTE_CAFE } from "../data/siteConfig";
import { useLanguage } from "../context/LanguageContext";
import foodImg from "../../pics/site-marketing/fresh-shared-meal.webp";
import diningImg from "../../pics/rooms/food-1-enhanced.webp";

const features = ["Farm to Table", "Delicious", "Swahili and international cuisine", "Talented Chefs"];

export default function Restaurant() {
  const { tx } = useLanguage();

  return (
    <main id="main-content">
      <SEO
        title={tx("Food at Karibu Assalam Eco-Village | Karibu Assalam")}
        description={tx(
          "Karibu Assalam offers farm-to-table meals, Swahili and international cuisine, and beach dinners with sunset views."
        )}
        image={foodImg}
      />
      <Hero
        eyebrow={tx("Eco-Village Food")}
        title={tx("Meals prepared for camp and retreat life")}
        subtitle={tx(
          "Daily dining at Karibu Assalam Eco-Village is built around fresh meals, Swahili and international cuisine, and shared experiences."
        )}
        imageSrc={foodImg}
        imageAlt={tx("Farm-to-table meal prepared at Karibu Assalam Eco-Village")}
        compact
      />

      <Section id="dining-experience" title="Dining Experience" className="surface-section">
        <div className="pill-list dining-features">
          {features.map((feature) => (
            <span key={feature} className="pill">{tx(feature)}</span>
          ))}
        </div>
        <div className="retreat-feature-split">
          <img
            src={diningImg}
            alt={tx("A fresh meal with fruit, bread and vegetables served in a woven tray")}
            width="1672"
            height="941"
            loading="lazy"
            decoding="async"
          />
          <div className="content-card">
            <p>
              {tx(
                "Camp and retreat guests are served three meals daily, prepared by talented chefs and featuring Swahili and international cuisine."
              )}
            </p>
            <p>
              {tx(
                "Dining also includes beach dinners with sunset views, creating a shared mealtime experience alongside the program schedule."
              )}
            </p>
            <p>{tx("Karibu Assalam offers more than just food: If you would like to learn how to cook Swahili cuisine, join us for a cooking lesson. During Ramadan, we welcome you to join an iftar in our kanga village.")}</p>
          </div>
        </div>
      </Section>

      <Section id="spice-route-cafe" eyebrow="Beyond the eco-village" title="Visit us in Stone Town" className="band-mint">
        <div className="cafe-feature">
          <div className="cafe-feature-copy">
            <h3>{SPICE_ROUTE_CAFE.name}</h3>
            <p>{tx("Make time for coffee, breakfast and Zanzibar flavours at The Spice Route Cafe on Soko Muhogo Street in Stone Town.")}</p>
            <p className="cafe-location-note">{tx("This cafe is in Stone Town, separate from our eco-village in Kizimkazi.")}</p>
            <CTAButton href={SPICE_ROUTE_CAFE.tripAdvisorUrl} newTab variant="secondary">
              View the cafe on Tripadvisor
            </CTAButton>
          </div>
          <CafeRating />
        </div>
      </Section>
    </main>
  );
}
