import { collectCatalog } from './i18n-catalog.mjs';
import { phraseTranslations } from '../src/data/phraseTranslations.js';
import { uiMessages } from '../src/data/i18n.js';
import { languageNeutral } from '../src/data/languageNeutral.js';
import { contentRows } from '../src/data/translations/siteContent.js';
import assert from 'node:assert/strict';

// Only genuine names, codes and language-neutral units may remain unchanged.
export const unchanged = languageNeutral;
const seenRows = new Map();
for (const row of contentRows) {
  assert.equal(row.length, 3, 'Each phrase needs English, Turkish and German.');
  assert.ok(row.every(value => typeof value === 'string' && value.trim()), `Empty translation: ${row[0]}`);
  if (seenRows.has(row[0])) assert.deepEqual(row, seenRows.get(row[0]), `Conflicting translations: ${row[0]}`);
  seenRows.set(row[0], row);
  const slots = value => [...value.matchAll(/\{(\w+)\}/g)].map(match => match[1]).sort();
  for (const localized of row.slice(1)) assert.deepEqual(slots(localized), slots(row[0]), `Missing interpolation value: ${row[0]}`);
}
function uiPairs(base, localized, result={}) {
  for (const [key,value] of Object.entries(base)) {
    if (typeof value === 'string') result[value] = localized[key];
    else uiPairs(value, localized[key], result);
  }
  return result;
}
const { wanted } = collectCatalog();
let gaps = 0;
for (const lang of ['tr','de']) {
  const dict = {...uiPairs(uiMessages.en, uiMessages[lang]), ...phraseTranslations[lang]};
  const missing = [...wanted].filter(([text]) => !unchanged.has(text) && (!dict[text] || dict[text] === text));
  console.log(`\n${lang.toUpperCase()} untranslated: ${missing.length}`);
  for (const [text,file] of missing) console.log(JSON.stringify(text) + '  [' + file + ']');
  gaps += missing.length;
}
console.log(`\nChecked ${wanted.size} visible strings; ${gaps} gaps`);
process.exitCode = gaps ? 1 : 0;
