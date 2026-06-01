// src\pages\Home.jsx
import Hero from "../components/Hero";
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
import heroImg from "../../pics/rooms/Image-2-edited-768x576.webp";
import roomImg from "../../pics/rooms/camps-22-768x576.webp";
import safariImg from "../../pics/zanzibarpics/Blue Safari.jpg";
import storyImg1 from "../../pics/our stories/camps-1-768x1023.jpeg";
import storyImg2 from "../../pics/our stories/education-1.png";
import storyImg3 from "../../pics/our stories/Kidness-camp-2.png";

const heroSlides = [
  {
    src: heroImg,
    alt: "Beachfront swing and gathering area at Assalam Ecolodge in Zanzibar",
    label: "Assalam Ecolodge",
  },
  {
    src: roomImg,
    alt: "Prepared guest room at Assalam Ecolodge",
    label: "Eco-village stays",
  },
  {
    src: safariImg,
    alt: "Zanzibar coast and ocean excursion setting",
    label: "Explore Zanzibar",
  },
];

const sensoryCards = [
  {
    title: "Sight",
    text: "Sunsets, culture, markets, beaches, and Zanzibar’s underwater beauty shape the visual rhythm of each trip.",
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
      "Children’s universities",
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

const storyCards = [
  {
    title: "Moments of Learning",
    image: storyImg2,
    alt: "Learners gathered during an educational activity",
    text: "Shared learning and workshops create space for practical skills, reflection, and cultural exchange.",
  },
  {
    title: "Kindness in Action",
    image: storyImg3,
    alt: "Kindness camp participants during community activities",
    text: "Community-centered travel becomes more meaningful when service projects and guided activities stay balanced.",
  },
  {
    title: "Camp Life by the Coast",
    image: storyImg1,
    alt: "Participants standing together during a camp session",
    text: "Each retreat blends campus life, shared meals, and experiences across Zanzibar’s villages and coastlines.",
  },
];

export default function Home() {
  const { t, tx } = useLanguage();

  return (
    <main id="main-content">
      <SEO
        title={tx("Karibu Assalam | Immersive Halal Travel & Volunteer Retreats in Zanzibar")}
        description={tx(
          "Karibu Assalam offers immersive sensory travel, volunteering, and halal-friendly retreat experiences in Zanzibar from the Assalam Ecolodge base."
        )}
        image={heroImg}
      />

      <Hero
        eyebrow="Karibu Assalam"
        title={tx("Immersive Zanzibar travel for volunteers and halal tourists")}
        subtitle={tx(
          "Explore Zanzibar through sight, touch, hear, and smell while balancing guided experiences, community volunteering, and meaningful time at our eco-village base."
        )}
        slides={heroSlides}
        ctaPrimary={{ to: "/booking", label: t.nav.bookNow }}
        ctaSecondary={{ to: "/retreats", variant: "secondary", label: t.common.exploreRetreats }}
      />

      <LiveNowStrip />

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
        title={tx("Our Partners")}
        subtitle={tx("Trusted organizations and institutions featured as partners of Karibu Assalam.")}
        className="partners-section"
      >
        <PartnerGrid />
      </Section>

      <CampusMoments />

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
        eyebrow={tx("Our Next Halal Adventure")}
        title={tx("Retreats and camps from Assalam Ecolodge")}
        subtitle={tx(
          "Choose from community-focused camps, family travel, heritage experiences, and nature-based programs."
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

      <Section
        eyebrow={tx("Our Stories")}
        title={tx("Snapshots of travel, learning, and community")}
        subtitle={tx(
          "A curated glimpse into camp life and impact-focused travel moments. This section is informational and does not link to separate story pages yet."
        )}
        className="surface-section"
      >
        <div className="grid cards-3">
          {storyCards.map((story) => (
            <Card key={story.title} className="story-card">
              <div className="media-frame tall">
                <img src={story.image} alt={story.alt} loading="lazy" decoding="async" />
              </div>
              <div className="card-body">
                <h3>{tx(story.title)}</h3>
                <p>{tx(story.text)}</p>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </main>
  );
}
