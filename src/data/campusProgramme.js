import soapImg from "../../pics/site-marketing/hamammni-soap-workshop.webp";
import drumImg from "../../pics/site-marketing/ngoma-drumming-workshop.webp";
import cookingImg from "../../pics/site-marketing/swahili-kitchen.webp";

// Team-confirmed weekly programme for this editorial edition only.
// Keep the month explicit; do not roll these schedules into later months automatically.
export const campusProgramme = {
  month: "2026-10",
  label: "October 2026",
  activities: [
    {
      id: "campus-soap",
      schedule: "Every Tuesday",
      title: "Campus Tour including Hamamni Workshop",
      description: "Explore our beachfront campus and discover the permaculture gardens, then get hands-on with natural soap-making.",
      image: soapImg,
      alt: "Guests taking part in the Hamamni soap workshop",
      to: "/experiences/tours/campus-village-tour",
      joinLabel: "Join the next tour",
      whatsAppMessage: "Hello! I would like to join the next Tuesday Campus Tour including the Hamamni Workshop in October 2026.",
    },
    {
      id: "ngoma",
      schedule: "Every Thursday",
      title: "Campus Tour including Ngoma Workshop",
      description: "Explore our beachfront campus, then discover Swahili coastal rhythms and learn how to play ngoma, the local drum, with our musicians.",
      image: drumImg,
      alt: "Participants learning to play ngoma drums together",
      to: "/experiences/tours/campus-village-tour",
      joinLabel: "Join the workshop",
      whatsAppMessage: "Hello! I would like to join the next Thursday Campus Tour including the Ngoma Workshop in October 2026.",
    },
    {
      id: "swahili-cooking",
      schedule: "Every Wednesday",
      title: "Swahili cooking class",
      description: "Join our campus chefs for a hands-on introduction to Swahili flavours, local ingredients and shared cooking.",
      image: cookingImg,
      alt: "Cooking together in the Karibu Assalam kitchen",
      to: "/experiences/workshops/cooking",
      joinLabel: "Join the next class",
      whatsAppMessage: "Hello! I would like to join the next Wednesday Swahili Cooking Class in October 2026.",
    },
  ],
};
