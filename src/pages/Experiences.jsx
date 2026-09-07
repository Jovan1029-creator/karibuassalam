import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import Section from "../components/Section";
import TornEdge from "../components/TornEdge";
import CTAButton from "../components/CTAButton";
import PhotoSlot from "../components/PhotoSlot";
import SEO from "../components/SEO";
import { SITE } from "../data/siteConfig";
import {
  campusTour,
  safari,
  specialEvents,
  tours,
  volunteering,
  workshops,
} from "../data/experiences";
import { useLanguage } from "../context/LanguageContext";
import heroImg from "../../pics/zanzibarpics/Stonetown & Spice Garden.jpg";
import spiceImg from "../../pics/zanzibarpics/Stonetown & Spice Garden.jpg";
import coastImg from "../../pics/zanzibarpics/East Coast Tour.jpg";
import safariImg from "../../pics/zanzibarpics/Blue Safari.jpg";
import townImg from "../../pics/zanzibarpics/Stonetown Historical Site.webp";
import campusImg from "../../pics/rooms/Image-2-edited-enhanced.webp";

// Tour cards reuse the photography we already have; anything without a picture
// yet renders a placeholder instead.
const tourImages = {
  "spice-tour": spiceImg,
  "city-tour": townImg,
  "east-coast-tour": coastImg,
  "blue-safari": safariImg,
};

export default function Experiences() {
  const { tx } = useLanguage();

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

      {/* ---------------- daily campus tour ---------------- */}
      <div className="torn-band">
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
              alt={tx("Assalam eco-village campus gathering area")}
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

        <TornEdge position="bottom" color="var(--bg)" />
      </div>

      {/* ---------------- workshops ---------------- */}
      <Section
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
                <PhotoSlot label={tx(item.title)} alt={tx(item.title)} ratio="4 / 3" />
              </div>
              <div className="experience-card-body">
                <h3>{tx(item.title)}</h3>
                <p>{tx(item.text)}</p>
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
              </div>
            </article>
          ))}
        </div>
        <div className="section-actions">
          <CTAButton to="/booking">{tx("Book a tour")}</CTAButton>
        </div>
      </Section>

      {/* ---------------- safari ---------------- */}
      <Section scriptTitle eyebrow={tx("Beyond the island")} title={tx(safari.title)}>
        <div className="feature-split">
          <div className="feature-split-media">
            <PhotoSlot label={tx("Safari")} alt={tx("Safari in mainland Tanzania")} ratio="16 / 10" />
          </div>
          <div>
            <p className="showcase-promise">{tx(safari.promise)}</p>
            <p>{tx(safari.text)}</p>
            <ul className="showcase-facts">
              {safari.facts.map((fact) => (
                <li key={fact}>{tx(fact)}</li>
              ))}
            </ul>
            <CTAButton to="/booking">{tx("Ask about safari")}</CTAButton>
          </div>
        </div>
      </Section>

      {/* ---------------- volunteering ---------------- */}
      <Section
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
              <span className="volunteer-duration">{tx(item.duration)}</span>
              <h3>{tx(item.title)}</h3>
              <p>{tx(item.text)}</p>
              <CTAButton to="/contact" variant="secondary" size="sm">
                {tx("Apply to volunteer")}
              </CTAButton>
            </article>
          ))}
        </div>
      </Section>

      {/* ---------------- special events ---------------- */}
      <Section
        scriptTitle
        eyebrow={tx("Through the year")}
        title={tx("Special events")}
        subtitle={tx(
          "Festivals, music and the programmes that bring people to the village from across the island and beyond."
        )}
      >
        <div className="event-grid">
          {specialEvents.map((item) => (
            <article className="event-card" key={item.slug}>
              <h3>{tx(item.title)}</h3>
              <p>{tx(item.text)}</p>
              {item.external ? (
                <a
                  className="text-link"
                  href={SITE[item.external]}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {tx(item.linkLabel)}
                </a>
              ) : (
                <Link className="text-link" to={item.to}>
                  {tx(item.linkLabel)}
                </Link>
              )}
            </article>
          ))}
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
