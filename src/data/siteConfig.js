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
};

export const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Retreats", to: "/retreats" },
  { label: "Zanzibar", to: "/zanzibar" },
  { label: "FAQ", to: "/faq" },
  { label: "Contact", to: "/contact" },
];

export const ECO_VILLAGE_LINKS = [
  { label: "Campus", to: "/campus" },
  { label: "Rooms", to: "/rooms" },
  { label: "Food", to: "/food" },
];
