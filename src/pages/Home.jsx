// src\pages\Home.jsx
import LandingHero from "../components/LandingHero";
import Section from "../components/Section";
import Card from "../components/Card";
import PartnerGrid from "../components/PartnerGrid";
import EcoVillageCards from "../components/EcoVillageCards";
import RetreatCard from "../components/RetreatCard";
import CTAButton from "../components/CTAButton";
import LiveNowStrip from "../components/LiveNowStrip";
import CampusMoments from "../components/CampusMoments";
import SEO from "../components/SEO";
import { retreats } from "../data/retreats";
import { SITE } from "../data/siteConfig";
import { useLanguage } from "../context/LanguageContext";
import heroPoster from "../../AssalamHero/assalam-poster.jpg";

const sensoryCards = [
  {
    title: "Sight",
    text: "Sunsets, culture, markets, beaches, and Zanzibar's underwater beauty shape the visual rhythm of each trip.",
  },
  {
    title: "Touch",
    text: "Hands-on workshops, handcraft activities, and community volunteering bring travelers closer to local life.",
  },
  {
    title: "Hear",
    text: "Listen to market energy, fishermen routines, and shared community moments throughout the day.",
  },
  {
    title: "Smell",
    text: "Spice gardens, ocean air, and local meals create a sensory memory that lasts beyond the trip.",
  },
];

const homePillars = [
  {
    title: "Experience",
    bullets: [
      "Sunsets and culture",
      "Workshops and handcraft",
      "Markets",
      "Swim with dolphins",
      "Fishermen routines",
    ],
  },
  {
    title: "Volunteer",
    bullets: [
      "Women vocational training schools",
      "Permaculture gardens",
      "Madrasas",
      "Mobile libraries",
      "Children's universities",
    ],
  },
  {
    title: "Balance",
    bullets: [
      "Dance and sports",
      "Hiking and trekking in villages",
      "Ocean exploration at low tide",
      "Community time and guided activities",
    ],
  },
];

export default function Home() {
  const { t, tx } = useLanguage();

  return (
    <main id="main-content" className="home-page">
      <SEO
        title={tx("Karibu Assalam | Immersive Halal Travel & Volunteer Retreats in Zanzibar")}
        description={tx(
          "Karibu Assalam offers immersive sensory travel, volunteering, and halal-friendly retreat experiences in Zanzibar from the Assalam Ecolodge base."
        )}
        image={heroPoster}
      />

      <LandingHero />
      <LiveNowStrip />

      <Section
        eyebrow={tx("Plan Your Stay")}
        title={tx("Choose your Zanzibar experience")}
        subtitle={tx(
          "Start with a retreat, family program, school camp, or nature-focused stay from the Assalam Ecolodge base."
        )}
      >
        <div className="grid cards-3">
          {retreats.map((retreat) => (
            <RetreatCard key={retreat.slug} retreat={retreat} />
          ))}
        </div>
        <div className="section-actions">
          <CTAButton to="/retreats">{t.common.exploreRetreats}</CTAButton>
        </div>
      </Section>

      <CampusMoments />

      <Section
        title={tx("Experience, Volunteer, Balance")}
        subtitle={tx(
          "Travel days combine guided Zanzibar experiences with community involvement and active time."
        )}
      >
        <div className="grid cards-3">
          {homePillars.map((pillar) => (
            <Card key={pillar.title} className="feature-card">
              <h3>{tx(pillar.title)}</h3>
              <ul className="check-list">
                {pillar.bullets.map((bullet) => (
                  <li key={bullet}>{tx(bullet)}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        title={tx("Welcome to Our Eco-Village")}
        subtitle={tx(
          "Explore the living spaces, dining experience, and campus environment that support each camp and retreat at Assalam Ecolodge."
        )}
        className="surface-section"
      >
        <EcoVillageCards />
      </Section>

      <Section
        eyebrow={tx("Travel To Impact")}
        title={tx("Travel with purpose through community-based programs")}
        subtitle={tx(
          `${SITE.nonprofitName} supports service-focused activities, including Kindness Camp projects, while sustainable tourism helps connect travel with local community benefit.`
        )}
        className="impact-strip"
      >
        <div className="impact-panel">
          <p>
            {tx(
              "Karibu Assalam combines guided Zanzibar experiences with volunteer opportunities and balanced daily activities. The goal is not only to visit, but to contribute responsibly while learning through community connection."
            )}
          </p>
          <CTAButton to="/about" variant="secondary">
            {tx("Learn more about our approach")}
          </CTAButton>
        </div>
      </Section>

      <Section
        title={tx("A platform for volunteers and halal tourists.")}
        subtitle={tx(
          "Our travel approach is built around immersive sensory experiences, community connection, and balanced daily activity."
        )}
      >
        <div className="grid cards-4">
          {sensoryCards.map((card) => (
            <Card key={card.title} className="feature-card">
              <h3>{tx(card.title)}</h3>
              <p>{tx(card.text)}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        title={tx("Our Partners")}
        subtitle={tx("Trusted organizations and institutions featured as partners of Karibu Assalam.")}
        className="partners-section"
      >
        <PartnerGrid />
      </Section>
    </main>
  );
}
