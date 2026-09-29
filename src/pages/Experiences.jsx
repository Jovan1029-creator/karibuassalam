import { Link, useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import Section from "../components/Section";
import TornEdge from "../components/TornEdge";
import CTAButton from "../components/CTAButton";
import PhotoSlot from "../components/PhotoSlot";
import PhotoCardMedia from "../components/PhotoCardMedia";
import EventCard from "../components/EventCard";
import SEO from "../components/SEO";
import { EXPERIENCE_LINKS, SITE } from "../data/siteConfig";
import {
  campusTour,
  safari,
  specialEvents,
  tours,
  volunteering,
  workshops,
} from "../data/experiences";
import { useLanguage } from "../context/LanguageContext";
import { safariOverviewPhoto } from "../data/safariPhotos";
import heroImg from "../../pics/zanzibarpics/Stonetown & Spice Garden.jpg";
import spiceImg from "../../pics/zanzibarpics/Stonetown & Spice Garden.jpg";
import coastImg from "../../pics/zanzibarpics/East Coast Tour.jpg";
import safariImg from "../../pics/zanzibarpics/Blue Safari.jpg";
import townImg from "../../pics/zanzibarpics/Stonetown Historical Site.webp";
import campusImg from "../../pics/site-marketing/campus-coast-aerial.webp";
import soapWorkshopImg from "../../pics/site-marketing/hamammni-soap-workshop.webp";
import drummingWorkshopImg from "../../pics/site-marketing/ngoma-drumming-workshop.webp";
import kitchenImg from "../../pics/site-marketing/swahili-kitchen.webp";

// Use supplied photographs only where they depict the actual experience;
// workshops without a matching photo retain a labelled placeholder.
const workshopImages = {
  "soap-making": soapWorkshopImg,
  drumming: drummingWorkshopImg,
  cooking: kitchenImg,
};

const tourImages = {
  "spice-tour": spiceImg,
  "city-tour": townImg,
  "east-coast-tour": coastImg,
  "blue-safari": safariImg,
};

export default function Experiences() {
  const { tx } = useLanguage();
  const navigate = useNavigate();

  return (
    <main id="main-content">
      <SEO
        title={tx("Experiences in Zanzibar | Karibu Assalam")}
        description={tx(
          "Daily campus tours, hands-on workshops, Zanzibar tours, safari, volunteering and special events at Karibu Assalam."
        )}
        image={heroImg}
      />

      <Hero
        eyebrow={tx("Experiences")}
        title={tx("Things to do from the eco-village")}
        subtitle={tx(
          "Every day at Karibu Assalam Eco-Village has something on it — a walk around the campus, a workshop, a tour across the island, or an evening of music."
        )}
        imageSrc={heroImg}
        imageAlt={tx("Stone Town and Spice Garden experience in Zanzibar")}
        compact
        ctaPrimary={{ to: "/booking", label: tx("Book an experience") }}
      />

      <Section className="retreat-jump-section" containerClassName="retreat-jump-inner">
        <label htmlFor="experience-jump">{tx("Find your experience")}</label>
        <select
          id="experience-jump"
          defaultValue=""
          onChange={(event) => event.target.value && navigate(event.target.value)}
        >
          <option value="" disabled>{tx("Choose an experience")}</option>
          {EXPERIENCE_LINKS.slice(1).map((item) => (
            <option value={item.to} key={item.to}>{tx(item.name)}</option>
          ))}
        </select>
      </Section>

      {/* ---------------- daily campus tour ---------------- */}
      <div id="campus-village" className="torn-band">
        <TornEdge position="top" color="var(--bg)" />

        <div className="set-intro">
          <p className="eyebrow">{tx("Start here")}</p>
          <h2 className="script-heading">{tx(campusTour.title)}</h2>
          <p className="section-lead">{tx(campusTour.promise)}</p>
        </div>

        <div className="container campus-tour">
          <div className="campus-tour-media">
            <PhotoSlot
              src={campusImg}
              alt={tx("Aerial view of Karibu Assalam Eco-Village on the coast")}
              width={768}
              height={576}
            />
          </div>
          <div className="campus-tour-copy">
            <p>{tx(campusTour.text)}</p>
            <ul className="showcase-facts">
              {campusTour.facts.map((fact) => (
                <li key={fact}>{tx(fact)}</li>
              ))}
            </ul>
            <div className="inline-actions">
              <CTAButton to="/booking">{tx("Book an experience")}</CTAButton>
              <Link className="text-link" to="/campus">
                {tx("See the campus")}
              </Link>
            </div>
          </div>
        </div>

        <div className="container campus-tour-detail">
          <div>
            <h3>{tx("Karibu Assalam Tour: campus & village")}</h3>
            <p>{tx("Spend six hours visiting Assalam Kanga Village and exploring the school, gardens, cave and mosque at the eco-village.")}</p>
          </div>
          <Link className="btn btn-primary" to="/experiences/tours/campus-village-tour">{tx("More details")}</Link>
        </div>

        <TornEdge position="bottom" color="var(--bg)" />
      </div>

      {/* ---------------- workshops ---------------- */}
      <Section
        id="workshops"
        scriptTitle
        eyebrow={tx("Hands on")}
        title={tx("Workshops")}
        subtitle={tx(
          "Half-day sessions run on the campus with the people who do this work every day. Book them on their own or as part of a camp."
        )}
      >
        <div className="experience-grid">
          {workshops.map((item) => (
            <article className="experience-card" key={item.slug}>
              <div className="experience-card-media">
                <PhotoSlot
                  src={workshopImages[item.slug]}
                  label={tx(item.title)}
                  alt={tx(item.title)}
                  ratio="4 / 3"
                  width={1024}
                  height={768}
                />
              </div>
              <div className="experience-card-body">
                <h3>{tx(item.title)}</h3>
                <p>{tx(item.text)}</p>
                <Link className="text-link" to={`/experiences/workshops/${item.slug}`}>{tx("More details")}</Link>
              </div>
            </article>
          ))}
        </div>
        <div className="section-actions">
          <CTAButton to="/booking">{tx("Book a workshop")}</CTAButton>
        </div>
      </Section>

      {/* ---------------- Zanzibar tours ---------------- */}
      <Section
        id="zanzibar-excursions"
        scriptTitle
        eyebrow={tx("Across the island")}
        title={tx("Zanzibar tours")}
        subtitle={tx(
          "Guided days out from the eco-village, with transport and a guide from the team."
        )}
        className="band-mint"
      >
        <div className="experience-grid">
          {tours.map((item) => (
            <article className="experience-card" key={item.slug}>
              <div className="experience-card-media">
                <PhotoSlot
                  src={tourImages[item.slug]}
                  label={tx(item.title)}
                  alt={tx(item.title)}
                  ratio="4 / 3"
                  width={1024}
                  height={768}
                />
              </div>
              <div className="experience-card-body">
                <h3>{tx(item.title)}</h3>
                <p>{tx(item.text)}</p>
                <Link className="text-link" to={`/experiences/tours/${item.slug}`}>{tx("More details")}</Link>
              </div>
            </article>
          ))}
        </div>
        <div className="section-actions">
          <CTAButton to="/booking">{tx("Book a tour")}</CTAButton>
        </div>
      </Section>

      {/* ---------------- safari ---------------- */}
      <Section id="safari" scriptTitle eyebrow={tx("Beyond the island")} title={tx(safari.title)}>
        <div className="feature-split">
          <div className="feature-split-media">
            <PhotoSlot {...safariOverviewPhoto} className="safari-overview-photo" />
          </div>
          <div>
            <p className="showcase-promise">{tx(safari.promise)}</p>
            <p>{tx(safari.text)}</p>
            <ul className="showcase-facts">
              {safari.facts.map((fact) => (
                <li key={fact}>{tx(fact)}</li>
              ))}
            </ul>
            <CTAButton to="/experiences/safari">{tx("More details")}</CTAButton>
          </div>
        </div>
      </Section>

      {/* ---------------- volunteering ---------------- */}
      <Section
        id="volunteer"
        scriptTitle
        eyebrow={tx("Give your time")}
        title={tx("Volunteering")}
        subtitle={tx(
          "Two ways to join the work, depending on how long you can stay. Both start with a conversation about your skills and your dates."
        )}
        className="band-sand"
      >
        <div className="volunteer-grid">
          {volunteering.map((item) => (
            <article className="volunteer-card" key={item.slug}>
              <PhotoCardMedia photo={item.photo} />
              <span className="volunteer-duration">{tx(item.duration)}</span>
              <h3>{tx(item.title)}</h3>
              <p>{tx(item.text)}</p>
              <CTAButton to="/contact" variant="secondary" size="sm">
                {tx("Apply to volunteer")}
              </CTAButton>
            </article>
          ))}
        </div>
        <div className="section-actions">
          <Link className="text-link" to="/experiences/volunteer">{tx("More about volunteering")}</Link>
        </div>
      </Section>

      {/* ---------------- special events ---------------- */}
      <Section
        id="special-events"
        scriptTitle
        eyebrow={tx("Through the year")}
        title={tx("Special events")}
        subtitle={tx(
          "Festivals, music and the programmes that bring people to the village from across the island and beyond."
        )}
      >
        <div className="event-grid">
          {specialEvents.map((item) => (
            <EventCard item={item} key={item.slug} />
          ))}
        </div>
        <div className="section-actions">
          <Link className="text-link" to="/experiences/events">{tx("Explore special events")}</Link>
        </div>
      </Section>

      {/* ---------------- closing call to action ---------------- */}
      <section className="section cta-band doorwork">
        <TornEdge position="top" color="var(--bg)" className="torn-abs torn-abs-top" />
        <div className="container cta-band-inner">
          <h2 className="script-heading on-dark">{tx("Ready to plan your days?")}</h2>
          <p>
            {tx(
              "Tell the team your dates and what you would like to do. They will put the week together with you and confirm what is available."
            )}
          </p>
          <div className="inline-actions cta-band-actions">
            <CTAButton to="/booking" size="lg">
              {tx("Book Now")}
            </CTAButton>
            <a
              className="btn btn-outline btn-lg"
              href={`https://wa.me/${SITE.whatsAppPhone}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {tx("Message us on WhatsApp")}
            </a>
          </div>
          {SITE.tripAdvisorUrl && (
            <a
              className="cta-band-reviews"
              href={SITE.tripAdvisorUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {tx("Read our reviews on Tripadvisor")}
            </a>
          )}
        </div>
        <TornEdge position="bottom" color="var(--bg)" className="torn-abs torn-abs-bottom" />
      </section>
    </main>
  );
}
