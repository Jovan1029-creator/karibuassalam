import soapImg from "../../pics/site-marketing/hamammni-soap-workshop.webp";
import drumImg from "../../pics/site-marketing/ngoma-drumming-workshop.webp";
import cookingImg from "../../pics/site-marketing/swahili-kitchen.webp";

// Editorial edition, not the visitor's device month. These are activity
// previews, NOT scheduled events. Add ISO dates only after team confirmation.
export const campusProgramme = {
  month: "2026-10",
  label: "October 2026",
  activities: [
    {
      id: "campus-soap",
      date: null,
      title: "Campus Tour incl Hamammni Workshop",
      description: "Explore our beachfront campus and discover the permaculture gardens, then get hands-on with natural soap-making.",
      image: soapImg,
      alt: "Guests taking part in the Hamammni soap workshop",
      to: "/experiences/tours/campus-village-tour",
    },
    {
      id: "ngoma",
      date: null,
      title: "Ngoma drumming workshop",
      description: "Discover Swahili coastal rhythms and learn how to play ngoma, the local drum, with our musicians.",
      image: drumImg,
      alt: "Participants learning to play ngoma drums together",
      to: "/experiences/workshops/drumming",
    },
    {
      id: "swahili-cooking",
      date: null,
      title: "Swahili cooking class",
      description: "Join our campus chefs for a hands-on introduction to Swahili flavours, local ingredients and shared cooking.",
      image: cookingImg,
      alt: "Cooking together in the Karibu Assalam kitchen",
      to: "/experiences/workshops/cooking",
    },
  ],
};
