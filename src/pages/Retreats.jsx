import Hero from "../components/Hero";
import Section from "../components/Section";
import Showcase from "../components/Showcase";
import Wave from "../components/Wave";
import CTAButton from "../components/CTAButton";
import SEO from "../components/SEO";
import { retreats } from "../data/retreats";
import { useLanguage } from "../context/LanguageContext";
import heroImg from "../../pics/our retreats/Nature Retreat.webp";

function formatPrice(value, language) {
  return new Intl.NumberFormat(language, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function Retreats() {
  const { tx, language } = useLanguage();

  return (
    <main id="main-content">
      <SEO
        title={tx("Retreats & Camps at Assalam Ecolodge | Karibu Assalam")}
        description={tx(
          "Explore Karibu Assalam retreats and camps at Assalam Ecolodge with guided tours, meals, accommodations, airport transport, and seminars/activities."
        )}
        image={heroImg}
      />

      <Hero
        eyebrow={tx("Retreats")}
        title={tx("Retreats & Camps at Assalam Ecolodge")}
        subtitle={tx(
          "Every camp runs from Assalam Ecolodge, the only eco-village in Zanzibar. Meals, accommodation, guided tours and airport transfers are included."
        )}
        imageSrc={heroImg}
        imageAlt={tx("Nature retreat scenery at Assalam Ecolodge")}
        compact
        ctaPrimary={{ to: "/booking", label: tx("Check dates and availability") }}
      />

      <div className="wave-band">
        <Wave position="top" color="var(--bg)" />

        <div className="set-intro">
          <p className="eyebrow">{tx("Our retreats and camps")}</p>
          <h2>{tx("Six ways to spend a week in Zanzibar")}</h2>
          <p className="lead">
            {tx(
              "Each camp keeps the same rhythm — guided days, shared meals, time with the community — and changes what sits at its centre."
            )}
          </p>
        </div>

        {/* Each retreat gets a full row rather than a card, alternating sides. */}
        <div className="showcase-set">
          {retreats.map((retreat, index) => (
            <Showcase
              key={retreat.slug}
              reversed={index % 2 === 1}
              priority={index === 0}
              name={tx(retreat.title)}
              promise={tx(retreat.shortPromise)}
              facts={retreat.highlights.slice(0, 3).map((item) => tx(item))}
              price={
                <>
                  {tx("From")} <strong>{formatPrice(retreat.priceFrom, language)}</strong>{" "}
                  {"\u00B7"} {retreat.durationDays ?? retreat.itineraryDays.length} {tx("days")}
                </>
              }
              image={retreat.heroImage}
              alt={`${tx(retreat.title)} ${tx("retreat preview")}`}
              imageWidth={768}
              imageHeight={614}
              cta={{ to: `/retreats/${retreat.slug}`, label: tx("View details") }}
            />
          ))}
        </div>

        <Wave position="bottom" color="var(--bg)" />
      </div>

      <Section
        title={tx("Package details are confirmed with the team")}
        subtitle={tx(
          "Each retreat, camp, and stay can have different inclusions and exclusions. Contact the Karibu Assalam team for the current open retreat details before booking."
        )}
      >
        <div className="content-card note-card">
          <h3>{tx("Accommodations-only booking is also available")}</h3>
          <p>{tx("Guests can book accommodations at Assalam Ecolodge without attending a camp.")}</p>
          <CTAButton to="/booking" variant="secondary">
            {tx("Contact for accommodation booking")}
          </CTAButton>
        </div>
      </Section>
    </main>
  );
}
