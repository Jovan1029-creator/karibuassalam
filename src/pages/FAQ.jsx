import Hero from "../components/Hero";
import Section from "../components/Section";
import Accordion from "../components/Accordion";
import SEO from "../components/SEO";
import { faqSections } from "../data/faq";
import { useLanguage } from "../context/LanguageContext";
import faqImg from "../../pics/aboutpic/Why Us.webp";

export default function FAQ() {
  const { tx } = useLanguage();

  return (
    <main id="main-content">
      <SEO
        title={tx("FAQ | Karibu Assalam")}
        description={tx(
          "Frequently asked questions about packing, travel timing, languages, cancellation, rescheduling, force majeure, and campus visits for Karibu Assalam."
        )}
        image={faqImg}
      />
      <Hero
        eyebrow={tx("FAQ")}
        title={tx("Frequently asked questions")}
        subtitle={tx("Helpful guidance for planning your retreat, camp, or campus visit.")}
        imageSrc={faqImg}
        imageAlt="Group activity associated with Karibu Assalam programs"
        compact
      />

      {faqSections.map((section) => (
        <Section
          key={section.id}
          title={tx(section.title)}
          className={section.id === "policies" ? "surface-section" : ""}
        >
          <Accordion
            items={section.items.map((item, index) => ({
              ...item,
              id: `${section.id}-${index + 1}`,
              title: tx(item.question),
              answer: tx(item.answer),
            }))}
            defaultOpenIds={section.items[0] ? [`${section.id}-1`] : []}
          />
        </Section>
      ))}
    </main>
  );
}
