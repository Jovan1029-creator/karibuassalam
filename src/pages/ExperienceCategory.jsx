import { useParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import CTAButton from "../components/CTAButton";
import Hero from "../components/Hero";
import PhotoSlot from "../components/PhotoSlot";
import PhotoCardMedia from "../components/PhotoCardMedia";
import EventCard from "../components/EventCard";
import Section from "../components/Section";
import SEO from "../components/SEO";
import { safari, specialEvents, volunteering } from "../data/experiences";
import { safariHeroPhoto, safariPlanningPhoto, safariGalleryPhotos } from "../data/safariPhotos";
import heroImg from "../../AssalamHero/assalam-hero.webp";
import campusVisitImg from "../../pics/site-marketing/permaculture-campus-tour.webp";

const categoryCopy = {
  events: {
    photo: specialEvents.find((item) => item.slug === "sawa-ensemble").photo,
    title: "Special events",
    subtitle: "Discover Sawa Ensemble, Zanzibar Sufi Festival, our Stone Town cafe and the latest community updates.",
    explore: {
      heading: "More to discover",
      intro: "Make a day of your visit to Karibu Assalam. Alongside music and community events, explore our beachfront campus, discover the permaculture gardens and take part in a hands-on workshop.",
    },
  },
  volunteer: {
    photo: volunteering[0].photo,
    title: "Volunteer on Zanzibar",
    subtitle: "Join the Assalam Foundation's work in education, permaculture, workshops and community events.",
    explore: {
      heading: "More to discover",
      intro: "Get to know the people and places around your volunteering experience. Visit our Kizimkazi campus, learn a new skill in a workshop and discover more of Zanzibar's culture through our guided excursions.",
    },
  },
  safari: {
    photo: safariHeroPhoto,
    title: "Safari from Zanzibar",
    subtitle: "Plan a mainland Tanzania safari with the Karibu Assalam team as part of your Zanzibar journey.",
    explore: {
      heading: "Back on Zanzibar",
      intro: "Make time for more of Zanzibar before or after your safari. Visit our Kizimkazi campus, meet the community and explore the island through hands-on workshops and guided excursions.",
    },
  },
};

export default function ExperienceCategory() {
  const { tx } = useLanguage();
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
      <SEO title={`${tx(copy.title)} | Karibu Assalam`} description={copy.subtitle} image={copy.photo?.src || heroImg} />
      <Hero
        eyebrow="Experiences"
        title={copy.title}
        subtitle={copy.subtitle}
        imageSrc={copy.photo?.src || heroImg}
        imageAlt={copy.photo?.alt || "Karibu Assalam Eco-Village beside the Indian Ocean"}
        imagePosition={copy.photo?.position}
        compact
        ctaPrimary={{ to: "/contact", label: "Ask the team" }}
      />

      {category === "events" && (
        <Section title="Come together at Karibu Assalam" subtitle="Programmes and event dates are confirmed as they are announced.">
          <div className="event-grid">
            {specialEvents.map((item) => (
              <EventCard item={item} key={item.slug} />
            ))}
          </div>
        </Section>
      )}

      {category === "volunteer" && (
        <Section title="Find the right way to help" subtitle="The team will discuss your skills, dates and the projects that need support.">
          <div className="volunteer-grid">
            {volunteering.map((item) => (
              <article className="volunteer-card" key={item.slug}>
                <PhotoCardMedia photo={item.photo} />
                <span className="volunteer-duration">{tx(item.duration)}</span>
                <h3>{tx(item.title)}</h3>
                <p>{tx(item.text)}</p>
                <CTAButton to="/contact" variant="secondary" size="sm">Apply to volunteer</CTAButton>
              </article>
            ))}
          </div>
        </Section>
      )}

      {category === "safari" && (
        <>
          <Section className="safari-planning" title="A safari planned around you" subtitle={safari.promise}>
            <div className="feature-split">
              <div className="feature-split-media">
                <PhotoSlot {...safariPlanningPhoto} />
              </div>
              <div>
                <p>{tx(safari.text)}</p>
                <p>{tx("Ask the team about a trip to Mikumi national park as well as other routes and hikes in Tanzania.")}</p>
                <p>{tx("Each trip is arranged around your preferences and the season. There are no fixed packages or published prices.")}</p>
                <CTAButton to="/contact">Find your safari</CTAButton>
              </div>
            </div>
          </Section>
          <Section id="safari-gallery" title="Moments on safari" subtitle="A closer look at the wildlife and the journey." className="safari-gallery-section">
            <div className="safari-gallery">
              {safariGalleryPhotos.map((photo) => (
                <figure className="safari-gallery-item" key={photo.src}>
                  <PhotoSlot {...photo} />
                  <figcaption>{tx(photo.label)}</figcaption>
                </figure>
              ))}
            </div>
          </Section>
        </>
      )}

      <Section id="explore-more" className="surface-section experience-explore-more">
        <div className="feature-split">
          <div className="feature-split-media">
            <PhotoSlot src={campusVisitImg} alt="Visitors exploring the permaculture area at Assalam" width={1600} height={1066} />
          </div>
          <div className="experience-explore-copy">
            <p className="eyebrow">{tx(copy.explore.heading)}</p>
            <h2>{tx("Explore more at Karibu Assalam")}</h2>
            <p>{tx(copy.explore.intro)}</p>
            <p>{tx("Join the Karibu Assalam Tour, try soap-making or drumming, or discover Stone Town and the spice gardens. Our team can help you choose experiences around your stay.")}</p>
            <div className="inline-actions">
              <CTAButton to="/experiences">View all experiences</CTAButton>
              <CTAButton to="/contact" variant="secondary">Plan your visit</CTAButton>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
