// Translations of the 2026 content and shared interface copy.
import { ui2026 } from './ui2026.js';
import { experiences2026 } from './experiences2026.js';
import { retreats2026 } from './retreats2026.js';
import { campusUpdates2026 } from './campusUpdates2026.js';
import { hospitalityUpdates2026 } from './hospitalityUpdates2026.js';
import { bookingProgramme2026 } from './bookingProgramme2026.js';
import { volunteering2026 } from './volunteering2026.js';
import { reviews2026 } from './reviews2026.js';
import { gallery2026 } from './gallery2026.js';
export const contentRows = [...ui2026, ...experiences2026, ...retreats2026, ...campusUpdates2026, ...hospitalityUpdates2026, ...bookingProgramme2026, ...volunteering2026, ...reviews2026, ...gallery2026];
export const siteTranslations = {
  tr: Object.fromEntries(contentRows.map(([en, tr]) => [en, tr])),
  de: Object.fromEntries(contentRows.map(([en, , de]) => [en, de])),
};
