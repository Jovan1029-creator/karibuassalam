import { useParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import CTAButton from "../components/CTAButton";
import Hero from "../components/Hero";
import PhotoSlot from "../components/PhotoSlot";
import Section from "../components/Section";
import SEO from "../components/SEO";
import { getExperienceDetail } from "../data/experienceDetails";
import campusImg from "../../pics/site-marketing/campus-coast-aerial.webp";

export default function ExperienceDetail() {
  const { tx } = useLanguage();
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
        title={`${tx(experience.title)} | Karibu Assalam`}
        description={experience.intro}
        image={experience.image || campusImg}
      />
      <Hero
        eyebrow={category}
        title={experience.title}
        subtitle={experience.intro}
        imageSrc={experience.image || campusImg}
        imageAlt={experience.image ? tx("{name} in Zanzibar", { name: tx(experience.title) }) : tx("Karibu Assalam Eco-Village campus")}
        compact
        ctaPrimary={{ to: "/contact", label: "Ask about this experience" }}
      />

      <Section title="Plan your experience" className="experience-detail-facts">
        <div className="facts-strip">
          <div className="fact-item"><span>{tx("Duration")}</span><strong>{tx(experience.duration)}</strong></div>
          <div className="fact-item"><span>{tx("When")}</span><strong>{tx(experience.days)}</strong></div>
          <div className="fact-item"><span>{tx("Start")}</span><strong>{tx(experience.start)}</strong></div>
          <div className="fact-item"><span>{tx("Price")}</span><strong>{tx(experience.price || "Ask the team")}</strong></div>
        </div>
        {experience.description && <p className="experience-detail-description">{tx(experience.description)}</p>}
      </Section>

      <Section title="What is included" className="surface-section">
        <div className="retreat-feature-split">
          <PhotoSlot
            src={experience.detailPhoto?.src || experience.image}
            alt={experience.detailPhoto?.alt || (experience.image ? experience.title : tx("Photo of {name} coming soon", { name: tx(experience.title) }))}
            label="PLACEHOLDER"
            ratio="4 / 3"
            width={900}
            height={675}
          />
          <div>
            <ul className="check-list">
              {experience.included.map((item) => <li key={item}>{tx(item)}</li>)}
            </ul>
            <p>{tx("Group and private options are available. Ask the team to confirm dates and the final price before booking.")}</p>
          </div>
        </div>
      </Section>

      <Section title="Make it your own" className="closing-section">
        <ul className="check-list experience-options">
          {experience.options.map((item) => <li key={item}>{tx(item)}</li>)}
        </ul>
        {experience.bring && <p><strong>{tx("What to bring:")}</strong> {tx(experience.bring)}</p>}
        <p><strong>{tx("Languages:")}</strong> {tx(experience.languages)}</p>
        <div className="section-actions">
          <CTAButton to="/contact" size="lg">Book this experience</CTAButton>
          <CTAButton to={related} variant="secondary" size="lg">
            {tx(type === "workshops" ? "Explore more workshops" : "Explore more Zanzibar excursions")}
          </CTAButton>
        </div>
      </Section>
    </main>
  );
}
