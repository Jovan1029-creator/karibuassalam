// src\data\i18n.js
import { phraseTranslations } from "./phraseTranslations";

// src\data\i18n.js
export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", shortLabel: "EN" },
  { code: "tr", label: "Turkish", shortLabel: "TR" },
  { code: "de", label: "German", shortLabel: "DE" },
];

export const uiMessages = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      retreats: "Retreats",
      zanzibar: "Zanzibar",
      faq: "FAQ",
      contact: "Contact",
      ecoVillage: "Eco-Village",
      campus: "Campus",
      rooms: "Rooms",
      food: "Food",
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
      about: "Hakkında",
      retreats: "Kamplar",
      zanzibar: "Zanzibar",
      faq: "SSS",
      contact: "İletişim",
      ecoVillage: "Eko-Köy",
      campus: "Kampüs",
      rooms: "Odalar",
      food: "Yemek",
      bookNow: "Rezervasyon",
      menu: "Menü",
      language: "Dil",
    },
    common: {
      exploreRetreats: "Kampları Keşfet",
      contactBooking: "Rezervasyon İletişimi",
      whatsApp: "WhatsApp ile Gönder",
      email: "E-posta ile Gönder",
      learnMore: "Detaylar",
      viewDetails: "İncele",
    },
  },
  de: {
    nav: {
      home: "Startseite",
      about: "Über uns",
      retreats: "Retreats",
      zanzibar: "Sansibar",
      faq: "FAQ",
      contact: "Kontakt",
      ecoVillage: "Öko-Dorf",
      campus: "Campus",
      rooms: "Zimmer",
      food: "Essen",
      bookNow: "Jetzt buchen",
      menu: "Menü",
      language: "Sprache",
    },
    common: {
      exploreRetreats: "Retreats entdecken",
      contactBooking: "Buchung kontaktieren",
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

const contactTranslations = {
  en: {
    "Booking Request": "Booking Request",
    "Contact Request": "Contact Request",
    "General inquiry": "General inquiry",
    Hello: "Hello",
    Intent: "Intent",
    "Selected retreat": "Selected retreat",
    Name: "Name",
    Email: "Email",
    Phone: "Phone",
    "Message:": "Message:",
    "Please share availability and next steps.": "Please share availability and next steps.",
  },
  tr: {
    "Booking Request": "Rezervasyon Talebi",
    "Contact Request": "Iletisim Talebi",
    "General inquiry": "Genel soru",
    Hello: "Merhaba",
    Intent: "Konu",
    "Selected retreat": "Secilen kamp",
    Name: "Ad",
    Email: "E-posta",
    Phone: "Telefon",
    "Message:": "Mesaj:",
    "Please share availability and next steps.": "Lutfen uygunluk ve sonraki adimlari paylasin.",
  },
  de: {
    "Booking Request": "Buchungsanfrage",
    "Contact Request": "Kontaktanfrage",
    "General inquiry": "Allgemeine Anfrage",
    Hello: "Hallo",
    Intent: "Anliegen",
    "Selected retreat": "Ausgewaehltes Retreat",
    Name: "Name",
    Email: "E-Mail",
    Phone: "Telefon",
    "Message:": "Nachricht:",
    "Please share availability and next steps.":
      "Bitte teilen Sie Verfuegbarkeit und naechste Schritte mit.",
  },
};

export function translateText(language, text) {
  const lang = uiMessages[language] ? language : "en";
  return (
    phraseTranslations[lang]?.[text] ??
    contactTranslations[lang]?.[text] ??
    uiTextLookups[lang]?.[text] ??
    phraseTranslations.en?.[text] ??
    contactTranslations.en[text] ??
    uiTextLookups.en[text] ??
    text
  );
}
