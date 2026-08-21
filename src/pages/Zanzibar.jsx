import Hero from "../components/Hero";
import Section from "../components/Section";
import Card from "../components/Card";
import SEO from "../components/SEO";
import { useLanguage } from "../context/LanguageContext";
import stoneSpiceImg from "../../pics/zanzibarpics/Stonetown & Spice Garden.jpg";
import eastCoastImg from "../../pics/zanzibarpics/Blue Safari.jpg";
import blueSafariImg from "../../pics/zanzibarpics/East Coast Tour.jpg";
import historyImg from "../../pics/zanzibarpics/Stonetown Historical Site.webp";

const historicHighlights = [
  "Anglican Cathedral",
  "House of Wonders",
  "Palace Museum",
  "Old Fort",
  "Darajani Market",
  "Hamamni Baths",
  "Freddie Mercury’s house",
];

function ZanzibarModule({ title, image, alt, children }) {
  return (
    <Card className="zanzibar-module">
      <div className="media-frame wide">
        <img src={image} alt={alt} loading="lazy" decoding="async" width="1024" height="512" />
      </div>
      <div className="card-body">
        <h3>{title}</h3>
        {children}
      </div>
    </Card>
  );
}

export default function Zanzibar() {
  const { tx } = useLanguage();

  return (
    <main id="main-content">
      <SEO
        title={tx("Zanzibar Experiences | Karibu Assalam")}
        description={tx(
          "Explore Zanzibar experiences including Spice Garden visits, East Coast tours, Blue Safari, Turtle Cave, and historic Stone Town highlights."
        )}
        image={stoneSpiceImg}
      />
      <Hero
        eyebrow={tx("Zanzibar")}
        title={tx("Guided Zanzibar experiences")}
        subtitle={tx(
          "Discover curated Zanzibar modules that combine culture, coastline, and heritage landmarks."
        )}
        imageSrc={stoneSpiceImg}
        imageAlt={tx("Stone Town and Spice Garden experience in Zanzibar")}
        compact
      />

      <Section title={tx("Experience Modules")} className="surface-section">
        <div className="zanzibar-grid">
          <ZanzibarModule
            title={tx("Spice Garden")}
            image={stoneSpiceImg}
            alt={tx("Spice garden excursion scene")}
          >
            <p>
              {tx(
                "A guided Spice Garden visit introduces Zanzibar's spice heritage through plants, scents, local farming knowledge, and cultural storytelling."
              )}
            </p>
          </ZanzibarModule>

          <ZanzibarModule
            title={tx("East Coast Tour")}
            image={eastCoastImg}
            alt={tx("East Coast Tour scenery in Zanzibar")}
          >
            <p>
              {tx(
                "Explore Zanzibar's east coast and include the well-known Rock Restaurant experience, where access depends on the tide."
              )}
            </p>
          </ZanzibarModule>

          <ZanzibarModule
            title={tx("Blue Safari")}
            image={blueSafariImg}
            alt={tx("Blue Safari ocean excursion in Zanzibar")}
          >
            <p>
              {tx("Blue Safari features snorkeling, marine life, and sandbank-focused ocean experiences.")}
            </p>
          </ZanzibarModule>

          <ZanzibarModule
            title={tx("Swimming with Turtles")}
            image={blueSafariImg}
            alt={tx("Turquoise ocean scenery for Turtle Cave excursion")}
          >
            <p>
              {tx(
                "Turtle Cave offers swimming with turtles, feeding encounters, and relaxation-focused nature escapes."
              )}
            </p>
          </ZanzibarModule>

          <ZanzibarModule
            title={tx("Stonetown Historical Site")}
            image={historyImg}
            alt={tx("Historical site view in Stone Town Zanzibar")}
          >
            <p>{tx("Highlights include:")}</p>
            <ul className="check-list cols-2">
              {historicHighlights.map((item) => (
                <li key={item}>{tx(item)}</li>
              ))}
            </ul>
          </ZanzibarModule>
        </div>
      </Section>
    </main>
  );
}
