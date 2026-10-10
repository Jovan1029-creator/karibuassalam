import education from "../../pics/our stories/education-1-enhanced.webp";
import jetty from "../../pics/site-marketing/ocean-jetty.webp";
import aerial from "../../pics/site-marketing/campus-coast-aerial.webp";
import terrace from "../../pics/rooms/Image-2-edited-enhanced.webp";
import room from "../../pics/site-marketing/eco-village-room-interior.webp";
import guestRoom from "../../pics/rooms/camps-22-enhanced.webp";
import familyRoom from "../../pics/site-marketing/eco-village-family-room.jpg";
import kindness from "../../pics/our retreats/Kindness Camp-enhanced.webp";
import craft from "../../pics/site-marketing/community-craft-workshop.webp";
import ramadan from "../../pics/site-marketing/ramadan-community-evening.webp";
import meal from "../../pics/rooms/food-1-enhanced.webp";
import freshMeal from "../../pics/site-marketing/fresh-shared-meal.webp";
import dining from "../../pics/site-marketing/oceanfront-dining.webp";
import kitchen from "../../pics/site-marketing/swahili-kitchen.webp";
import garden from "../../pics/site-marketing/permaculture-campus-tour.webp";
import tailoring from "../../pics/site-marketing/kanga-tailoring-workshop.webp";
import soapMaking from "../../pics/site-marketing/hamammni-soap-making-closeup.webp";
import drumMaking from "../../pics/site-marketing/ngoma-drum-making.webp";
import { campusVisitPhoto, campusCourtyardPhoto, schoolCampPhotos } from "./campusPhotos";

// Each tile keeps its subject as it rotates. Only the visible photo is loaded
// initially; the next is preloaded when this tile is on screen and playing.
const suppliedPhoto = ({ src, alt }) => ({ image: src, alt });
export const campusMoments = [
  {
    id: "learning", label: "Learning together", className: "moment-card-tall",
    photos: [
      { image: education, alt: "Participants working together during a hands-on workshop" },
      suppliedPhoto(schoolCampPhotos[0]),
      suppliedPhoto(schoolCampPhotos[1]),
    ],
  },
  {
    id: "craft", label: "Made by hand", className: "moment-card-tall",
    photos: [
      { image: tailoring, alt: "Textile craft at the Kanga tailoring workshop" },
      { image: soapMaking, alt: "Making natural soap in the campus workshop" },
      { image: drumMaking, alt: "Making a ngoma drum by hand" },
    ],
  },
  {
    id: "coast", label: "Eco-village by the coast", className: "moment-card-wide",
    photos: [
      { image: jetty, alt: "Ocean-facing jetty at Karibu Assalam Eco-Village" },
      { image: aerial, alt: "Aerial view of the eco-village along the Zanzibar coast" },
      { image: terrace, alt: "A shaded swing overlooking the beach and ocean" },
    ],
  },
  {
    id: "rooms", label: "Rooms prepared for guests",
    photos: [
      { image: room, alt: "Prepared guest room at Karibu Assalam Eco-Village" },
      { image: guestRoom, alt: "Guest beds with mosquito nets and a view onto the terrace" },
      { image: familyRoom, alt: "A spacious guest room with prepared beds and patterned cushions" },
    ],
  },
  {
    id: "community", label: "Community moments",
    photos: [
      { image: kindness, alt: "Visitors connecting during a Karibu Assalam community retreat" },
      { image: craft, alt: "Visitors and local women sharing a hands-on craft activity" },
      { image: ramadan, alt: "A community gathering during Ramadan at Assalam Kanga Village" },
    ],
  },
  {
    id: "meals", label: "Shared meals",
    photos: [
      { image: meal, alt: "A colourful meal with fresh fruit and vegetables" },
      { image: freshMeal, alt: "Freshly prepared food served on a plate at the campus" },
      { image: dining, alt: "Guests sharing a meal at an ocean-view table" },
      { image: kitchen, alt: "A campus chef serving freshly prepared food" },
    ],
  },
  {
    id: "nature", label: "Nature and sustainability",
    photos: [
      { image: garden, alt: "Visitors exploring the permaculture area at Assalam" },
      suppliedPhoto(campusVisitPhoto),
      suppliedPhoto(campusCourtyardPhoto),
    ],
  },
];
