// src\data\siteConfig.js
import logoPng from "../../pics/logo/logo.png";

export const SITE = {
  brandName: "Karibu Assalam",
  nonprofitName: "Assalam Community Foundation",
  tagline: "Hospitality + community + sustainability + culture + purpose",
  phoneDisplay: "+255-776-138-832",
  phoneTel: "+255776138832",
  whatsAppPhone: "255776138832",
  email: "camps@vassalam.org",
  instagramUrl: "https://www.instagram.com/karibu.assalam",
  instagramHandle: "@karibu.assalam",
  logoSrc: logoPng,

  // Partner projects and outside profiles.
  sufiFestivalUrl: "https://zanzibarsufifest.com",
  sawaEnsembleUrl: "https://www.instagram.com/sawa.ensemble",
  sawaEnsembleHandle: "@sawa.ensemble",
  foundationUrl: "https://vassalam.org",

  // Left empty until the real listing URL is supplied — the reviews link only
  // renders when this has a value, so the site never ships a dead link.
  tripAdvisorUrl: "",
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
  { label: "Campers", to: "/campers" },
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

// Everything after the Eco-Village dropdown, before the Book Now button.
export const NAV_LINKS_TAIL = [
  { label: "FAQ", to: "/faq" },
  { label: "Contact", to: "/contact" },
];
