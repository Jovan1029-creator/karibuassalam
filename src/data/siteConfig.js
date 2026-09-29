// src\data\siteConfig.js
import logoPng from "../../pics/logo/logo.png";

export const SITE = {
  brandName: "Karibu Assalam",
  nonprofitName: "Assalam Community Foundation",
  tagline: "Hospitality + community + sustainability + culture + purpose",
  phoneDisplay: "+255 771 000 800",
  phoneTel: "+255771000800",
  whatsAppPhone: "255771000800",
  email: "camps@vassalam.org",
  instagramUrl: "https://www.instagram.com/karibu.assalam",
  instagramHandle: "@karibu.assalam",
  logoSrc: logoPng,

  // Partner projects and outside profiles.
  sufiFestivalUrl: "https://zanzibarsufifest.com",
  sawaEnsembleUrl: "https://www.instagram.com/sawa.ensemble",
  sawaEnsembleHandle: "@sawa.ensemble",
  foundationUrl: "https://vassalam.org",

  // The resort has no verified listing yet. Do not reuse the Stone Town cafe's
  // rating here: it belongs to a separate venue.
  tripAdvisorUrl: "",
};

// Manually verified listing snapshot, not a live Tripadvisor feed.
// Refresh rating, reviewCount and checkedAt together after checking the source.
export const SPICE_ROUTE_CAFE = {
  name: "The Spice Route Cafe",
  tripAdvisorUrl: "https://www.tripadvisor.com/Restaurant_Review-g8055401-d13625574-Reviews-The_Spice_Route_Cafe-Zanzibar_City_Zanzibar_Island_Zanzibar_Archipelago.html",
  rating: 4.8,
  reviewCount: 33,
  checkedAt: "2026-09-29",
};

export const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Retreats", to: "/retreats" },
  { label: "Experiences", to: "/experiences" },
];

export const ECO_VILLAGE_LINKS = [
  { name: "Eco-Resort Overview", to: "/eco-resort" },
  { label: "Campus", to: "/campus" },
  { label: "Accommodations", to: "/accommodations" },
  { label: "Restaurant", to: "/restaurant" },
  { name: "Kanga Africa", to: "/eco-resort#kanga-africa" },
  { name: "Hamammni", to: "/eco-resort#hamammni" },
  { name: "Arts & Culture Centre", to: "/eco-resort#arts-culture" },
];

export const RETREAT_LINKS = [
  { name: "All Retreats & Camps", to: "/retreats" },
  { name: "Kindness Camp", to: "/retreats/kindness-camp" },
  { name: "Ramadan Camp", to: "/retreats/ramadan-camp" },
  { name: "Family Camp", to: "/retreats/family-tour" },
  { name: "The Cultural Heritage Retreat", to: "/retreats/cultural-heritage-tour" },
  { name: "School Camp", to: "/retreats/school-camp" },
  { name: "The Nature Retreat", to: "/retreats/nature-retreat" },
];

export const EXPERIENCE_LINKS = [
  { name: "All Experiences", to: "/experiences" },
  { name: "Campus & Village Tour", to: "/experiences/tours/campus-village-tour" },
  { name: "Zanzibar Excursions", to: "/experiences#zanzibar-excursions" },
  { name: "Workshops", to: "/experiences#workshops" },
  { name: "Special Events", to: "/experiences/events" },
  { name: "Volunteer on Zanzibar", to: "/experiences/volunteer" },
  { name: "Safari", to: "/experiences/safari" },
];

// Everything after the Eco-Village dropdown, before the Book Now button.
export const NAV_LINKS_TAIL = [
  { label: "FAQ", to: "/faq" },
  { label: "Contact", to: "/contact" },
];
