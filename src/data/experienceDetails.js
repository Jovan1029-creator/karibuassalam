import campusImg from "../../pics/site-marketing/campus-coast-aerial.webp";
import soapWorkshopImg from "../../pics/site-marketing/hamammni-soap-workshop.webp";
import drummingWorkshopImg from "../../pics/site-marketing/ngoma-drumming-workshop.webp";
import drumMakingImg from "../../pics/site-marketing/ngoma-drum-making.webp";
import soapMakingImg from "../../pics/site-marketing/hamammni-soap-making-closeup.webp";
import kitchenImg from "../../pics/site-marketing/swahili-kitchen.webp";
import mealImg from "../../pics/site-marketing/fresh-shared-meal.webp";
import spaImg from "../../pics/site-marketing/spa-ocean-pool.webp";
import caveImg from "../../pics/site-marketing/campus-cave.webp";
// Match the photographs to their subjects, not the legacy filenames.
import coastImg from "../../pics/zanzibarpics/Blue Safari.jpg";
import spiceImg from "../../pics/aboutpic/Spice Gardens.webp";
import townImg from "../../pics/zanzibarpics/Stonetown Historical Site.webp";
import villageImg from "../../pics/site-marketing/ramadan-community-evening.webp";
import seaImg from "../../pics/zanzibarpics/East Coast Tour.jpg";
import { campusVisitPhoto } from "./campusPhotos";

// The brief leaves most prices as $XX. Those are confirmed by the team on enquiry.
const tourLanguages = "English, Turkish and Swahili; German and Italian on request";
const workshopLanguages = tourLanguages;
const campusDayOptions = [
  "add a lunch",
  "add a cooking lesson on campus or in the kanga village",
  "extend the day with our Eco-print workshop or a private spa experience",
];
const campusDressGuidance = "Please wear clothing that covers shoulders and knees on site.";

export const experienceDetails = [
  {
    type: "tours",
    slug: "campus-village-tour",
    title: "Karibu Assalam Tour",
    intro: "Visit our eco village in Kizimkazi, take a tour of our campus by the beach and join a workshop",
    image: campusImg,
    detailPhoto: { src: caveImg, alt: "Walkway over the natural cave at Assalam Eco-Village" },
    duration: "Half day",
    days: "Runs daily",
    start: "10:00 am",
    price: "$40 per person",
    included: [
      "a visit Kanga Village in Kizimkazi",
      "a tour of the eco-village campus, incl school, permaculture gardens",
      "coffee/tea and snacks on the jetty",
      "learn how to play ‘ngoma’, the local drum",
      "make your own hamamni soap",
    ],
    options: campusDayOptions,
    optionsPhoto: campusVisitPhoto,
    bring: campusDressGuidance,
    languages: tourLanguages,
  },
  {
    type: "tours",
    slug: "east-coast-tour",
    title: "South East Coast",
    intro: "Explore Zanzibar's east coast, from Mtende Beach to The Rock in Michamvi and Paje Beach.",
    image: coastImg,
    duration: "Half day",
    days: "Any day, subject to availability",
    start: "9:00 am",
    included: ["Mtende Beach", "The Rock in Michamvi", "Paje Beach"],
    options: ["Add a visit to Maalum Cave"],
    bring: "Please wear clothing that covers shoulders and knees on site.",
    languages: tourLanguages,
  },
  {
    type: "tours",
    slug: "spice-tour",
    title: "City & Spice",
    intro: "Explore Zanzibar's cultural heritage on a full day tour with a visit of spice gardens and a guided tour of the old town's maze of alleys.",
    image: spiceImg,
    detailPhoto: { src: townImg, alt: "Historic Stone Town in Zanzibar" },
    duration: "Full day",
    days: "Any day, subject to availability",
    start: "9:00 am",
    included: ["Guided spice farm tour", "Guided tour of the historic city centre"],
    options: ["Add lunch on the farm"],
    bring: "Curiosity and comfortable shoes.",
    languages: tourLanguages,
  },
  {
    type: "tours",
    slug: "kizimkazi-village-tour",
    title: "Kizimkazi Village Tour",
    intro: "Take a village tour with our team to connect with the community, learn about local life and visit Salaam Cave.",
    image: villageImg,
    imageAlt: "Community gathering during Ramadan at Assalam Kanga Village",
    detailPhoto: { src: villageImg, alt: "Community gathering during Ramadan at Assalam Kanga Village" },
    duration: "Ask the team",
    days: "Arranged on request",
    start: "Ask the team",
    included: ["Guided village visit", "Discover local life in Kizimkazi", "Visit Salaam Cave"],
    options: ["add a lunch", "Combine with another workshop"],
    optionsPhoto: campusVisitPhoto,
    bring: campusDressGuidance,
    languages: tourLanguages,
  },
  {
    type: "tours",
    slug: "blue-safari",
    title: "Sandbank & Snorkeling",
    intro: "Spend a day on the water swimming, snorkelling and enjoying Zanzibar's sandbanks.",
    image: seaImg,
    duration: "Full day",
    days: "Any day, subject to availability",
    start: "9:00 am",
    included: ["Boat trip", "Snorkelling gear", "Snacks and lunch"],
    options: ["Ask about a traditional dhow boat"],
    bring: "Swimwear and sunscreen.",
    languages: tourLanguages,
  },
  {
    type: "workshops",
    slug: "soap-making",
    title: "Hamamni soap workshop",
    intro: "Make your own soap with the women's cooperative, using coconut oil and local botanicals. Take your bars home with you.",
    image: soapWorkshopImg,
    detailPhoto: { src: soapMakingImg, alt: "Handmade soaps being prepared in the Hamamni workshop" },
    duration: "2–3 hours",
    days: "Any day",
    start: "Morning or afternoon",
    price: "$40 per person",
    included: ["Guided workshop", "Your own soap to take home"],
    options: campusDayOptions,
    optionsPhoto: campusVisitPhoto,
    bring: campusDressGuidance,
    languages: workshopLanguages,
  },
  {
    type: "workshops",
    slug: "drumming",
    title: "Ngoma drum workshop",
    intro: "Learn Swahili coastal rhythms with local musicians. No experience is needed.",
    image: drummingWorkshopImg,
    detailPhoto: { src: drumMakingImg, alt: "Workshop participants painting their handmade drums" },
    duration: "2–3 hours",
    days: "Any day, subject to availability",
    start: "Morning or afternoon",
    included: ["Guided workshop", "Your own drum to take home"],
    options: campusDayOptions,
    optionsPhoto: { src: mealImg, alt: "A freshly prepared meal served in the eco-village kitchen", width: 1600, height: 902 },
    bring: campusDressGuidance,
    languages: workshopLanguages,
  },
  {
    type: "workshops",
    slug: "eco-print",
    title: "Eco-print workshop",
    intro: "Create a design on fabric using leaves, flowers and bark gathered on campus, with natural dyes and no synthetic chemicals.",
    // Show the workshop's campus setting until a dedicated Eco-print photo is supplied.
    detailPhoto: campusVisitPhoto,
    duration: "2–3 hours",
    days: "Any day, subject to availability",
    start: "Morning or afternoon",
    included: ["Guided workshop", "Your printed fabric to take home"],
    options: [
      "add a lunch",
      "add a cooking lesson on campus or in the kanga village",
      "extend the day with a private spa experience",
    ],
    optionsPhoto: { src: spaImg, alt: "Private pool and sun loungers at Karibu Assalam", width: 1600, height: 1066 },
    bring: campusDressGuidance,
    languages: workshopLanguages,
  },
  {
    type: "workshops",
    slug: "cooking",
    title: "Swahili cooking class",
    image: kitchenImg,
    detailPhoto: { src: mealImg, alt: "A freshly prepared meal served in the eco-village kitchen" },
    intro: "Cook Zanzibari dishes with the kitchen team, using spices from the garden and recipes from the neighbourhood.",
    duration: "2–3 hours",
    days: "Any day, subject to availability",
    start: "Morning or afternoon",
    included: ["Guided cooking class", "The dish you make for lunch"],
    // Cooking and lunch are already included, so offer only additional experiences.
    options: ["Combine with another workshop", "extend the day with a private spa experience"],
    optionsPhoto: campusVisitPhoto,
    bring: campusDressGuidance,
    languages: workshopLanguages,
  },
];

export function getExperienceDetail(type, slug) {
  return experienceDetails.find((item) => item.type === type && item.slug === slug);
}
