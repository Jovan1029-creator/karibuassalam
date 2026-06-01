import Hero from "../components/Hero";
import Section from "../components/Section";
import SEO from "../components/SEO";
import spiceImg from "../../pics/aboutpic/Spice Gardens.webp";
import beachesImg from "../../pics/aboutpic/Zanzibar’s Beaches.webp";
import stoneTownImg from "../../pics/aboutpic/Stone Town.webp";
import impactImg from "../../pics/aboutpic/Making a Difference in Zanzibar.jpeg";
import whyUsImg from "../../pics/aboutpic/Why Us.webp";
import purposeImg from "../../pics/aboutpic/Traveling with Purpose.jpg";
import { useLanguage } from "../context/LanguageContext";

function SplitSection({ title, text, image, alt, reverse = false, callout }) {
  return (
    <div className={`split ${reverse ? "reverse" : ""}`}>
      <div className="split-content">
        <h3>{title}</h3>
        <p>{text}</p>
        {callout && <div className="callout">{callout}</div>}
      </div>
      <div className="split-media">
        <img src={image} alt={alt} loading="lazy" decoding="async" />
      </div>
    </div>
  );
}

export default function About() {
  const { tx } = useLanguage();

  return (
    <main id="main-content">
      <SEO
        title={tx("About Karibu Assalam | Spice Island Travel With Purpose")}
        description={tx(
          "Learn how Karibu Assalam connects Zanzibar travel, community impact, and sustainable tourism through camps and retreats since 2017."
        )}
        image={spiceImg}
      />

      <Hero
        eyebrow={tx("About Karibu Assalam")}
        title={tx("Spice Island travel with purpose")}
        subtitle={tx(
          "Karibu Assalam explores Zanzibar's landscapes, culture, and community through a travel model that connects guided experiences with meaningful impact."
        )}
        imageSrc={spiceImg}
        imageAlt="Spice garden in Zanzibar"
        compact
      />

      <Section title={tx("Zanzibar as the Spice Island")}>
        <SplitSection
          title={tx("Spice Gardens")}
          text={tx(
            "Zanzibar is known as the Spice Island, and spice gardens are part of the island's identity and travel experience."
          )}
          image={spiceImg}
          alt="Spice garden pathway in Zanzibar"
        />
        <SplitSection
          title={tx("Beaches and Underwater Life")}
          text={tx(
            "Zanzibar's beaches and underwater life are central to the island experience, adding ocean exploration and coastal beauty to each journey."
          )}
          image={beachesImg}
          alt="Zanzibar beach and ocean scenery"
          reverse
          callout={tx(
            "The Rock Restaurant is known for a tide-dependent access experience on Zanzibar's coast."
          )}
        />
        <SplitSection
          title={tx("Stone Town")}
          text={tx(
            "Stone Town is a UNESCO World Heritage Site and remains one of the most important cultural and historical anchors in the Zanzibar experience."
          )}
          image={stoneTownImg}
          alt="Stone Town streets and architecture in Zanzibar"
        />
      </Section>

      <Section title={tx("Making a Difference in Zanzibar")} className="surface-section">
        <SplitSection
          title={tx("Community impact through Assalam Community Foundation")}
          text={tx(
            "Assalam Community Foundation is the nonprofit entity mentioned in Karibu Assalam's impact work. Kindness Camp includes service-oriented projects that connect travel with community benefit."
          )}
          image={impactImg}
          alt="Community-focused program activities in Zanzibar"
        />
      </Section>

      <Section title={tx("Why Us?")}>
        <SplitSection
          title={tx("Camps since 2017")}
          text={tx(
            "Karibu Assalam has organized camps since 2017 with a focus on diversity, leadership, workshops, and building community through shared experiences."
          )}
          image={whyUsImg}
          alt="Karibu Assalam camp participants during a group session"
          reverse
        />
      </Section>

      <Section title={tx("Traveling with Purpose")} className="surface-section">
        <SplitSection
          title={tx("Sustainable tourism and community benefit")}
          text={tx(
            "Traveling with purpose means balancing guided Zanzibar experiences with sustainable tourism values and meaningful community benefit."
          )}
          image={purposeImg}
          alt="Travelers participating in a purpose-driven activity in Zanzibar"
        />
      </Section>
    </main>
  );
}
