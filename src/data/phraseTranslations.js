// src\data\phraseTranslations.js
// Aggregates the per-language dictionaries. English is the source language, so
// its dictionary stays empty and tx() falls through to the key itself.
import { tr } from "./translations/tr.js";
import { de } from "./translations/de.js";
import { siteTranslations } from "./translations/siteContent.js";
import { trEditorial2026 } from "./translations/trEditorial2026.js";

export const phraseTranslations = {
  en: {},
  tr: { ...tr, ...siteTranslations.tr, ...trEditorial2026 },
  de: { ...de, ...siteTranslations.de },
};
