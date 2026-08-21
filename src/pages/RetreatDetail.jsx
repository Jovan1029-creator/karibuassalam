import { Link, useParams } from "react-router-dom";
import Hero from "../components/Hero";
import Section from "../components/Section";
import Accordion from "../components/Accordion";
import RetreatCard from "../components/RetreatCard";
import CTAButton from "../components/CTAButton";
import WhatsAppButton from "../components/WhatsAppButton";
import SEO from "../components/SEO";
import { getRetreatBySlug, retreats } from "../data/retreats";
import { buildMailtoUrl } from "../utils/contact";
import { useLanguage } from "../context/LanguageContext";

function formatPrice(value, language) {
  return new Intl.NumberFormat(language, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function itineraryHeading(retreat, tx) {
  return retreat.durationDays === 7 ? tx("7-Day Itinerary") : tx("Sample Day 1-Day 7 Itinerary");
}

export default function RetreatDetail() {
  const { slug } = useParams();
  const { tx, language } = useLanguage();
  const retreat = getRetreatBySlug(slug);

  if (!retreat) {
    return (
      <main id="main-content">
        <Section
          eyebrow={tx("Retreats")}
          title={tx("Retreat not found")}
          subtitle={tx("The requested retreat page is unavailable.")}
        >
          <div className="inline-actions">
            <CTAButton to="/retreats">{tx("Back to Retreats")}</CTAButton>
            <CTAButton to="/booking" variant="secondary">
              {tx("Contact Booking Team")}
            </CTAButton>
          </div>
        </Section>
      </main>
    );
  }

  const related = retreats.filter((item) => item.slug !== retreat.slug).slice(0, 3);
  const bookingPayload = {
    intent: "booking",
    retreatTitle: tx(retreat.title),
    message: `${tx("I would like booking details for")} ${tx(retreat.title)}.`,
    language,
  };

  return (
    <main id="main-content">
      <SEO
        title={`${tx(retreat.title)} | ${tx("Karibu Assalam Retreats")}`}
        description={`${tx(retreat.title)} ${tx(
          "at Assalam Ecolodge includes accommodations, meals, activities, airport transportation, and guided tours with Karibu Assalam."
        )}`}
        image={retreat.heroImage}
      />

      <Hero
        eyebrow={tx("Retreat Detail")}
        title={tx(retreat.title)}
        subtitle={tx(retreat.shortPromise)}
        imageSrc={retreat.heroImage}
        imageAlt={`${tx(retreat.title)} hero image`}
      />

      <Section>
        <div className="facts-strip">
          <div className="fact-item">
            <span>{tx("Price")}</span>
            <strong>
              {tx("From")} {formatPrice(retreat.priceFrom, language)}
            </strong>
          </div>
          <div className="fact-item">
            <span>{tx("Duration")}</span>
            <strong>
              {`${retreat.durationDays ?? retreat.itineraryDays.length} ${tx("days")}`}
            </strong>
          </div>
          <div className="fact-item">
            <span>{tx("Base")}</span>
            <strong>Assalam Ecolodge</strong>
          </div>
        </div>
      </Section>

      <Section
        title={tx("Package details")}
        subtitle={tx(
          "Inclusions and exclusions can vary by package and date. Please confirm current details with the Karibu Assalam team before booking."
        )}
        className="surface-section"
      >
        <ul className="check-list cols-2">
          {retreat.inclusions.map((item) => (
            <li key={item}>{tx(item)}</li>
          ))}
        </ul>
      </Section>

      <Section title={tx("Highlights")}>
        <ul className="check-list cols-2">
          {retreat.highlights.map((item) => (
            <li key={item}>{tx(item)}</li>
          ))}
        </ul>
      </Section>

      <Section
        title={itineraryHeading(retreat, tx)}
        subtitle={tx(
          "A typical day-by-day flow. Exact activities are confirmed with the team when you book."
        )}
      >
        <Accordion
          items={retreat.itineraryDays.map((item) => ({
            ...item,
            title: tx(item.title),
            description: tx(item.description),
          }))}
          defaultOpenIds={[retreat.itineraryDays[0].id]}
        />
      </Section>

      <Section title={tx("Booking & Trip Manual")} className="surface-section">
        <div className="booking-panel">
          <div className="booking-panel-main">
            <h3>{tx("Book this retreat")}</h3>
            <p>
              {tx("Contact Karibu Assalam for booking details, availability, and next steps for")} {tx(retreat.title)}.
            </p>
            <CTAButton to={`/booking?retreat=${retreat.slug}`} size="lg">
              {tx("Check dates and availability")}
            </CTAButton>
            <div className="secondary-actions">
              <span>{tx("Prefer to write directly?")}</span>
              <WhatsAppButton payload={bookingPayload} label={tx("Send via WhatsApp")} asLink />
              <a className="text-link" href={buildMailtoUrl(bookingPayload)}>
                {tx("Send via Email")}
              </a>
            </div>
          </div>
          <div className="booking-panel-side">
            <h3>{tx("Trip manual")}</h3>
            {retreat.manualPdfUrl ? (
              <>
                <p>{tx("Open the trip manual PDF for this retreat.")}</p>
                <CTAButton href={retreat.manualPdfUrl} newTab>
                  {tx("Open Trip Manual (PDF)")}
                </CTAButton>
              </>
            ) : (
              <p>
                {tx(
                  "No trip manual link is published for this retreat yet. Contact the team for current details."
                )}
              </p>
            )}
          </div>
        </div>
      </Section>

      <Section title={tx("Related retreats")}>
        <div className="grid cards-3">
          {related.map((item) => (
            <RetreatCard key={item.slug} retreat={item} />
          ))}
        </div>
        <div className="section-actions">
          <Link className="text-link" to="/retreats">
            {tx("View all retreats")}
          </Link>
        </div>
      </Section>
    </main>
  );
}
