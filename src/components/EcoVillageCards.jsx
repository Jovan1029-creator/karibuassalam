import { useLanguage } from "../context/LanguageContext";
import roomsImg from "../../pics/rooms/camps-22-enhanced.webp";
import foodImg from "../../pics/rooms/food-1-enhanced.webp";
import campusImg from "../../pics/rooms/Image-2-edited-enhanced.webp";
import CTAButton from "./CTAButton";

const cards = [
  {
    title: "Rooms",
    to: "/rooms",
    image: roomsImg,
    alt: "Eco-village room exterior and lodging area",
    text: "Comfortable eco-village accommodation with ocean or garden views and renewable energy support.",
  },
  {
    title: "Food",
    to: "/food",
    image: foodImg,
    alt: "Fresh meal presentation from Karibu Assalam kitchen",
    text: "Farm-to-table meals prepared by a multicultural kitchen team, including shared dinners by the beach.",
  },
  {
    title: "Campus",
    to: "/campus",
    image: campusImg,
    alt: "Assalam eco-village campus common space",
    text: "An oceanside campus with learning spaces, a communal area, and sustainability features.",
  },
];

export default function EcoVillageCards() {
  const { tx } = useLanguage();

  return (
    <div className="circle-cards">
      {cards.map((card) => (
        <article className="circle-card" key={card.title}>
          <div className="circle-card-photo">
            <img
              src={card.image}
              alt={tx(card.alt)}
              loading="lazy"
              decoding="async"
              width="768"
              height="768"
            />
          </div>
          <h3>{tx(card.title)}</h3>
          <p>{tx(card.text)}</p>
          <CTAButton to={card.to} variant="secondary" size="sm">
            {tx("View more")}
          </CTAButton>
        </article>
      ))}
    </div>
  );
}
