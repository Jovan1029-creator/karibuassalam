// Static sweep: every literal tx("...") argument plus every string in the data
// files must exist in both dictionaries.
import fs from "node:fs";
import path from "node:path";

const PROJ = path.resolve(new URL("..", import.meta.url).pathname.replace(/^\/(\w:)/, "$1"));
const SRC = path.join(PROJ, "src");

const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(jsx|js)$/.test(e.name) && !p.includes("translations")) files.push(p);
  }
})(SRC);

const wanted = new Set();
const re = /tx\(\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\$]|\\.)*`)/g;
for (const f of files) {
  const s = fs.readFileSync(f, "utf8");
  for (const m of s.matchAll(re)) {
    const raw = m[1];
    if (raw.startsWith("`")) continue; // template literals are dynamic
    wanted.add(raw.slice(1, -1).replace(/\\"/g, '"').replace(/\\'/g, "'"));
  }
}

// Inline object arrays (moments, amenities, pillars, cards...) are rendered via
// tx(item.title) and friends, so their literals need translations too.
const KEYED = /\b(?:title|text|label|alt|promise|question|answer|shortPromise)\s*:\s*"([^"]{3,})"/g;
for (const f of files) {
  const s = fs.readFileSync(f, "utf8");
  for (const m of s.matchAll(KEYED)) {
    const v = m[1].replace(/\\"/g, '"');
    if (v.length > 2 && !/^[a-z-]+$/.test(v) && !/^https?:/.test(v)) wanted.add(v);
  }
}

// Strings from the data files all flow through tx() at render time.
for (const f of ["src/data/retreats.js", "src/data/faq.js", "src/data/bookingOptions.js"]) {
  const s = fs.readFileSync(path.join(PROJ, f), "utf8");
  for (const m of s.matchAll(/"((?:[^"\\]|\\.)*)"/g)) {
    const v = m[1].replace(/\\"/g, '"');
    if (v.length > 2 && !/^\.\.\//.test(v) && !/^https?:/.test(v) && !/^[a-z-]+$/.test(v)) {
      wanted.add(v);
    }
  }
}

const dicts = {};
for (const lang of ["tr", "de"]) {
  const text = fs.readFileSync(path.join(SRC, `data/translations/${lang}.js`), "utf8");
  const keys = new Set();
  // quoted keys
  for (const m of text.matchAll(/^\s{2}"((?:[^"\\]|\\.)*)":/gm)) keys.add(m[1].replace(/\\"/g, '"'));
  // bare identifier keys
  for (const m of text.matchAll(/^\s{2}([A-Za-z_$][\w$]*):/gm)) keys.add(m[1]);
  dicts[lang] = keys;
}

// UI message keys are handled by the separate uiMessages lookup.
const uiText = fs.readFileSync(path.join(SRC, "data/i18n.js"), "utf8");
const uiKeys = new Set([...uiText.matchAll(/:\s*"([^"]+)"/g)].map((m) => m[1]));

let bad = 0;
for (const lang of ["tr", "de"]) {
  const missing = [...wanted].filter((k) => !dicts[lang].has(k) && !uiKeys.has(k)).sort();
  console.log(`\n${lang.toUpperCase()} missing: ${missing.length}`);
  missing.forEach((k) => console.log("   " + JSON.stringify(k)));
  bad += missing.length;
}

// Keys present in one dictionary but not the other.
const onlyTr = [...dicts.tr].filter((k) => !dicts.de.has(k));
const onlyDe = [...dicts.de].filter((k) => !dicts.tr.has(k));
if (onlyTr.length) console.log("\nonly in tr:", onlyTr);
if (onlyDe.length) console.log("only in de:", onlyDe);

console.log(`\nchecked ${wanted.size} strings; ${bad} gaps`);
process.exit(bad ? 1 : 0);
