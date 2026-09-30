import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { createServer } from 'vite';
import { translateText } from '../src/data/i18n.js';

// Render actual React routes, including lazy pages, without sending requests.
process.env.VITE_SUPABASE_URL = 'http://127.0.0.1:9';
process.env.VITE_SUPABASE_ANON_KEY = 'local-i18n-test-key';
const originalFetch = globalThis.fetch;
globalThis.fetch = () => { throw new Error('Network calls are forbidden in translation tests'); };
const originalWarn = console.warn;
const originalError = console.error;
const misses = new Set();
console.warn = (...args) => {
  if (String(args[0]).includes('[i18n]')) misses.add(String(args[0]));
  else originalWarn(...args);
};
console.error = (...args) => {
  // React Router uses layout effects for client navigation; this test is SSR only.
  if (!String(args[0]).includes('useLayoutEffect does nothing on the server')) originalError(...args);
};
const server = await createServer({ mode: 'test', logLevel: 'silent', server: { middlewareMode: true }, appType: 'custom' });
const decode = text => text.replace(/&#(x[0-9a-f]+|\d+);/gi, (_, code) => String.fromCodePoint(code[0].toLowerCase() === 'x' ? parseInt(code.slice(1), 16) : Number(code)))
  .replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&#x27;', "'");
function visibleStrings(html) {
  const values = [
    ...[...html.matchAll(/>([^<>]+)</g)].map(match => match[1]),
    ...[...html.matchAll(/\b(?:alt|title|placeholder|aria-label|aria-roledescription)="([^"]+)"/g)].map(match => match[1]),
  ];
  return new Set(values.map(decode).map(value => value.replace(/\s+/g, ' ').trim()).filter(Boolean));
}
try {
  const { routes, renderPage } = await server.ssrLoadModule('/scripts/i18n-render-fixture.jsx');
  const { SITE, SPICE_ROUTE_CAFE, ECO_VILLAGE_LINKS } = await server.ssrLoadModule('/src/data/siteConfig.js');
  const { safariHeroPhoto, safariOverviewPhoto, safariPlanningPhoto, safariGalleryPhotos } = await server.ssrLoadModule('/src/data/safariPhotos.js');
  const { campusTour } = await server.ssrLoadModule('/src/data/experiences.js');
  const { getExperienceDetail } = await server.ssrLoadModule('/src/data/experienceDetails.js');
  const campusDetail = getExperienceDetail('tours', 'campus-village-tour');
  assert.equal(campusDetail.description, campusTour.text, 'One shared description for the campus tour');
  assert.equal(campusDetail.duration, 'Half day');
  assert.equal(campusDetail.days, 'Runs daily');
  assert.equal(campusDetail.price, '$40 per person', 'Keep the existing paid price; do not invent a new price');
  assert.deepEqual(campusTour.facts, ['Permaculture', 'Snacks', 'Workshop']);
  const safariPhotos = [safariHeroPhoto, safariPlanningPhoto, ...safariGalleryPhotos];
  assert.ok(safariOverviewPhoto.src.endsWith('/zebra-monochrome.jpeg'), 'Overview uses the requested black-and-white zebra');
  assert.ok(safariHeroPhoto.src.endsWith('/zebras-woodland.jpeg'), 'Keep the existing landscape safari hero');
  assert.equal(new Set(safariPhotos.map(photo => photo.src)).size, 5, 'Use all five distinct supplied safari photographs');
  for (const photo of safariPhotos) {
    assert.match(photo.src, /^\/pics\/safari\/[a-z-]+\.(jpeg|png)$/);
    assert.ok(statSync(new URL(`..${photo.src}`, import.meta.url)).size > 0, 'Safari images must exist on disk');
  }
  function checkSafariPhotos(markup, route, language) {
    if (!['/experiences', '/experiences/safari', '/experiences/tours/blue-safari'].includes(route)) return;
    const images = [...markup.matchAll(/<img\b[^>]*>/g)].map(match => match[0]);
    if (route === '/experiences/tours/blue-safari') {
      assert.ok(!images.some(tag => tag.includes('/pics/safari/')), 'Keep mainland safari photographs out of Blue Safari');
      return;
    }
    const expected = route === '/experiences' ? [safariOverviewPhoto] : safariPhotos;
    const visible = visibleStrings(markup);
    for (const photo of expected) {
      const tag = images.find(image => image.includes(`src="${photo.src}"`));
      assert.ok(tag, `${route}: render ${photo.src}`);
      assert.ok(visible.has(translateText(language, photo.alt)), `${route}: localize safari alt text (${language})`);
      if (route === '/experiences' || photo !== safariHeroPhoto) {
        assert.ok(tag.includes('loading="lazy"'), 'Load below-the-fold safari images lazily');
        assert.ok(tag.includes(`width="${photo.width}"`) && tag.includes(`height="${photo.height}"`), 'Preserve original photo dimensions');
      }
    }
    if (route === '/experiences') {
      const safariSection = markup.match(/<section id="safari"[\s\S]*?<\/section>/)?.[0];
      assert.ok(safariSection?.includes(safariOverviewPhoto.src), 'Replace the mainland safari overview placeholder');
      assert.ok(!safariSection.includes('photo-slot'), 'No mainland safari placeholder remains');
      assert.ok(images.some(tag => decodeURIComponent(tag.match(/src="([^"]+)"/)?.[1] || '').includes('Blue Safari.jpg')), 'Preserve the existing Blue Safari ocean image');
    } else {
      assert.ok(!markup.includes('photo-slot'), 'The dedicated safari page uses real photos throughout');
      assert.equal((markup.match(/class="safari-gallery-item"/g) || []).length, 3, 'Keep the three-portrait gallery');
      for (const photo of safariGalleryPhotos) assert.ok(visible.has(translateText(language, photo.label)), 'Localize every gallery caption');
      assert.ok(visible.has(translateText(language, 'Moments on safari')), 'Localize the gallery heading');
      const exploreMore = markup.match(/<section id="explore-more"[\s\S]*?<\/section>/)?.[0];
      assert.ok(exploreMore?.includes('permaculture-campus-tour.webp'), 'Explore more includes a relevant campus photograph');
      assert.ok(exploreMore.includes('href="/experiences"') && exploreMore.includes('href="/contact"'), 'Explore more has working discovery and contact links');
      assert.ok(visibleStrings(exploreMore).has(translateText(language, 'Make time for more of Zanzibar before or after your safari. Visit our Kizimkazi campus, meet the community and explore the island through hands-on workshops and guided excursions.')), 'Translate the new Explore more copy');
    }
  }
  function checkCampusTour(markup, route, language) {
    if (!['/experiences', '/experiences/tours/campus-village-tour'].includes(route)) return;
    const visible = visibleStrings(markup);
    assert.ok(visible.has(translateText(language, campusTour.text)), 'Preserve the supplied tour description in all languages');
    for (const oldPhrase of ['Daily campus tour', 'A free guided walk through the eco-village, every day.', 'Free for guests', 'About 45 minutes', 'Karibu Assalam Tour: campus & village']) {
      assert.ok(!visible.has(translateText(language, oldPhrase)), `Remove the duplicate/free tour claim: ${oldPhrase}`);
    }
    if (route === '/experiences') {
      assert.ok(visible.has(translateText(language, 'Visit our campus')));
      assert.ok(visible.has(translateText(language, 'Daily Karibu Assalam Tour')));
      assert.ok(!markup.includes('campus-tour-detail'), 'Do not display a second campus tour card');
      const copy = markup.match(/<div class="campus-tour-copy">([\s\S]*?)<\/div>\s*<\/div>/)?.[1];
      assert.ok(copy, 'Campus tour has a single overview');
      for (const [label, href] of [['More details', '/experiences/tours/campus-village-tour'], ['Book your tour', '/contact']]) {
        const anchor = [...copy.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].find(match => decode(match[2]) === translateText(language, label));
        assert.ok(anchor?.[1].includes(`href="${href}"`), `${label} leads to ${href}`);
      }
      for (const fact of campusTour.facts) assert.ok(visible.has(translateText(language, fact)));
    } else {
      for (const fact of [campusDetail.days, campusDetail.duration, campusDetail.price, ...campusDetail.included]) {
        assert.ok(visible.has(translateText(language, fact)), `Tour detail includes ${fact}`);
      }
    }
  }
  const typography = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');
  const documentHead = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.doesNotMatch(typography + documentHead, /Caveat|El Messiri|El\+Messiri|var\(--script\)|var\(--arabic-display\)/, 'Use only Peace Villages font families');
  assert.match(typography, /--font-body: Inter/);
  assert.match(typography, /--font-heading: "Cormorant Garamond"/);
  assert.match(typography, /h1,\s*h2,\s*h3\s*\{[^}]*font-family: var\(--font-heading\)/);
  assert.notEqual(SITE.tripAdvisorUrl, SPICE_ROUTE_CAFE.tripAdvisorUrl, 'Cafe reviews must not be attributed to the resort');
  assert.equal(ECO_VILLAGE_LINKS.at(-1).name, 'What’s happening?', 'The monthly programme is last in the Eco-Resort menu');
  assert.equal(ECO_VILLAGE_LINKS.at(-1).to, '/whats-happening');
  assert.equal(ECO_VILLAGE_LINKS.find(link => link.to === '/accommodations').label, 'Accommodation');
  function checkCampusProgramme(markup, route, language) {
    if (route !== '/whats-happening') return;
    const visible = visibleStrings(markup);
    for (const phrase of ['What is happening on campus this month?', 'October 2026', 'Programme coming soon', 'What is happening later?']) {
      assert.ok(visible.has(translateText(language, phrase)), `Campus programme missing: ${phrase} (${language})`);
    }
    assert.match(markup, /datetime="2026-10"/i, 'Keep the explicitly requested October edition');
    assert.ok(markup.indexOf('id="happenings-later-title"') > markup.indexOf('id="programme-month"'), 'Later heading follows the monthly programme');
    assert.ok(markup.includes('href="/contact"'), 'Programme enquiries have a working destination');
  }
  function checkCafeLinks(markup, route, language) {
    for (const [anchor] of markup.matchAll(/<a\b[^>]*>/g)) {
      const href = anchor.match(/href="([^"]*)"/)?.[1];
      if (href === SPICE_ROUTE_CAFE.tripAdvisorUrl || href === SITE.instagramUrl || href === '/restaurant#spice-route-cafe') {
        assert.ok(anchor.includes('target="_blank"'), `${route}: cafe and social links must open a new tab`);
        assert.ok(anchor.includes('rel="noopener noreferrer"'), `${route}: protect the originating tab`);
      }
    }
    const cards = [...markup.matchAll(/<article class="event-card">([\s\S]*?)<\/article>/g)].map(match => match[1]);
    if (route === '/experiences' || route === '/experiences/events') {
      assert.equal(cards.length, 4, 'Keep the four-card structure');
      assert.ok(decode(cards[2]).includes(translateText(language, 'Visit us in Stone Town')), 'Third card: Stone Town');
      assert.ok(cards[2].includes(SPICE_ROUTE_CAFE.tripAdvisorUrl), 'Cafe card links to its actual review listing');
      assert.ok(decode(cards[3]).includes(translateText(language, 'Follow Us')), 'Fourth card: Follow Us');
      assert.ok(cards[3].includes(SITE.instagramUrl), 'Follow Us links to Karibu Assalam Instagram');
      assert.ok(!cards[3].includes('href="/booking"'), 'Follow Us must not lead to a booking form');
    }
    if (['/experiences', '/experiences/events', '/restaurant'].includes(route)) {
      assert.ok(markup.includes('The Spice Route Cafe'), 'The rated venue must be identified');
      assert.ok(decode(markup).includes(translateText(language, '{count} Tripadvisor reviews', {count: 33})), 'Show the sourced review count');
    }
    if (route === '/restaurant') assert.ok(markup.includes('id="spice-route-cafe"'), 'Stone Town links have a real destination');
    if (route === '/') assert.ok(!markup.includes('class="cafe-rating'), 'Do not present cafe ratings as homepage resort ratings');
  }
  const leaked = [];
  for (const route of routes) {
    const englishMarkup = await renderPage(route, 'en');
    checkCafeLinks(englishMarkup, route, 'en');
    checkCampusProgramme(englishMarkup, route, 'en');
    checkSafariPhotos(englishMarkup, route, 'en');
    checkCampusTour(englishMarkup, route, 'en');
    const english = visibleStrings(englishMarkup);
    assert.ok(!english.has('Accommodations'), `${route}: use singular Accommodation throughout the visible site`);
    for (const language of ['tr', 'de']) {
      const markup = await renderPage(route, language);
      checkCafeLinks(markup, route, language);
      checkCampusProgramme(markup, route, language);
      checkSafariPhotos(markup, route, language);
      checkCampusTour(markup, route, language);
      const localized = visibleStrings(markup);
      if (route.startsWith('/contact')) {
        assert.ok(markup.includes(`!1s${language}!2stz`), 'The map embed should request the selected language');
      }
      for (const phrase of english) {
        if (translateText(language, phrase) !== phrase && localized.has(phrase)) leaked.push(`${language} ${route}: ${phrase}`);
      }
    }
  }
  assert.equal(leaked.length, 0, `Untranslated rendered copy:\n${leaked.join('\n')}`);
  assert.equal(misses.size, 0, `Missing runtime translations:\n${[...misses].join('\n')}`);
  assert.equal(translateText('tr', '{count} days', {count: 7}), '7 gün');
  assert.equal(translateText('de', '{count} days', {count: 7}), '7 Tage');
  assert.equal(translateText('en', '{count} days', {count: 7}), '7 days');
  assert.equal(translateText('de', 'Karibu Assalam'), 'Karibu Assalam');
  for (const language of ['tr', 'de']) {
    const localized = translateText(language, 'Book this experience');
    assert.equal(translateText(language, localized), localized, 'Shared components preserve already-translated text');
  }
  console.log(`Translation tests passed: ${routes.length} routes × 3 languages, visible text and accessibility labels, interpolation, brand preservation.`);
  console.log('Cafe checks passed: correct venue attribution, third/fourth cards, review count, section anchor and safe new-tab links.');
  console.log('Campus programme checks passed: menu position, singular Accommodation, October edition, pending state and later heading in all languages.');
  console.log('Safari checks passed: all five supplied photos, no mainland placeholders, localized captions/alt text, lazy loading and separate Blue Safari imagery.');
  console.log('Tour and typography checks passed: one paid daily half-day tour, supplied copy, correct CTAs, expanded Explore more and Peace Villages font roles.');
} finally {
  console.warn = originalWarn;
  console.error = originalError;
  globalThis.fetch = originalFetch;
  await server.close();
}
