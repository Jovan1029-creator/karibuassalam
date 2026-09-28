import { Link, useParams } from "react-router-dom";
import CTAButton from "../components/CTAButton";
import Hero from "../components/Hero";
import PhotoSlot from "../components/PhotoSlot";
import Section from "../components/Section";
import SEO from "../components/SEO";
import { getExperienceDetail } from "../data/experienceDetails";
import campusImg from "../../pics/site-marketing/campus-coast-aerial.webp";

export default function ExperienceDetail() {
  const { type, slug } = useParams();
  const experience = getExperienceDetail(type, slug);

  if (!experience) {
    return (
      <main id="main-content">
        <Section title="Experience not found" subtitle="This experience page is unavailable.">
          <CTAButton to="/experiences">View all experiences</CTAButton>
        </Section>
      </main>
    );
  }

  const category = type === "workshops" ? "Workshops" : "Zanzibar excursions";
  const related = (type === "workshops" ? "/experiences#workshops" : "/experiences#zanzibar-excursions");

  return (
    <main id="main-content" className="experience-detail-page">
      <SEO
        title={`${experience.title} | Karibu Assalam`}
        description={experience.intro}
        image={experience.image || campusImg}
      />
      <Hero
        eyebrow={category}
        title={experience.title}
        subtitle={experience.intro}
        imageSrc={experience.image || campusImg}
        imageAlt={experience.image ? `${experience.title} in Zanzibar` : "Karibu Assalam Eco-Village campus"}
        compact
        ctaPrimary={{ to: "/contact", label: "Ask about this experience" }}
      />

      <Section title="Plan your experience" className="experience-detail-facts">
        <div className="facts-strip">
          <div className="fact-item"><span>Duration</span><strong>{experience.duration}</strong></div>
          <div className="fact-item"><span>When</span><strong>{experience.days}</strong></div>
          <div className="fact-item"><span>Start</span><strong>{experience.start}</strong></div>
          <div className="fact-item"><span>Price</span><strong>{experience.price || "Ask the team"}</strong></div>
        </div>
      </Section>

      <Section title="What is included" className="surface-section">
        <div className="retreat-feature-split">
          <PhotoSlot
            src={experience.detailPhoto?.src || experience.image}
            alt={experience.detailPhoto?.alt || (experience.image ? experience.title : `Photo of ${experience.title} coming soon`)}
            label="PLACEHOLDER"
            ratio="4 / 3"
            width={900}
            height={675}
          />
          <div>
            <ul className="check-list">
              {experience.included.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <p>Group and private options are available. Ask the team to confirm dates and the final price before booking.</p>
          </div>
        </div>
      </Section>

      <Section title="Make it your own">
        <ul className="check-list cols-2">
          {experience.options.map((item) => <li key={item}>{item}</li>)}
        </ul>
        {experience.bring && <p><strong>What to bring:</strong> {experience.bring}</p>}
        <p><strong>Languages:</strong> {experience.languages}</p>
        <div className="section-actions">
          <CTAButton to="/contact" size="lg">Book this experience</CTAButton>
          <Link className="text-link" to={related}>Explore more {category.toLowerCase()}</Link>
        </div>
      </Section>
    </main>
  );
}
