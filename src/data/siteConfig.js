// src\data\siteConfig.js
import logoPng from "../../pics/logo/logo.png";

export const SITE = {
  brandName: "Karibu Assalam",
  nonprofitName: "Assalam Community Foundation",
  tagline: "A platform for volunteers and halal tourists.",
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
  { label: "Campus", to: "/campus" },
  { label: "Accommodations", to: "/accommodations" },
  { label: "Restaurant", to: "/restaurant" },
  { label: "Campers", to: "/campers" },
];

// Everything after the Eco-Village dropdown, before the Book Now button.
export const NAV_LINKS_TAIL = [
  { label: "FAQ", to: "/faq" },
  { label: "Contact", to: "/contact" },
];
