// src\data\retreats.js
import kindnessCampImg from "../../pics/our retreats/Kindness Camp.webp";
import ramadanCampImg from "../../pics/our retreats/Ramadan Camp.webp";
import familyTourImg from "../../pics/our retreats/Family Tour.png";
import culturalHeritageImg from "../../pics/our retreats/Cultural Heritage Tour.webp";
import schoolCampImg from "../../pics/our retreats/School Camp.png";
import natureRetreatImg from "../../pics/our retreats/Nature Retreat.webp";

export const COMMON_INCLUSIONS = [
  "Accommodations",
  "Three daily meals",
  "Participation in seminars/activities",
  "Airport transportation",
  "Guided tours",
];

function day(day, title, description) {
  return { id: `day-${day}`, day, title, description };
}

function genericItinerary(overrides = {}) {
  const defaults = [
    day(1, "Arrival and airport transfer", "Check in at Assalam Ecolodge and settle into the retreat schedule."),
    day(2, "Community activities and workshops", "Structured activities, shared meals, and guided sessions."),
    day(3, "Guided activities from Assalam Ecolodge base", "Seminars and activities linked to the retreat theme."),
    day(4, "Seminars and reflection sessions", "Program sessions and group reflection."),
    day(5, "Community activities and workshops", "Themed activities and guided group time."),
    day(6, "Guided tours and shared learning", "Guided tour time with learning-focused discussion."),
    day(7, "Departure and airport transfer", "Closing session and airport transportation."),
  ];

  return defaults.map((item) => overrides[item.day] ?? item);
}

export const retreats = [
  {
    slug: "kindness-camp",
    title: "Kindness Camp",
    priceFrom: 900,
    durationDays: 7,
    shortPromise:
      "A service-centered retreat combining community volunteering, seminars, and guided Zanzibar experiences.",
    heroImage: kindnessCampImg,
    inclusions: COMMON_INCLUSIONS,
    highlights: [
      "Kizimkazi Village",
      "Spice Garden",
      "Stone Town",
      "Kanga Village",
      "Jozani Forest",
    ],
    itineraryDays: [
      day(1, "Arrival and orientation", "Airport transfer, check-in, and retreat orientation at Assalam Ecolodge."),
      day(2, "Kizimkazi Village", "Guided camp activities and community-focused time in Kizimkazi Village."),
      day(3, "Spice Garden", "A guided Spice Garden visit as part of the 7-day plan."),
      day(4, "Stone Town", "Guided exploration and program activities in Stone Town."),
      day(5, "Kanga Village", "Community activities and camp sessions connected to Kanga Village."),
      day(6, "Jozani Forest", "Guided excursion to Jozani Forest and shared reflection."),
      day(7, "Closing and departure", "Final sessions, wrap-up, and airport transportation."),
    ],
    manualPdfUrl:
      "https://karibuassalam.com/wp-content/uploads/2024/11/Kindness-Camp-Handbook.pdf",
  },
  {
    slug: "ramadan-camp",
    title: "Ramadan Camp",
    priceFrom: 900,
    durationDays: null,
    shortPromise:
      "A Ramadan camp centered on community support, zakat activities, and shared iftar in Zanzibar.",
    heroImage: ramadanCampImg,
    inclusions: COMMON_INCLUSIONS,
    highlights: [
      "Food packages",
      "Zakat distribution",
      "Iftar with local community in Kanga Village (~6:30 pm)",
    ],
    itineraryDays: genericItinerary({
      2: day(2, "Food package preparation", "Prepare and organize food packages as part of camp activities."),
      3: day(3, "Zakat distribution", "Participate in zakat distribution activities with the camp team."),
      5: day(
        5,
        "Kanga Village iftar (~6:30 pm)",
        "Iftar with the local community in Kanga Village at approximately 6:30 pm."
      ),
    }),
    manualPdfUrl: "https://karibuassalam.com/wp-content/uploads/2024/11/Ramadan-Camps.pdf",
  },
  {
    slug: "family-tour",
    title: "Family Tour",
    priceFrom: 900,
    durationDays: null,
    shortPromise:
      "A family-oriented Zanzibar program with guided tours, shared activities, and eco-village accommodation.",
    heroImage: familyTourImg,
    inclusions: COMMON_INCLUSIONS,
    highlights: ["Prison island tour"],
    itineraryDays: genericItinerary({
      3: day(3, "Prison island tour", "Guided prison island tour as part of the family program."),
      5: day(5, "Family activities", "Shared family activities and guided exploration."),
    }),
    manualPdfUrl: null,
  },
  {
    slug: "cultural-heritage-tour",
    title: "Cultural Heritage Tour",
    priceFrom: 900,
    durationDays: null,
    shortPromise:
      "A heritage-focused retreat exploring cultural sites and historical context across Zanzibar.",
    heroImage: culturalHeritageImg,
    inclusions: COMMON_INCLUSIONS,
    highlights: ["Dimbani Mosque", "Stone Town heritage elements"],
    itineraryDays: genericItinerary({
      2: day(2, "Stone Town heritage elements", "Guided sessions focused on Stone Town heritage elements."),
      3: day(3, "Dimbani Mosque", "Visit and learning activities connected to Dimbani Mosque."),
    }),
    manualPdfUrl:
      "https://karibuassalam.com/wp-content/uploads/2024/11/Cultural-Heritage-Tour.pdf",
  },
  {
    slug: "school-camp",
    title: "School Camp",
    priceFrom: 750,
    durationDays: null,
    shortPromise:
      "A structured school camp with hands-on learning, instructor guidance, and a clear daily flow.",
    heroImage: schoolCampImg,
    inclusions: COMMON_INCLUSIONS,
    highlights: ["Hands-on learning", "Instructors", "Typical Day flow"],
    itineraryDays: genericItinerary({
      2: day(2, "Typical Day flow", "Instructor-led sessions follow a clear daily learning rhythm."),
      3: day(3, "Hands-on learning", "Practical learning activities guided by instructors."),
      4: day(4, "Instructor sessions", "Workshops and learning sessions with instructors."),
    }),
    manualPdfUrl: "https://karibuassalam.com/wp-content/uploads/2024/11/School-Camps.pdf",
  },
  {
    slug: "nature-retreat",
    title: "Nature Retreat",
    priceFrom: 900,
    durationDays: 7,
    shortPromise:
      "A 7-day nature retreat focused on permaculture, sustainability, and eco-village living.",
    heroImage: natureRetreatImg,
    inclusions: COMMON_INCLUSIONS,
    highlights: ["Permaculture", "Sustainability"],
    itineraryDays: [
      day(1, "Arrival and eco-village introduction", "Airport transfer and orientation at Assalam Ecolodge."),
      day(2, "Permaculture introduction", "Guided sessions introducing permaculture practices."),
      day(3, "Sustainability workshops", "Workshops focused on sustainability and community benefit."),
      day(4, "Nature-based guided activities", "Guided activities linked to the natural environment."),
      day(5, "Permaculture practice", "Practical permaculture-focused sessions and seminars."),
      day(6, "Community learning wrap-up", "Shared learning and sustainability reflections."),
      day(7, "Closing and departure", "Closing session and airport transportation."),
    ],
    manualPdfUrl: null,
  },
];

export function getRetreatBySlug(slug) {
  return retreats.find((retreat) => retreat.slug === slug);
}
