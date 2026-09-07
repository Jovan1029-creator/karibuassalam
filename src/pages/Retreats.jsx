import { useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import Section from "../components/Section";
import Showcase from "../components/Showcase";
import TornEdge from "../components/TornEdge";
import CTAButton from "../components/CTAButton";
import SEO from "../components/SEO";
import { retreats } from "../data/retreats";
import heroImg from "../../pics/our retreats/Nature Retreat-enhanced.webp";

export default function Retreats() {
  const navigate = useNavigate();

  return (
    <main id="main-content">
      <SEO
        title="Retreats & Camps at Karibu Assalam | Zanzibar"
        description="Discover community experiences, hands-on workshops, cultural visits, meals and accommodation at Karibu Assalam Eco-Village in Kizimkazi."
        image={heroImg}
      />

      <Hero
        eyebrow="Retreats"
        title="Retreats & Camps at Karibu Assalam"
        subtitle="All our camps are based in the Karibu Assalam Eco-Village, the only eco-village in Zanzibar located right on Kizimkazi beach. Our camps include community experiences, guided activities, hands-on workshops, cultural visits as well as all meals, accommodation, and airport transfers."
        imageSrc={heroImg}
        imageAlt="Nature retreat at Karibu Assalam Eco-Village"
        compact
        ctaPrimary={{ to: "/contact", label: "Book your retreat" }}
      />

      <Section className="retreat-jump-section" containerClassName="retreat-jump-inner">
        <label htmlFor="retreat-jump">Find your camp or retreat</label>
        <select
          id="retreat-jump"
          defaultValue=""
          onChange={(event) => event.target.value && navigate(`/retreats/${event.target.value}`)}
        >
          <option value="" disabled>Choose a retreat</option>
          {retreats.map((retreat) => (
            <option value={retreat.slug} key={retreat.slug}>
              {retreat.details?.heading || retreat.title}
            </option>
          ))}
        </select>
      </Section>

      <div className="torn-band retreat-showcase-band">
        <TornEdge position="top" color="var(--bg)" />
        <div className="set-intro">
          <p className="eyebrow">Retreats & Camps at Karibu Assalam</p>
          <h2>Stay, learn, connect and experience Zanzibar differently</h2>
          <p className="lead">
            Choose the camp that fits the way you want to travel. Each programme keeps community, culture and meaningful experiences at its heart.
          </p>
        </div>

        <div className="showcase-set">
          {retreats.map((retreat, index) => (
            <Showcase
              key={retreat.slug}
              reversed={index % 2 === 1}
              priority={index === 0}
              name={retreat.details?.heading || retreat.title}
              promise={retreat.details?.intro || retreat.shortPromise}
              facts={(retreat.details?.includedItems || retreat.highlights).slice(0, 3)}
              price={
                <>
                  <strong>{retreat.details?.priceText || `EUR ${retreat.priceFrom}`}</strong>{" "}
                  {"·"} {retreat.details?.durationText || `${retreat.durationDays || retreat.itineraryDays.length} days`}
                </>
              }
              image={retreat.heroImage}
              alt={`${retreat.details?.heading || retreat.title} retreat preview`}
              imageWidth={768}
              imageHeight={614}
              cta={{ to: `/retreats/${retreat.slug}`, label: "More details" }}
            />
          ))}
        </div>
        <TornEdge position="bottom" color="var(--bg)" />
      </div>

      <Section
        title="Ready to find your retreat?"
        subtitle="Tell us which programme interests you and the dates you are considering. The Karibu Assalam team will confirm availability and the next steps."
      >
        <div className="section-actions">
          <CTAButton to="/contact" size="lg">Book your retreat</CTAButton>
        </div>
      </Section>
    </main>
  );
}
