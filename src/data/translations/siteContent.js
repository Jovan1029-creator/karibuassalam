// Translations of the 2026 content and shared interface copy.
import { ui2026 } from './ui2026.js';
import { experiences2026 } from './experiences2026.js';
import { retreats2026 } from './retreats2026.js';
import { campusUpdates2026 } from './campusUpdates2026.js';
export const contentRows = [...ui2026, ...experiences2026, ...retreats2026, ...campusUpdates2026];
export const siteTranslations = {
  tr: Object.fromEntries(contentRows.map(([en, tr]) => [en, tr])),
  de: Object.fromEntries(contentRows.map(([en, , de]) => [en, de])),
};
