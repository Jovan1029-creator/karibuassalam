import { Link, useParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import Hero from "../components/Hero";
import Section from "../components/Section";
import Accordion from "../components/Accordion";
import RetreatCard from "../components/RetreatCard";
import CTAButton from "../components/CTAButton";
import SEO from "../components/SEO";
import { getRetreatBySlug, retreats } from "../data/retreats";
import roomImg from "../../pics/site-marketing/eco-village-room-interior.webp";
import foodImg from "../../pics/site-marketing/fresh-shared-meal.webp";

function StandardRetreatPage({ retreat }) {
  const { tx } = useLanguage();
  return (
    <>
      <Section>
        <div className="facts-strip">
          <div className="fact-item"><span>{tx("Price")}</span><strong>{tx("From")} EUR {retreat.priceFrom}</strong></div>
          <div className="fact-item"><span>{tx("Duration")}</span><strong>{tx("{count} days", { count: retreat.durationDays || retreat.itineraryDays.length })}</strong></div>
          <div className="fact-item"><span>{tx("Base")}</span><strong>{tx("Karibu Assalam Eco-Village")}</strong></div>
        </div>
      </Section>
      <Section title="Package details" className="surface-section">
        <ul className="check-list cols-2">
          {retreat.inclusions.map((item) => <li key={item}>{tx(item)}</li>)}
        </ul>
      </Section>
      <Section title="Highlights">
        <ul className="check-list cols-2">
          {retreat.highlights.map((item) => <li key={item}>{tx(item)}</li>)}
        </ul>
      </Section>
      <Section title="7-Day Itinerary">
        <Accordion items={retreat.itineraryDays} defaultOpenIds={[retreat.itineraryDays[0].id]} />
      </Section>
    </>
  );
}

export default function RetreatDetail() {
  const { tx } = useLanguage();
  const { slug } = useParams();
  const retreat = getRetreatBySlug(slug);

  if (!retreat) {
    return (
      <main id="main-content">
        <Section eyebrow="Retreats" title="Retreat not found" subtitle="The requested retreat page is unavailable.">
          <CTAButton to="/retreats">Back to Retreats</CTAButton>
        </Section>
      </main>
    );
  }

  const copy = retreat.details;
  const displayName = copy?.heading || retreat.title;
  const related = retreats.filter((item) => item.slug !== retreat.slug).slice(0, 3);

  return (
    <main id="main-content" className="retreat-detail-2026">
      <SEO
        title={`${tx(displayName)} | ${tx("Karibu Assalam Retreats")}`}
        description={copy?.intro || retreat.shortPromise}
        image={retreat.heroImage}
      />

      <Hero
        eyebrow="Retreats & Camps"
        title={displayName}
        subtitle={copy?.intro || retreat.shortPromise}
        imageSrc={retreat.heroImage}
        imageAlt={tx("{name} at Karibu Assalam in Zanzibar", { name: tx(displayName) })}
        ctaPrimary={{ to: "/contact", label: copy?.bookingCta || "Book your spot" }}
      />

      {copy ? (
        <>
          <Section className="retreat-facts-section">
            <div className="facts-strip retreat-facts-strip">
              <div className="fact-item"><span>{tx("Location")}</span><strong>{tx(copy.locationText)}</strong></div>
              <div className="fact-item"><span>{tx("Duration")}</span><strong>{tx(copy.durationText)}</strong></div>
              <div className="fact-item"><span>{tx("Price")}</span><strong>{copy.priceText}</strong></div>
            </div>
          </Section>

          <Section
            eyebrow="Package Details / Highlights"
            title={copy.inclusionHeading}
            className="surface-section"
          >
            <ul className="check-list cols-2 retreat-inclusions">
              {copy.includedItems.map((item) => <li key={item}>{tx(item)}</li>)}
            </ul>
            <p className="not-included-note">{tx(copy.notIncluded)}</p>
          </Section>

          <Section
            eyebrow="7-Day Itinerary"
            title="What your days will look like"
            subtitle={copy.itineraryIntro}
          >
            <Accordion
              items={copy.schedule.map((item) => ({
                id: item.id,
                title: item.heading,
                description: item.copy,
              }))}
              defaultOpenIds={[copy.schedule[0].id]}
            />
          </Section>

          <Section className="surface-section retreat-stay-section">
            <div className="retreat-feature-split">
              <img src={roomImg} alt={tx("Comfortable room at Karibu Assalam Eco-Village")} width="900" height="675" loading="lazy" />
              <div>
                <p className="eyebrow">{tx("Accommodation")}</p>
                <h2>{tx(copy.stayHeading)}</h2>
                <p>{tx(copy.stayCopy)}</p>
                <ul className="check-list">
                  {copy.stayFeatures.map((item) => <li key={item}>{tx(item)}</li>)}
                </ul>
              </div>
            </div>
          </Section>

          <Section className="retreat-food-section">
            <div className="retreat-feature-split is-reversed">
              <img src={foodImg} alt={tx("Shared halal meal at Karibu Assalam")} width="900" height="675" loading="lazy" />
              <div>
                <p className="eyebrow">{tx("Food")}</p>
                <h2>{tx(copy.foodHeading)}</h2>
                <p className="retreat-food-tags">{tx(copy.foodTags)}</p>
                {copy.foodCopy.map((paragraph) => <p key={paragraph}>{tx(paragraph)}</p>)}
              </div>
            </div>
          </Section>

          <Section eyebrow="Booking" title={copy.bookingCta} className="retreat-booking-section">
            <div className="booking-panel retreat-booking-panel">
              <div className="booking-panel-main">
                <p>{tx(copy.bookingCopy)}</p>
                <CTAButton to="/contact" size="lg">{copy.bookingCta}</CTAButton>
              </div>
              <div className="booking-panel-side">
                <h3>{tx("Need help choosing?")}</h3>
                <p>{tx("Tell the Karibu Assalam team who is travelling and the dates you are considering.")}</p>
                <Link className="text-link" to="/contact">{tx("Contact the team")}</Link>
              </div>
            </div>
          </Section>
        </>
      ) : (
        <StandardRetreatPage retreat={retreat} />
      )}

      <Section title="More retreats & camps">
        <div className="grid cards-3">
          {related.map((item) => <RetreatCard key={item.slug} retreat={item} />)}
        </div>
        <div className="section-actions">
          <Link className="text-link" to="/retreats">{tx("View all retreats & camps")}</Link>
        </div>
      </Section>
    </main>
  );
}
