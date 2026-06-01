import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import roomsImg from "../../pics/rooms/camps-22-768x576.webp";
import foodImg from "../../pics/rooms/food-1.webp";
import campusImg from "../../pics/rooms/Image-2-edited-768x576.webp";
import Card from "./Card";

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
    <div className="grid cards-3">
      {cards.map((card) => (
        <Card key={card.title} className="link-card">
          <div className="media-frame">
            <img src={card.image} alt={tx(card.alt)} loading="lazy" decoding="async" />
          </div>
          <div className="card-body">
            <h3>{tx(card.title)}</h3>
            <p>{tx(card.text)}</p>
            <Link className="text-link" to={card.to}>
              {tx("Learn more")}
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
}
