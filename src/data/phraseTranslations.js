// src\data\phraseTranslations.js
// Aggregates the per-language dictionaries. English is the source language, so
// its dictionary stays empty and tx() falls through to the key itself.
import { tr } from "./translations/tr";
import { de } from "./translations/de";

export const phraseTranslations = {
  en: {},
  tr,
  de,
};
