import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import Section from "../components/Section";
import EcoVillageCards from "../components/EcoVillageCards";
import PhotoSlot from "../components/PhotoSlot";
import CTAButton from "../components/CTAButton";
import SEO from "../components/SEO";
import heroImg from "../../AssalamHero/assalam-hero.webp";
import roomImg from "../../pics/rooms/camps-22-enhanced.webp";

export default function EcoResort() {
  return (
    <main id="main-content">
      <SEO
        title="Karibu Assalam Eco Resort | Stay in Kizimkazi, Zanzibar"
        description="Stay in a community-led halal eco-village on Kizimkazi beach, with comfortable rooms, shared dining, cultural experiences and sustainable living."
        image={heroImg}
      />
      <Hero
        eyebrow="Eco-Resort"
        title="Eco-Village on the beach"
        subtitle="Karibu Assalam is a community-based eco-village experience in Kizimkazi, Zanzibar, where visitors can stay, learn, relax and connect with local culture while supporting sustainable community development."
        imageSrc={heroImg}
        imageAlt="Karibu Assalam Eco Resort beside the Indian Ocean in Kizimkazi"
        ctaPrimary={{ to: "/booking", label: "Find Your Stay" }}
      />

      <Section
        eyebrow="Stay in Kizimkazi, Zanzibar"
        title="Discover our halal eco resort on the beach"
        subtitle="Stay in our eco village right on Kizimkazi beach in accommodation with views of the Indian Ocean."
      >
        <EcoVillageCards />
      </Section>

      <Section
        title="How we live sustainably"
        subtitle="The eco-village brings learning, community and everyday sustainability together on one oceanside campus."
        className="surface-section"
      >
        <div className="eco-proof-grid">
          <article>
            <h3>Permaculture gardens</h3>
            <p>See the gardens on a campus tour and learn how growing food is part of daily life here.</p>
          </article>
          <article>
            <h3>Solar and water systems</h3>
            <p>The campus tour introduces the systems used across the eco-village.</p>
          </article>
          <article>
            <h3>Shared learning spaces</h3>
            <p>Visit the school, kitchen and workshop spaces where the wider community meets.</p>
          </article>
        </div>
      </Section>

      <Section
        title="Discover more of the eco-village"
        subtitle="Meet the people and projects connected to a stay at Karibu Assalam."
      >
        <div className="eco-discover-grid">
          <article id="kanga-africa" className="eco-discover-card">
            <h3>Kanga Africa</h3>
            <p>Visit Assalam Kanga Village and learn about community life in Kizimkazi on the Karibu Assalam Tour.</p>
            <Link className="text-link" to="/experiences/tours/campus-village-tour">Explore the tour</Link>
          </article>
          <article id="hamammni" className="eco-discover-card">
            <h3>Hamammni</h3>
            <p>Make your own soap with the women's cooperative using coconut oil and local botanicals.</p>
            <Link className="text-link" to="/experiences/workshops/soap-making">Explore the workshop</Link>
          </article>
          <article id="arts-culture" className="eco-discover-card">
            <h3>Arts & Culture Centre</h3>
            <p>Discover performances, music and cultural events connected to the campus.</p>
            <Link className="text-link" to="/experiences#special-events">Explore special events</Link>
          </article>
        </div>
      </Section>

      <Section id="spa" className="surface-section">
        <div className="retreat-feature-split eco-spa-split">
          <PhotoSlot
            label="PLACEHOLDER"
            alt="Image placeholder for the Karibu Assalam halal spa and private pool"
            ratio="4 / 3"
          />
          <div>
            <p className="eyebrow">Halal spa & pool</p>
            <h2>Peace, privacy and ocean views</h2>
            <p>
              Watch the waves while enjoying the private pool or relaxing with a private massage in Zanzibar’s only halal spa and wellness area suitable for small groups or families wishing to experience peace and tranquility in a secluded and muslim-friendly way. Perfect for a girls day out, too.
            </p>
            <CTAButton to="/contact">Book your spa</CTAButton>
          </div>
        </div>
      </Section>

      <Section title="Stay within a living community" className="eco-resort-closing">
        <div className="retreat-feature-split is-reversed">
          <img src={roomImg} alt="Guest accommodation at Karibu Assalam Eco-Village" width="900" height="675" loading="lazy" />
          <div>
            <p>
              Karibu Assalam Eco Resort is for you if you want a stay within a living community and an authentic Zanzibar experience, with nature and sustainability in mind. We offer meaningful halal experiences and accommodation while you travel slow, engage with locals and learn while you create your own memories.
            </p>
            <CTAButton to="/booking" size="lg">Book Your Stay</CTAButton>
          </div>
        </div>
      </Section>
    </main>
  );
}
