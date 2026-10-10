// src\data\experiences.js
//
// Shared photos keep the overview and dedicated category pages consistent.
import craftImg from "../../pics/site-marketing/community-craft-workshop.webp";
import schoolImg from "../../pics/site-marketing/school-campus.webp";
import caveMusicImg from "../../pics/site-marketing/cave-sufi-performance.webp";
import sawaImg from "../../pics/site-marketing/sawa-music-room.webp";
import stoneTownImg from "../../pics/zanzibarpics/Stonetown Historical Site.webp";
import amphitheatreImg from "../../pics/site-marketing/campus-amphitheatre.webp";
import { SPICE_ROUTE_CAFE } from "./siteConfig";

export const campusTour = {
  title: "Daily Karibu Assalam Tour",
  promise: "Visit us in Kizimkazi and support our work",
  text:
    "If you only have a few hours, this half-day tour combines a village visit with a tour of our campus, including a tailored hands-on experience. Meet us at Assalam Ecovillage and let our team first take you to Assalam kanga village in Kizimkazi to meet the local community and learn about Kizimkazi life before you return for a tour of our eco-village, including the school, permaculture gardens and the arts & culture centre. Part of the tour includes a workshop - make hammam soap, design your own drum or learn about eco-printing, and if you would like to personalise your visit, come and check out our cave or take a break in our mosque.",
  facts: ["Permaculture", "Snacks", "Workshop"],
};

export const workshops = [
  {
    slug: "soap-making",
    title: "Hamamni soaps",
    text:
      "Make your own soap with the women's cooperative, using coconut oil and local botanicals. You take your bars home with you.",
  },
  {
    slug: "drumming",
    title: "Drum workshop",
    text:
      "Learn Swahili coastal rhythms with local musicians. No experience needed - everyone leaves able to hold a pattern.",
  },
  {
    slug: "eco-print",
    title: "Eco print workshop",
    text:
      "Print fabric with leaves, flowers and bark gathered on the campus, using natural dyes and no synthetic chemicals.",
  },
  {
    slug: "cooking",
    title: "Cooking class",
    text:
      "Cook Zanzibari dishes with the kitchen team - spices from the garden, recipes from the neighbourhood, and the meal is lunch.",
  },
];

export const tours = [
  {
    slug: "spice-tour",
    title: "City & Spice",
    text:
      "Explore Zanzibar's cultural heritage on a full day tour with a visit of spice gardens and a guided tour of the old town's maze of alleys.",
  },
  {
    slug: "east-coast-tour",
    title: "South East Coast",
    text:
      "The east side of the island, its beaches and its villages, including the Rock Restaurant when the tide allows.",
  },
  {
    slug: "blue-safari",
    title: "Sandbank & Snorkeling",
    text:
      "A day on the water - snorkelling, sandbanks and marine life, by traditional dhow.",
  },
  {
    slug: "kizimkazi-village-tour",
    title: "Kizimkazi Village Tour",
    text: "Take a village tour with our team to connect with the community, learn about local life and visit Salaam Cave.",
    photoAlt: "Community gathering during Ramadan at Assalam Kanga Village",
  },
];

export const safari = {
  title: "Safari",
  promise: "Mainland Tanzania, arranged from Zanzibar.",
  text:
    "One-day safari trips to the mainland parks can be arranged around your stay. Because routes, seasons and prices change, the team plans each one with you directly rather than selling a fixed package.",
  facts: ["Arranged on request", "One day", "Planned with the team"],
};

export const volunteering = [
  {
    slug: "short-term",
    photo: { src: craftImg, alt: "Visitors and community members making crafts together" },
    title: "Short-term volunteering",
    duration: "Under 3 months",
    text:
      "Join an existing programme for a few weeks - teaching support, the permaculture garden, workshops or events. Best suited to travellers who want to contribute alongside a normal stay.",
  },
  {
    slug: "long-term",
    photo: { src: schoolImg, alt: "The school building at Assalam Eco-Village" },
    title: "Long-term volunteering",
    duration: "3 months and over",
    text:
      "Longer placements take on real responsibility inside a project - a class, a garden, a workshop programme. These are arranged case by case, and start with a conversation about your skills and dates.",
  },
];

export const specialEvents = [
  {
    slug: "sufi-festival",
    photo: { src: caveMusicImg, alt: "Sufi musicians performing in the campus cave", position: "50% 32%" },
    title: "Zanzibar Sufi Festival",
    text:
      "An annual festival of Sufi music, poetry and gathering, hosted with Assalam. It has its own site with the programme and dates.",
    linkLabel: "Visit the festival site",
    external: "sufiFestivalUrl",
  },
  {
    slug: "sawa-ensemble",
    photo: { src: sawaImg, alt: "Music practice in the Sawa Ensemble room" },
    title: "Sawa Ensemble",
    text:
      "The music ensemble that grew out of the campus, performing coastal and devotional repertoire. Follow them for performance dates.",
    linkLabel: "Follow on Instagram",
    external: "sawaEnsembleUrl",
  },
  {
    slug: "stone-town-cafe",
    photo: { src: stoneTownImg, alt: "Historic Stone Town in Zanzibar" },
    title: "Visit us in Stone Town",
    text:
      "You can find us in Stone Town as well - our Spice Route Cafe offers yummy drinks & food in the heart of the historic city and our Spice Route Museum takes you on a story telling journey all about spice trade in Zanzibar.",
    linkLabel: "Find out more",
    href: SPICE_ROUTE_CAFE.tripAdvisorUrl,
  },
  {
    slug: "stay-updated",
    photo: { src: amphitheatreImg, alt: "The open-air amphitheatre at Karibu Assalam" },
    title: "Follow us",
    text:
      "We are on Instagram and Tripadvisor - follow us and learn more about our camps & retreats, volunteer experiences, life in our eco-village as well as special events.",
    linkLabel: "Follow us",
    external: "instagramUrl",
  },
];
