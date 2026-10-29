// src\pages\Campus.jsx
import Hero from "../components/Hero";
import Section from "../components/Section";
import SEO from "../components/SEO";
import { useLanguage } from "../context/LanguageContext";
import campusImg from "../../pics/site-marketing/october-albums/campus-coast.webp";
import permacultureImg from "../../pics/site-marketing/permaculture-campus-tour.webp";
import PhotoCardMedia from "../components/PhotoCardMedia";
import CampusLifeGallery from "../components/CampusLifeGallery";
import { campusVenuePhotos } from "../data/campusGallery";
import amphitheatreImg from "../../pics/site-marketing/campus-amphitheatre.webp";
import jettyImg from "../../pics/site-marketing/ocean-jetty.webp";
import spaImg from "../../pics/site-marketing/spa-ocean-pool.webp";
import artsImg from "../../pics/site-marketing/sawa-music-room.webp";
import { boutiquePhoto, vocationalWorkshopPhoto } from "../data/workshopPhotos";

const campusSpaces = [
  { ...campusVenuePhotos.school, title: "International School" },
  { title: "Open-air amphitheatre", src: amphitheatreImg, alt: "The open-air amphitheatre at Karibu Assalam" },
  { ...campusVenuePhotos.mosque, title: "Campus mosque" },
  { title: "Jetty & beach", src: jettyImg, alt: "A thatched jetty beside the beach at Karibu Assalam" },
  { ...campusVenuePhotos.restaurant, title: "Istanbul restaurant" },
  { title: "Permaculture garden", src: permacultureImg, alt: "Visitors exploring the permaculture area at Assalam" },
  { title: "Halal Spa & Pool", src: spaImg, alt: "Private pool and sun loungers at Karibu Assalam" },
  { ...boutiquePhoto, title: "Boutique" },
  { title: "Arts & Cultural Centre", src: artsImg, alt: "Music practice in the Sawa Ensemble room" },
  { ...vocationalWorkshopPhoto, title: "Vocational Training Workshop" },
];

export default function Campus() {
  const { tx } = useLanguage();

  return (
    <main id="main-content">
      <SEO
        title={tx("Karibu Assalam Eco Village | Karibu Assalam")}
        description={tx(
          "Explore the Karibu Assalam eco-village campus with an international school setting, permaculture garden, renewable energy, and oceanside learning spaces."
        )}
        image={campusImg}
      />
      <Hero
        eyebrow={tx("Eco-Village")}
        title={tx("Karibu Assalam Eco Village")}
        subtitle={tx(
          "An oceanside, multicultural campus environment designed for learning, community activities, and sustainability-focused living."
        )}
        imageSrc={campusImg}
        imageWidth={1023}
        imageHeight={1023}
        imageAlt={tx("Aerial view of Karibu Assalam Eco-Village on the coast")}
        compact
      />

      <Section id="campus-life" title={tx("Campus Life")} className="surface-section">
        <div className="campus-life-intro">
          <p>
            {tx(
              "The campus includes renewable energy systems such as solar panels, an amphitheater for group gatherings, a communal eating area, and a pool designed for the youngest learners."
            )}
          </p>
          <p>
            {tx(
              "Its oceanside setting supports community-based learning, shared meals, and daily activities in a multicultural environment."
            )}
          </p>
        </div>
        <CampusLifeGallery />
      </Section>
      <Section id="campus-spaces" title="Around the campus">
        <div className="eco-discover-grid campus-spaces-grid">
          {campusSpaces.map((space) => (
            <article className="eco-discover-card" key={space.title}>
              <PhotoCardMedia photo={space} />
              <h3>{tx(space.title)}</h3>
            </article>
          ))}
        </div>
      </Section>
    </main>
  );
}
