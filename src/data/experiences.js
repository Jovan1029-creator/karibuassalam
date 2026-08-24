// src\data\experiences.js
//
// The Experiences page groups everything a guest can do that is not the stay
// itself. Images are intentionally omitted where none has been supplied yet —
// the page renders a labelled placeholder in their place.

export const campusTour = {
  title: "Daily campus tour",
  promise: "A free guided walk through the eco-village, every day.",
  text:
    "A member of the team walks you through the campus: the school, the permaculture garden, the solar and water systems, the kitchen and the workshop spaces. It is the quickest way to understand how the village actually works.",
  facts: ["Runs daily", "About 45 minutes", "Free for guests"],
};

export const workshops = [
  {
    slug: "soap-making",
    title: "Soap making",
    text:
      "Make your own soap with the women's cooperative, using coconut oil and local botanicals. You take your bars home with you.",
  },
  {
    slug: "drumming",
    title: "Drum workshop",
    text:
      "Learn Swahili coastal rhythms with local musicians. No experience needed — everyone leaves able to hold a pattern.",
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
      "Cook Zanzibari dishes with the kitchen team — spices from the garden, recipes from the neighbourhood, and the meal is lunch.",
  },
];

export const tours = [
  {
    slug: "spice-tour",
    title: "Spice Tour",
    text:
      "Walk a working spice farm and meet the plants behind the island's name — clove, cardamom, vanilla, nutmeg, cinnamon.",
  },
  {
    slug: "city-tour",
    title: "City Tour",
    text:
      "Stone Town on foot: the old fort, the markets, the carved doors and the seafront at sunset.",
  },
  {
    slug: "east-coast-tour",
    title: "East Coast Tour",
    text:
      "The east side of the island, its beaches and its villages, including the Rock Restaurant when the tide allows.",
  },
  {
    slug: "blue-safari",
    title: "Blue Safari",
    text:
      "A day on the water — snorkelling, sandbanks and marine life, by traditional dhow.",
  },
];

export const safari = {
  title: "Safari",
  promise: "Mainland Tanzania, arranged from Zanzibar.",
  text:
    "Multi-day safari trips to the mainland parks can be arranged around your stay. Because routes, seasons and prices change, the team plans each one with you directly rather than selling a fixed package.",
  facts: ["Arranged on request", "Multi-day", "Planned with the team"],
};

export const volunteering = [
  {
    slug: "short-term",
    title: "Short-term volunteering",
    duration: "Under 3 months",
    text:
      "Join an existing programme for a few weeks — teaching support, the permaculture garden, workshops or events. Best suited to travellers who want to contribute alongside a normal stay.",
  },
  {
    slug: "long-term",
    title: "Long-term volunteering",
    duration: "3 months and over",
    text:
      "Longer placements take on real responsibility inside a project — a class, a garden, a workshop programme. These are arranged case by case, and start with a conversation about your skills and dates.",
  },
];

export const specialEvents = [
  {
    slug: "sufi-festival",
    title: "Zanzibar Sufi Festival",
    text:
      "An annual festival of Sufi music, poetry and gathering, hosted with Assalam. It has its own site with the programme and dates.",
    linkLabel: "Visit the festival site",
    external: "sufiFestivalUrl",
  },
  {
    slug: "sawa-ensemble",
    title: "Sawa Ensemble",
    text:
      "The music ensemble that grew out of the campus, performing coastal and devotional repertoire. Follow them for performance dates.",
    linkLabel: "Follow on Instagram",
    external: "sawaEnsembleUrl",
  },
  {
    slug: "camps-retreats",
    title: "Camps and retreats",
    text:
      "The scheduled programmes that run through the year — kindness camps, Ramadan camps, school camps and nature retreats.",
    linkLabel: "See the retreats",
    to: "/retreats",
  },
  {
    slug: "stay-updated",
    title: "Stay updated",
    text:
      "Dates are announced as they are confirmed. Follow along or ask the team to let you know when something is opening.",
    linkLabel: "Ask about dates",
    to: "/booking",
  },
];
