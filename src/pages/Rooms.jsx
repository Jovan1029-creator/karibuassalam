import Hero from "../components/Hero";
import Section from "../components/Section";
import Showcase from "../components/Showcase";
import TornEdge from "../components/TornEdge";
import CTAButton from "../components/CTAButton";
import SEO from "../components/SEO";
import { useLanguage } from "../context/LanguageContext";
import roomsImg from "../../pics/rooms/camps-22-enhanced.webp";
import campusImg from "../../pics/rooms/Image-2-edited-enhanced.webp";
import coastImg from "../../pics/aboutpic/Zanzibar’s Beaches.webp";

function AmenityIcon({ type }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };

  if (type === "size") {
    return (
      <svg {...common}>
        <path d="M3 8V3h5M21 8V3h-5M3 16v5h5M21 16v5h-5" />
      </svg>
    );
  }
  if (type === "beds") {
    return (
      <svg {...common}>
        <path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6M3 18h18M3 18v2M21 18v2" />
        <path d="M7 10V7a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3" />
      </svg>
    );
  }
  if (type === "air") {
    return (
      <svg {...common}>
        <path d="M3 8h13a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h9a2.5 2.5 0 1 1-2.5 2.5" />
      </svg>
    );
  }
  if (type === "solar") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    );
  }
  if (type === "view") {
    return (
      <svg {...common}>
        <path d="M2 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
        <circle cx="17" cy="6" r="2.5" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M12 3l8 5v13H4V8z" />
      <path d="M9 21v-6h6v6" />
    </svg>
  );
}

const amenities = [
  { icon: "size", title: "25 m² rooms", text: "Room and bathroom, with space for luggage and group kit." },
  { icon: "beds", title: "Up to 5 beds", text: "Bed configurations that suit families, groups and school camps." },
  { icon: "air", title: "Air conditioning", text: "Every room is air-conditioned, with mosquito nets on the beds." },
  { icon: "solar", title: "Solar powered", text: "The lodge runs on renewable energy systems, including solar." },
  { icon: "view", title: "Ocean or garden", text: "Rooms look out over the ocean or into the garden, each with a balcony." },
  { icon: "home", title: "Steps from the sea", text: "The lodge sits on the oceanfront, ten minutes’ walk from the sandy beach." },
];

export default function Rooms() {
  const { tx } = useLanguage();

  return (
    <main id="main-content">
      <SEO
        title={tx("Rooms at Assalam Ecolodge | Karibu Assalam")}
        description={tx(
          "Explore room features at Assalam Ecolodge including 25 m2 spaces, 5 bed capacity, AC, renewable energy, and ocean or garden views."
        )}
        image={roomsImg}
      />

      <Hero
        eyebrow={tx("Eco-Village Rooms")}
        title={tx("Comfortable stays at Assalam Ecolodge")}
        subtitle={tx(
          "Rooms are designed to support camp and retreat stays with practical comfort and proximity to the sea."
        )}
        imageSrc={roomsImg}
        imageAlt={tx("Rooms area at Assalam Ecolodge in Zanzibar")}
        compact
        ctaPrimary={{ to: "/booking", label: tx("Check dates and availability") }}
      />

      <div className="wave-band">
        <TornEdge position="top" color="var(--bg)" />

        <div className="set-intro">
          <p className="eyebrow">{tx("Where you sleep")}</p>
          <h2>{tx("A simple room, a short walk from the Indian Ocean")}</h2>
          <p className="lead">
            {tx(
              "There is one kind of room at Assalam Ecolodge, and it is built for the way people actually stay here: in groups, for a week at a time, spending most of the day outside."
            )}
          </p>
        </div>

        <div className="showcase-set">
          <Showcase
            priority
            name={tx("The room")}
            promise={tx("25 m², up to five beds, a bathroom and a balcony.")}
            text={tx(
              "Rooms include a balcony, mosquito nets, and a location close to the sea. Each room setup includes a bathroom and bed configurations suitable for group and retreat stays."
            )}
            facts={[tx("25 m2"), tx("5 bed capacity"), tx("AC")]}
            image={roomsImg}
            alt={tx("Rooms area at Assalam Ecolodge in Zanzibar")}
            imageWidth={768}
            imageHeight={576}
          />

          <Showcase
            reversed
            name={tx("The view")}
            promise={tx("Ocean on one side, garden on the other.")}
            text={tx(
              "Views may face the ocean or garden, and the accommodation environment is supported by renewable energy systems."
            )}
            facts={[tx("Ocean or Garden View"), tx("Renewable Energy")]}
            image={coastImg}
            alt={tx("Zanzibar beach near Assalam Ecolodge")}
            imageWidth={768}
            imageHeight={576}
          />

          <Showcase
            name={tx("The eco-village around it")}
            promise={tx("A campus you can walk across in five minutes.")}
            text={tx(
              "Its oceanside setting supports community-based learning, shared meals, and daily activities in a multicultural environment."
            )}
            image={campusImg}
            alt={tx("Assalam eco-village room and campus view")}
            imageWidth={768}
            imageHeight={576}
            cta={{ to: "/campus", label: tx("See the campus"), variant: "secondary" }}
          />
        </div>

        <TornEdge position="bottom" color="var(--bg)" />
      </div>

      <Section eyebrow={tx("Room Features")} title={tx("What is in every room")}>
        <div className="amenity-grid">
          {amenities.map((item) => (
            <div className="amenity" key={item.title}>
              <AmenityIcon type={item.icon} />
              <h3>{tx(item.title)}</h3>
              <p>{tx(item.text)}</p>
            </div>
          ))}
        </div>
        <div className="section-actions">
          <CTAButton to="/booking">{tx("Check dates and availability")}</CTAButton>
        </div>
      </Section>
    </main>
  );
}
