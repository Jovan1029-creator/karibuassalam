import soapImg from "../../pics/site-marketing/hamammni-soap-workshop.webp";
import drumImg from "../../pics/site-marketing/ngoma-drumming-workshop.webp";
import cookingImg from "../../pics/site-marketing/swahili-kitchen.webp";
import kindnessImg from "../../pics/site-marketing/kindness-community-celebration.webp";
import sawaImg from "../../pics/site-marketing/sawa-music-room.webp";

// Team-confirmed weekly activities and dated camps for this editorial edition.
// Keep the months explicit; do not roll schedules into later months automatically.
export const campusProgramme = {
  month: "2026-10",
  endMonth: "2026-11",
  label: "October & November 2026",
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
      whatsAppMessage: "Hello! I would like to join the next Tuesday Campus Tour including the Hamamni Workshop in October or November 2026.",
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
      whatsAppMessage: "Hello! I would like to join the next Thursday Campus Tour including the Ngoma Workshop in October or November 2026.",
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
      whatsAppMessage: "Hello! I would like to join the next Wednesday Swahili Cooking Class in October or November 2026.",
    },
    {
      id: "kindness-camp-november",
      date: "2026-11-30",
      endDate: "2026-12-05",
      title: "Kindness Camp",
      description: "Discover Zanzibar’s unique atmosphere, culture and nature and create beautiful memories while learning new things and sharing goodness while participating in local workshops and activities with the local community.",
      image: kindnessImg,
      imageFit: "contain",
      alt: "Children celebrating together at the gates of Assalam Kanga Village",
      to: "/retreats/kindness-camp",
      retreatSlug: "kindness-camp",
      bookingTo: "/booking?programme=kindness-camp-november",
    },
    {
      id: "art-retreat-music-november",
      date: "2026-11-30",
      endDate: "2026-12-06",
      title: "Art Retreat Camp - Music Edition",
      description: "Join our Sawa Ensemble and Danish/Palestinian Oud Virtuoso & Composer Bilal Irshed for a week of musical exchange, experimentation and collaboration on our campus in Kizimkazi/Zanzibar. This edition’s theme: BRIDGING MAQAM & COASTAL RHYTHMS: OUD & AFRICAN FUSION. Come with your sound, leave with new connections, inspirations and possibilities.",
      // Temporary related photo until the full, uncropped event flyer is supplied.
      image: sawaImg,
      alt: "Music practice in the Sawa Ensemble room",
      detailsUrl: "https://www.instagram.com/p/DeleoO9tZJu/",
      bookingTo: "/booking?programme=art-retreat-music-november",
    },
  ],
};
