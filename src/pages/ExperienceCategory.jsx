import { Link, useParams } from "react-router-dom";
import CTAButton from "../components/CTAButton";
import Hero from "../components/Hero";
import PhotoSlot from "../components/PhotoSlot";
import Section from "../components/Section";
import SEO from "../components/SEO";
import { SITE } from "../data/siteConfig";
import { safari, specialEvents, volunteering } from "../data/experiences";
import heroImg from "../../AssalamHero/assalam-hero.webp";

const categoryCopy = {
  events: {
    title: "Special events",
    subtitle: "Sawa Ensemble, Zanzibar Sufi Festival and the camps and retreats that bring people together at Karibu Assalam.",
  },
  volunteer: {
    title: "Volunteer on Zanzibar",
    subtitle: "Join the Assalam Foundation's work in education, permaculture, workshops and community events.",
  },
  safari: {
    title: "Safari from Zanzibar",
    subtitle: "Plan a mainland Tanzania safari with the Karibu Assalam team as part of your Zanzibar journey.",
  },
};

export default function ExperienceCategory() {
  const { category } = useParams();
  const copy = categoryCopy[category];

  if (!copy) {
    return (
      <main id="main-content">
        <Section title="Experience not found" subtitle="This experience page is unavailable.">
          <CTAButton to="/experiences">View all experiences</CTAButton>
        </Section>
      </main>
    );
  }

  return (
    <main id="main-content" className="experience-category-page">
      <SEO title={`${copy.title} | Karibu Assalam`} description={copy.subtitle} image={heroImg} />
      <Hero
        eyebrow="Experiences"
        title={copy.title}
        subtitle={copy.subtitle}
        imageSrc={heroImg}
        imageAlt="Karibu Assalam Eco-Village beside the Indian Ocean"
        compact
        ctaPrimary={{ to: "/contact", label: "Ask the team" }}
      />

      {category === "events" && (
        <Section title="Come together at Karibu Assalam" subtitle="Programmes and event dates are confirmed as they are announced.">
          <div className="event-grid">
            {specialEvents.map((item) => (
              <article className="event-card" key={item.slug}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                {item.external ? (
                  <a className="text-link" href={SITE[item.external]} target="_blank" rel="noopener noreferrer">{item.linkLabel}</a>
                ) : (
                  <Link className="text-link" to={item.to}>{item.linkLabel}</Link>
                )}
              </article>
            ))}
          </div>
        </Section>
      )}

      {category === "volunteer" && (
        <Section title="Find the right way to help" subtitle="The team will discuss your skills, dates and the projects that need support.">
          <div className="volunteer-grid">
            {volunteering.map((item) => (
              <article className="volunteer-card" key={item.slug}>
                <span className="volunteer-duration">{item.duration}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <CTAButton to="/contact" variant="secondary" size="sm">Apply to volunteer</CTAButton>
              </article>
            ))}
          </div>
        </Section>
      )}

      {category === "safari" && (
        <Section title="A safari planned around you" subtitle={safari.promise}>
          <div className="feature-split">
            <div className="feature-split-media">
              <PhotoSlot label="PLACEHOLDER" alt="Safari photograph coming soon" ratio="16 / 10" />
            </div>
            <div>
              <p>{safari.text}</p>
              <p>Ask the team about Lake Manyara, Tarangire, Ngorongoro Crater or the Serengeti, as well as other routes and hikes in Tanzania.</p>
              <p>Each trip is arranged around your preferences and the season. There are no fixed packages or published prices.</p>
              <CTAButton to="/contact">Find your safari</CTAButton>
            </div>
          </div>
        </Section>
      )}

      <Section className="surface-section" title="Explore more at Karibu Assalam">
        <Link className="text-link" to="/experiences">View all experiences</Link>
      </Section>
    </main>
  );
}
