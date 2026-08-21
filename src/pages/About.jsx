import Hero from "../components/Hero";
import Section from "../components/Section";
import SEO from "../components/SEO";
import spiceImg from "../../pics/aboutpic/Spice Gardens.webp";
import impactImg from "../../pics/aboutpic/Making a Difference in Zanzibar.jpeg";
import whyUsImg from "../../pics/aboutpic/Why Us.webp";
import purposeImg from "../../pics/aboutpic/Traveling with Purpose.jpg";
import { useLanguage } from "../context/LanguageContext";

const whyReasons = [
  "Camps since 2017",
  "Authentic local experience",
  "Small and meaningful group experiences",
  "Strong local community network",
  "Travel that creates real impact",
  "Nature and sustainability",
  "Cultural immersion",
  "Halal-friendly environment",
  "Safe and supportive atmosphere",
];

const impactItems = [
  "Education programs at Assalam International School",
  "Youth leadership and girls empowerment camps",
  "Empowerment projects for local men and women",
  "Orphan camps for children across Zanzibar",
  "Community development initiatives",
  "Environmental and permaculture projects",
  "Cultural exchange and global citizenship programs",
];

function SplitSection({ title, text, image, alt, reverse = false, callout }) {
  return (
    <div className={`split ${reverse ? "reverse" : ""}`}>
      <div className="split-content">
        <h3>{title}</h3>
        <p>{text}</p>
        {callout && <div className="callout">{callout}</div>}
      </div>
      <div className="split-media">
        <img src={image} alt={alt} loading="lazy" decoding="async" width="1024" height="768" />
      </div>
    </div>
  );
}

export default function About() {
  const { tx } = useLanguage();

  return (
    <main id="main-content">
      <SEO
        title={tx("About Karibu Assalam | Purpose-Driven Eco-Village in Zanzibar")}
        description={tx(
          "Karibu Assalam is a purpose-driven eco-village in Zanzibar created by Assalam Community Foundation, hosting travelers, volunteers, students, and youth groups."
        )}
        image={spiceImg}
      />

      <Hero
        eyebrow={tx("What is Karibu Assalam?")}
        title={tx("A purpose-driven eco-village in Zanzibar")}
        subtitle={tx(
          "We host travelers, volunteers, students, and youth groups who want to experience Zanzibar through community engagement, nature, and cultural exchange."
        )}
        imageSrc={spiceImg}
        imageAlt={tx("Spice garden in Zanzibar")}
        compact
      />

      <Section title={tx("What is Karibu Assalam?")}>
        <SplitSection
          title={tx("Created by Assalam Community Foundation")}
          text={tx(
            "Karibu Assalam is a purpose-driven eco-village in Zanzibar created by the NGO Assalam Community Foundation. By joining Karibu Assalam, you directly support local youth programs, education initiatives, and community development."
          )}
          image={purposeImg}
          alt={tx("Travelers participating in a purpose-driven activity in Zanzibar")}
          callout={tx(
            "The experience is built for meaningful travel: community engagement, nature, cultural exchange, and responsible hospitality."
          )}
        />
      </Section>

      <Section title={tx("Why Karibu Assalam")} className="surface-section">
        <div className="split">
          <div className="split-media">
            <img
              src={whyUsImg}
              alt={tx("Karibu Assalam camp participants")}
              loading="lazy"
              decoding="async"
              width="1024"
              height="768"
            />
          </div>
          <div className="content-card">
            <ul className="check-list cols-2">
              {whyReasons.map((reason) => (
                <li key={reason}>{tx(reason)}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section
        eyebrow={tx("Impact")}
        title={tx("The Impact You Create")}
        subtitle={tx(
          "Every stay, camp, and volunteer experience directly supports the work of Assalam Community Foundation and helps create opportunities for local youth and families in Zanzibar."
        )}
      >
        <div className="impact-feature">
          <div className="split-media">
            <img
              src={impactImg}
              alt={tx("Community-focused program activities in Zanzibar")}
              loading="lazy"
              decoding="async"
              width="1024"
              height="768"
            />
          </div>
          <div>
            <h3>{tx("Your participation helps support")}</h3>
            <ul className="check-list">
              {impactItems.map((item) => (
                <li key={item}>{tx(item)}</li>
              ))}
            </ul>
            <p>
              {tx(
                "Together, we are building a stronger, more connected community, where travel creates real impact."
              )}
            </p>
          </div>
        </div>
      </Section>

      <Section title={tx("Traveling with Purpose")} className="surface-section">
        <SplitSection
          title={tx("Hospitality connected to community benefit")}
          text={tx(
            "Karibu Assalam combines guided Zanzibar experiences with volunteer opportunities, balanced daily activities, and sustainable tourism values. The goal is not only to visit, but to contribute responsibly while learning through community connection."
          )}
          image={spiceImg}
          alt={tx("Spice garden pathway in Zanzibar")}
          reverse
        />
      </Section>
    </main>
  );
}
