import campusImg from "../../pics/site-marketing/campus-coast-aerial.webp";
import soapWorkshopImg from "../../pics/site-marketing/hamammni-soap-workshop.webp";
import drummingWorkshopImg from "../../pics/site-marketing/ngoma-drumming-workshop.webp";
import drumMakingImg from "../../pics/site-marketing/ngoma-drum-making.webp";
import soapMakingImg from "../../pics/site-marketing/hamammni-soap-making-closeup.webp";
import kitchenImg from "../../pics/site-marketing/swahili-kitchen.webp";
import mealImg from "../../pics/site-marketing/fresh-shared-meal.webp";
import caveImg from "../../pics/site-marketing/campus-cave.webp";
import coastImg from "../../pics/zanzibarpics/East Coast Tour.jpg";
import spiceImg from "../../pics/aboutpic/Spice Gardens.webp";
import townImg from "../../pics/zanzibarpics/Stonetown Historical Site.webp";
import seaImg from "../../pics/zanzibarpics/Blue Safari.jpg";

// The brief leaves most prices as $XX. Those are confirmed by the team on enquiry.
const tourLanguages = "English, Turkish and Swahili; German and Italian on request";
const workshopLanguages = tourLanguages;

export const experienceDetails = [
  {
    type: "tours",
    slug: "campus-village-tour",
    title: "Karibu Assalam Tour",
    intro: "Visit Assalam Kanga Village in Kizimkazi, then explore the school, permaculture gardens, cave and mosque at Karibu Assalam Eco-Village.",
    image: campusImg,
    detailPhoto: { src: caveImg, alt: "Walkway over the natural cave at Assalam Eco-Village" },
    duration: "6 hours",
    days: "Tuesday, Thursday and Saturday",
    start: "10:00 am",
    price: "$40 per person",
    included: ["Kanga Village visit", "Assalam Eco-Village and school tour", "Permaculture gardens, cave and mosque"],
    options: ["Add lunch with a sea view", "Ask about a musical performance in the cave", "Ask about a private afternoon in the ladies-only spa"],
    bring: "Please wear clothing that covers shoulders and knees on site.",
    languages: tourLanguages,
  },
  {
    type: "tours",
    slug: "east-coast-tour",
    title: "East Coast Tour",
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
    title: "Spice Tour",
    intro: "See and smell the plants behind Zanzibar's spice heritage on a guided visit to a spice farm.",
    image: spiceImg,
    duration: "Half day",
    days: "Any day, subject to availability",
    start: "9:00 am",
    included: ["Return transfer to the spice gardens", "Guided spice farm tour"],
    options: ["Add lunch on the farm"],
    bring: "Curiosity and comfortable shoes.",
    languages: tourLanguages,
  },
  {
    type: "tours",
    slug: "city-tour",
    title: "City Tour",
    intro: "Explore the historic centre of Stone Town with a guide and discover Zanzibar's layered heritage.",
    image: townImg,
    duration: "Half day",
    days: "Any day, subject to availability",
    start: "9:00 am",
    included: ["Return transfer to Stone Town", "Guided tour of the historic city centre"],
    options: ["Combine with the Spice Tour for a full day out"],
    bring: "Curiosity and comfortable walking shoes.",
    languages: tourLanguages,
  },
  {
    type: "tours",
    slug: "blue-safari",
    title: "Blue Safari",
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
    title: "Hamammni soap-making workshop",
    intro: "Make your own soap with the women's cooperative, using coconut oil and local botanicals. Take your bars home with you.",
    image: soapWorkshopImg,
    detailPhoto: { src: soapMakingImg, alt: "Handmade soaps being prepared in the Hamammni workshop" },
    duration: "2–3 hours",
    days: "Any day, subject to availability",
    start: "Morning or afternoon",
    included: ["Guided workshop", "Your own soap to take home"],
    options: ["Combine with another workshop", "Add lunch on site with a sea view"],
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
    options: ["Combine with another workshop", "Add lunch on site with a sea view"],
    languages: workshopLanguages,
  },
  {
    type: "workshops",
    slug: "eco-print",
    title: "Eco-print workshop",
    intro: "Create a design on fabric using leaves, flowers and bark gathered on campus, with natural dyes and no synthetic chemicals.",
    duration: "2–3 hours",
    days: "Any day, subject to availability",
    start: "Morning or afternoon",
    included: ["Guided workshop", "Your printed fabric to take home"],
    options: ["Combine with another workshop", "Add lunch on site with a sea view"],
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
    options: ["Combine with another workshop"],
    languages: workshopLanguages,
  },
];

export function getExperienceDetail(type, slug) {
  return experienceDetails.find((item) => item.type === type && item.slug === slug);
}
