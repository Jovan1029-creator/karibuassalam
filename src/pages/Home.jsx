import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import HeroSlider from "../components/HeroSlider";
import Section from "../components/Section";
import CampusMoments from "../components/CampusMoments";
import PhotoSlot from "../components/PhotoSlot";
import SEO from "../components/SEO";
import { SITE } from "../data/siteConfig";
import heroImage from "../../AssalamHero/hero-poster.webp";
import ecoVillageImg from "../../pics/rooms/camps-22-enhanced.webp";
import retreatsImg from "../../pics/our retreats/Kindness Camp-enhanced.webp";
import experiencesImg from "../../pics/site-marketing/permaculture-campus-tour.webp";
import volunteerImg from "../../pics/site-marketing/community-craft-workshop.webp";
import spaImg from "../../pics/site-marketing/spa-ocean-pool.webp";
import aboutImg from "../../pics/aboutpic/Why Us-enhanced.webp";

const stayOptions = [
  {
    heading: "Eco-Village",
    image: ecoVillageImg,
    alt: "Karibu Assalam Eco-Village accommodation in Kizimkazi",
    copy: "Stay in our eco village right on Kizimkazi beach in accommodation with views of the Indian Ocean. Slow down by the sea, enjoy Swahili flavours and discover life on our community-led campus. Explore the permaculture gardens, join a hands-on workshop or make time to connect with the people and culture of Zanzibar.",
    ctaText: "Find your stay",
    to: "/eco-resort",
  },
  {
    heading: "Retreats & Camps",
    image: retreatsImg,
    alt: "Guests taking part in a Karibu Assalam retreat",
    copy: "Learn more about our camps and retreats - engage in meaningful community experiences and volunteering in our Kindness Camp, immerse yourself in Zanzibar culture and community, join us for special Ramadan experiences, relax with a halal wellness retreat or explore school and family camps.",
    ctaText: "Find your retreat",
    to: "/retreats",
  },
  {
    heading: "Karibu Assalam Tour",
    image: experiencesImg,
    alt: "Visitors exploring the permaculture area at Assalam",
    copy: "Visit our campus and join our Karibu Assalam Tour with a campus tour, including a visit of our permaculture farm and our school, and learn more about Zanzibar’s culture in workshops making your own hammam soap or ngoma (drum).",
    ctaText: "Find your tour",
    to: "/experiences/tours/campus-village-tour",
  },
  {
    heading: "Halal spa & pool",
    image: spaImg,
    alt: "Private pool and sun loungers at Karibu Assalam",
    copy: "Watch the waves while enjoying the private pool or relaxing with a private massage in Zanzibar’s only halal spa and wellness area suitable for small groups or families wishing to experience peace and tranquility in a secluded and muslim-friendly way. Perfect for a girls day out, too.",
    ctaText: "Book your spa",
    to: "/eco-resort#spa",
  },
  {
    heading: "Volunteer in Zanzibar",
    image: volunteerImg,
    alt: "Visitors and community members making crafts together",
    copy: "Join an existing volunteer programme for a few weeks - support our teachers in the school, engage in practical experience in our permaculture garden, support our operations, fundraise for Qurban and Ramadan donations or apply for long-term volunteering opportunities.",
    ctaText: "Apply here",
    to: "/contact",
  },
  {
    heading: "About us",
    image: aboutImg,
    alt: "Assalam Community Foundation community programme in Zanzibar",
    copy: "Karibu Assalam is the hospitality and experience initiative of Assalam Community Foundation, a Zanzibar-based organization working across permaculture, education, community development, arts and empowerment since 2017. Find out more about the work and long-term volunteering or further support opportunities:",
    ctaText: "Learn more",
    href: SITE.foundationUrl,
  },
];

function StayOption({ option, index }) {
  const { tx } = useLanguage();
  return (
    <article className="stay-option">
      <div className="stay-option-media">
        <PhotoSlot
          src={option.image}
          alt={option.alt}
          label="PLACEHOLDER"
          ratio="4 / 3"
          width={900}
          height={675}
        />
        <span className="stay-option-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="stay-option-body">
        <h3>{tx(option.heading)}</h3>
        <p>{tx(option.copy)}</p>
        {option.href ? (
          <a className="btn btn-primary stay-option-action" href={option.href} target="_blank" rel="noopener noreferrer">
            {tx(option.ctaText)}
          </a>
        ) : (
          <Link className="btn btn-primary stay-option-action" to={option.to}>
            {tx(option.ctaText)}
          </Link>
        )}
      </div>
    </article>
  );
}

export default function Home() {
  const { tx } = useLanguage();
  return (
    <main id="main-content" className="home-page">
      <SEO
        title="Karibu Assalam Eco Resort | Kizimkazi, Zanzibar"
        description="Discover a halal eco village on Zanzibar beach combining sustainable living, local culture, meaningful community experiences and peaceful retreats."
        image={heroImage}
      />

      <HeroSlider />

      <Section
        id="plan-your-stay"
        eyebrow="Hospitality + community + sustainability + culture + purpose"
        title="Plan your stay at Karibu Assalam Eco Resort"
        subtitle="Find out more about our halal-friendly eco-village, retreats and camps, campus tours, workshops, Zanzibar tours and the island’s only muslim friendly wellness and spa (ladies only)."
        className="stay-planner-section"
      >
        <div className="stay-options-grid">
          {stayOptions.map((option, index) => (
            <StayOption option={option} index={index} key={option.heading} />
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Life at Assalam"
        title="A glimpse of camp life"
        subtitle="What to expect at Karibu Assalam"
        className="life-intro-section"
      >
        <div className="fit-check-grid">
          <article className="fit-check is-for-you">
            <span>{tx("For you")}</span>
            <p>
              {tx("Karibu Assalam Eco Resort is for you if you want a stay within a living community and an authentic Zanzibar experience, with nature and sustainability in mind. We offer meaningful halal experiences and accommodation while you travel slow, engage with locals and learn while you create your own memories.")}
            </p>
          </article>
          <article className="fit-check is-not-for-you">
            <span>{tx("Good to know")}</span>
            <p>
              {tx("Karibu Assalam Eco Resort may not be for you if you want a conventional luxury resort, large buffet restaurants, nightlife or completely private/resort-style experiences.")}
            </p>
          </article>
        </div>
      </Section>

      <CampusMoments />
    </main>
  );
}
