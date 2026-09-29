// src\data\i18n.js
import { phraseTranslations } from "./phraseTranslations.js";
import { languageNeutral } from "./languageNeutral.js";

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", shortLabel: "EN" },
  { code: "tr", label: "Türkçe", shortLabel: "TR" },
  { code: "de", label: "Deutsch", shortLabel: "DE" },
];

export const uiMessages = {
  en: {
    nav: {
      home: "Home",
      about: "About Us",
      retreats: "Retreats",
      experiences: "Experiences",
      faq: "FAQ",
      contact: "Contact",
      ecoVillage: "Eco-Resort",
      campus: "Campus",
      accommodations: "Accommodation",
      restaurant: "Restaurant",
      bookNow: "Book Now",
      menu: "Menu",
      language: "Language",
    },
    common: {
      exploreRetreats: "Explore Retreats",
      contactBooking: "Contact Booking Team",
      whatsApp: "Send via WhatsApp",
      email: "Send via Email",
      learnMore: "Learn more",
      viewDetails: "View details",
    },
  },
  tr: {
    nav: {
      home: "Ana Sayfa",
      about: "Hakkımızda",
      retreats: "Kamplar",
      experiences: "Deneyimler",
      faq: "SSS",
      contact: "İletişim",
      ecoVillage: "Eko-Köy",
      campus: "Kampüs",
      accommodations: "Konaklama",
      restaurant: "Restoran",
      bookNow: "Rezervasyon",
      menu: "Menü",
      language: "Dil",
    },
    common: {
      exploreRetreats: "Kampları Keşfet",
      contactBooking: "Rezervasyon Ekibiyle İletişim",
      whatsApp: "WhatsApp ile gönder",
      email: "E-posta ile gönder",
      learnMore: "Daha fazla",
      viewDetails: "İncele",
    },
  },
  de: {
    nav: {
      home: "Startseite",
      about: "Über uns",
      retreats: "Retreats",
      experiences: "Erlebnisse",
      faq: "FAQ",
      contact: "Kontakt",
      ecoVillage: "Öko-Dorf",
      campus: "Campus",
      accommodations: "Unterkunft",
      restaurant: "Restaurant",
      bookNow: "Jetzt buchen",
      menu: "Menü",
      language: "Sprache",
    },
    common: {
      exploreRetreats: "Retreats entdecken",
      contactBooking: "Buchungsteam kontaktieren",
      whatsApp: "Per WhatsApp senden",
      email: "Per E-Mail senden",
      learnMore: "Mehr erfahren",
      viewDetails: "Details ansehen",
    },
  },
};

function collectUiTextPairs(baseNode, targetNode, map) {
  if (typeof baseNode === "string" && typeof targetNode === "string") {
    map[baseNode] = targetNode;
    return;
  }

  if (!baseNode || typeof baseNode !== "object" || !targetNode || typeof targetNode !== "object") {
    return;
  }

  for (const key of Object.keys(baseNode)) {
    collectUiTextPairs(baseNode[key], targetNode[key], map);
  }
}

function buildUiTextLookup(language) {
  const map = {};
  collectUiTextPairs(uiMessages.en, uiMessages[language] ?? uiMessages.en, map);
  return map;
}

const uiTextLookups = {
  en: buildUiTextLookup("en"),
  tr: buildUiTextLookup("tr"),
  de: buildUiTextLookup("de"),
};

// In development, surface any string that reaches the UI without a translation
// instead of silently falling back to English.
const reportedMisses = new Set();
const translatedValues = Object.fromEntries(['tr', 'de'].map(language => [
  language, new Set([...Object.values(phraseTranslations[language]), ...Object.values(uiTextLookups[language])]),
]));
const translatedTemplates = Object.fromEntries(['tr', 'de'].map(language => [
  language, [...translatedValues[language]].filter(value => /\{\w+\}/.test(value)).map(value =>
    new RegExp('^' + value.split(/(\{\w+\})/).map(part => /^\{\w+\}$/.test(part)
      ? '.+?' : part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('') + '$')
  ),
]));

function reportMissing(language, text) {
  if (!import.meta.env?.DEV || language === "en") return;
  const key = `${language}::${text}`;
  if (reportedMisses.has(key)) return;
  reportedMisses.add(key);
  console.warn(`[i18n] missing ${language.toUpperCase()} translation: ${JSON.stringify(text)}`);
}

export function translateText(language, text, values = {}) {
  if (typeof text !== "string" || !text) return text;
  const lang = uiMessages[language] ? language : "en";

  const hit = phraseTranslations[lang]?.[text] ?? uiTextLookups[lang]?.[text];
  const interpolate = (value) => value.replace(/\{(\w+)\}/g, (match, key) => values[key] ?? match);
  if (hit !== undefined) return interpolate(hit);

  // Shared components also accept copy already translated by their caller.
  if (lang === 'en' || translatedValues[lang]?.has(text) || languageNeutral.has(text)
    || !/[A-Za-z]/.test(text) || translatedTemplates[lang]?.some(pattern => pattern.test(text))) return interpolate(text);

  // Page-specific metadata combines a translated title with the brand name.
  if (text.includes(' | ')) return text.split(' | ').map(part => translateText(lang, part, values)).join(' | ');

  reportMissing(lang, text);
  return interpolate(text);
}
