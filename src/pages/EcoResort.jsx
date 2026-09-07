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
