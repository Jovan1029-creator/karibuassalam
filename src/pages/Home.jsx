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
import Testimonials from "../components/Testimonials";
import SEO from "../components/SEO";
import { retreats } from "../data/retreats";
import { useLanguage } from "../context/LanguageContext";
import heroImage from "../../AssalamHero/assalam-hero.jpg";

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

const impactSupports = [
  "Education programs at Assalam International School",
  "Youth leadership and girls empowerment camps",
  "Empowerment projects for local men and women",
  "Orphan camps for children across Zanzibar",
  "Community development initiatives",
  "Environmental and permaculture projects",
  "Cultural exchange and global citizenship programs",
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
        image={heroImage}
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
        title={tx("Our Partners")}
        subtitle={tx("Trusted organizations and institutions featured as partners of Karibu Assalam.")}
        className="partners-section"
      >
        <PartnerGrid />
      </Section>

      <Section
        eyebrow={tx("Travel To Impact")}
        title={tx("The Impact You Create")}
        subtitle={tx(
          "At Karibu Assalam, your journey becomes part of something bigger. Every stay, camp, and volunteer experience directly supports Assalam Community Foundation and helps create opportunities for local youth and families in Zanzibar."
        )}
        className="impact-section surface-section"
      >
        <div className="impact-feature">
          <div>
            <h3>{tx("Your participation helps support")}</h3>
            <p>
              {tx(
                "Together, we are building a stronger, more connected community, where travel creates real impact."
              )}
            </p>
          </div>
          <ul className="check-list cols-2">
            {impactSupports.map((item) => (
              <li key={item}>{tx(item)}</li>
            ))}
          </ul>
        </div>
      </Section>

      <Testimonials />

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
    </main>
  );
}
