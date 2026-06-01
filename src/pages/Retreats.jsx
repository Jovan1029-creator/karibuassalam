import Hero from "../components/Hero";
import Section from "../components/Section";
import RetreatCard from "../components/RetreatCard";
import CTAButton from "../components/CTAButton";
import SEO from "../components/SEO";
import { retreats, COMMON_INCLUSIONS } from "../data/retreats";
import { useLanguage } from "../context/LanguageContext";
import heroImg from "../../pics/our retreats/Nature Retreat.webp";

export default function Retreats() {
  const { tx } = useLanguage();

  return (
    <main id="main-content">
      <SEO
        title={tx("Retreats & Camps at Assalam Ecolodge | Karibu Assalam")}
        description={tx(
          "Explore Karibu Assalam retreats and camps at Assalam Ecolodge with guided tours, meals, accommodations, airport transport, and seminars/activities."
        )}
        image={heroImg}
      />

      <Hero
        eyebrow={tx("Retreats")}
        title={tx("Retreats & Camps at Assalam Ecolodge")}
        subtitle={tx(
          "Karibu Assalam offers retreats and camps from Assalam Ecolodge, with the provided framing of the only eco-village in Zanzibar."
        )}
        imageSrc={heroImg}
        imageAlt="Nature retreat scenery at Assalam Ecolodge"
        compact
        ctaPrimary={{ to: "/booking", label: tx("Book Now") }}
      />

      <Section
        title={tx("What is included in camp packages")}
        subtitle={tx("Camp packages include the following core services and participation elements.")}
      >
        <div className="grid cards-2">
          <ul className="check-list card plain">
            {COMMON_INCLUSIONS.map((item) => (
              <li key={item}>{tx(item)}</li>
            ))}
          </ul>
          <div className="card plain note-card">
            <h3>{tx("Accommodations-only booking is also available")}</h3>
            <p>
              {tx("Guests can book accommodations at Assalam Ecolodge without attending a camp.")}
            </p>
            <CTAButton to="/booking" variant="secondary">
              {tx("Contact for accommodation booking")}
            </CTAButton>
          </div>
        </div>
      </Section>

      <Section title={tx("Our retreats and camps")} className="surface-section">
        <div className="grid cards-3">
          {retreats.map((retreat) => (
            <RetreatCard key={retreat.slug} retreat={retreat} />
          ))}
        </div>
        <div className="section-actions">
          <CTAButton to="/booking">{tx("Book Now")}</CTAButton>
        </div>
      </Section>
    </main>
  );
}
