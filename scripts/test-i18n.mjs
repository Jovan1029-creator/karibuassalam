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
  const { campusTour, safari } = await server.ssrLoadModule('/src/data/experiences.js');
  const { getExperienceDetail } = await server.ssrLoadModule('/src/data/experienceDetails.js');
  const campusDetail = getExperienceDetail('tours', 'campus-village-tour');
  const { getRetreatBySlug } = await server.ssrLoadModule('/src/data/retreats.js');
  const { campusVisitPhoto, campusCourtyardPhoto, schoolCampPhotos } = await server.ssrLoadModule('/src/data/campusPhotos.js');
  const school = getRetreatBySlug('school-camp');
  const campusPhotos = [campusVisitPhoto, campusCourtyardPhoto, ...schoolCampPhotos];
  assert.equal(new Set(campusPhotos.map(photo => photo.src)).size, 5, 'Use all five new campus photographs');
  for (const photo of campusPhotos) {
    assert.match(photo.src, /^\/pics\/new\/[a-z-]+\.jpeg$/, 'Keep descriptive names and original JPEG format');
    assert.ok(statSync(new URL(`..${photo.src}`, import.meta.url)).size > 0, 'Every campus image must exist');
  }
  assert.deepEqual(campusDetail.options, [
    'add a lunch',
    'add a cooking lesson on campus or in the kanga village',
    'extend the day with our Eco-print workshop or a private spa experience',
  ], 'Keep the three requested optional additions verbatim');
  assert.equal(school.durationDays, 7);
  assert.equal(school.priceFrom, 750, 'Keep the existing school camp price');
  assert.equal(school.details.includedItems.length, 8, 'Keep every supplied inclusion');
  assert.deepEqual(school.details.schedule.map(item => item.id), Array.from({length: 7}, (_, index) => `day-${index + 1}`));
  assert.equal(school.details.schedule[4].sections[0].heading, 'African Bracelet: Wear a Story', 'Keep both supplied Day 5 workshops');
  assert.match(school.details.schedule[4].copy, /eco print workshop/);
  assert.match(school.details.schedule[4].sections[0].copy, /ngoma/);
  function checkCampusUpdates(markup, route, language) {
    if (route === '/') {
      const cards = [...markup.matchAll(/<article class="stay-option">([\s\S]*?)<\/article>/g)].map(match => match[1]);
      assert.equal(cards.length, 6, 'Preserve all six homepage options');
      const actions = [
        ['Find your stay', '/eco-resort'], ['Find your retreat', '/retreats'],
        ['Find your tour', '/experiences/tours/campus-village-tour'], ['Book your spa', '/eco-resort#spa'],
        ['Apply here', '/contact'], ['Learn more', SITE.foundationUrl],
      ];
      cards.forEach((card, index) => {
        const anchor = card.match(/<a\b([^>]*)>([\s\S]*?)<\/a>/);
        assert.equal(decode(anchor?.[2] || ''), translateText(language, actions[index][0]), 'Remove View details and arrow from each homepage action');
        assert.ok(anchor[1].includes(`href="${actions[index][1]}"`), 'Preserve the card destination');
      });
      assert.ok(visibleStrings(cards[0]).has(translateText(language, 'Stay in our eco village right on Kizimkazi beach in accommodation with views of the Indian Ocean. Slow down by the sea, enjoy Swahili flavours and discover life on our community-led campus. Explore the permaculture gardens, join a hands-on workshop or make time to connect with the people and culture of Zanzibar.')), 'Card 01 has expanded, localized copy');
    }
    const expectedPhotos = route === '/retreats/school-camp'
      ? [campusCourtyardPhoto, ...schoolCampPhotos]
      : route === '/experiences/tours/campus-village-tour' ? [campusVisitPhoto] : [];
    const images = [...markup.matchAll(/<img\b[^>]*>/g)].map(match => match[0]);
    for (const photo of expectedPhotos) {
      const tag = images.find(image => image.includes(`src="${photo.src}"`));
      assert.ok(tag, `${route}: show ${photo.src}`);
      assert.ok(tag.includes('loading="lazy"'), 'New below-the-fold photos should load lazily');
      assert.ok(tag.includes(`width="${photo.width}"`) && tag.includes(`height="${photo.height}"`), 'Preserve source dimensions');
      assert.ok(visibleStrings(tag).has(translateText(language, photo.alt)), 'Translate new photo alt text');
    }
    if (route === '/experiences/tours/campus-village-tour') {
      const section = markup.match(/<section id="make-it-your-own"[\s\S]*?<\/section>/)?.[0];
      assert.ok(section?.includes('experience-customize-layout'), 'Use a scoped photo-and-list layout');
      const checklist = section.match(/<ul class="check-list experience-options">([\s\S]*?)<\/ul>/)?.[1];
      assert.ok(checklist, 'Use the same vertical check-list as the inclusions');
      assert.equal((checklist.match(/<li>/g) || []).length, 3);
      for (const option of campusDetail.options) assert.ok(visibleStrings(checklist).has(translateText(language, option)));
      assert.ok(section.includes(campusVisitPhoto.src), 'Keep the campus photo alongside the optional additions');
      for (const href of ['/contact', '/experiences#zanzibar-excursions']) assert.ok(section.includes(`href="${href}"`));
    }
    if (route === '/retreats/school-camp') {
      const visible = visibleStrings(markup);
      const expectedCopy = [school.details.intro, school.details.inclusionHeading, school.details.itineraryHeading,
        school.details.itineraryIntro, school.details.bookingCopy, school.details.bookingCta, ...school.details.includedItems,
        ...school.details.schedule.flatMap(item => [item.heading, item.copy, ...(item.sections || []).flatMap(part => [part.heading, part.copy].filter(Boolean))]),
        ...schoolCampPhotos.map(photo => photo.label)];
      for (const phrase of expectedCopy) {
        const translated = translateText(language, phrase);
        const actual = [...visible].find(value => value.startsWith(translated.slice(0, 25)));
        assert.ok(visible.has(translated), `School Camp includes ${phrase} (${language})\nExpected: ${translated}\nActual: ${actual}`);
      }
      assert.equal((markup.match(/class="accordion-item"/g) || []).length, 7, 'Seven itinerary days, without duplicate Day 5 panels');
      assert.match(markup, /id="day-1-button"[^>]*aria-expanded="true"/, 'Show the arrival day by default');
      assert.ok(markup.includes('href="/contact"'), 'School Camp booking leads to contact');
      assert.ok(!markup.includes('photo-slot'), 'Use supplied images instead of empty placeholders');
    }
  }
  assert.equal(campusDetail.intro, 'Visit our eco village in Kizimkazi, take a tour of our campus by the beach and join a workshop');
  assert.deepEqual(campusDetail.included, [
    'a visit Kanga Village in Kizimkazi',
    'a tour of the eco-village campus, incl school, permaculture gardens',
    'coffee/tea and snacks on the jetty',
    'learn how to play ‘ngoma’, the local drum',
    'make your own hamamni soap',
  ], 'Preserve the five requested tour inclusions');
  assert.deepEqual(safari.facts, ['Arranged on request', 'One day', 'Planned with the team']);
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
    assert.ok(visible.has(translateText(language, safari.text)), 'Show the one-day safari description on both safari surfaces');
    assert.ok(!visible.has(translateText(language, 'Multi-day')), 'Remove the old multi-day badge');
    assert.ok(!visible.has(translateText(language, 'Multi-day safari trips to the mainland parks can be arranged around your stay. Because routes, seasons and prices change, the team plans each one with you directly rather than selling a fixed package.')), 'Remove contradictory multi-day safari copy');
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
      assert.ok(visibleStrings(safariSection).has(translateText(language, 'One day')), 'Show the requested One day badge');
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
    const detailRoute = route.match(/^\/experiences\/(tours|workshops)\/([^/]+)$/);
    const bookingNote = 'Group and private options are available. Ask the team to confirm dates and the final price before booking.';
    if (detailRoute && detailRoute[2] !== 'campus-village-tour' && getExperienceDetail(detailRoute[1], detailRoute[2])) {
      const otherVisible = visibleStrings(markup);
      assert.ok(otherVisible.has(translateText(language, bookingNote)), 'Keep booking notes on other experience pages');
      assert.ok(otherVisible.has(translateText(language, 'Plan your experience')), 'Only remove the marked heading on the campus tour page');
    }
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
      assert.ok(visible.has(translateText(language, campusDetail.intro)), 'Use the new tour introduction');
      assert.ok(!visible.has(translateText(language, 'Plan your experience')), 'Remove the crossed-out planning heading');
      assert.ok(!visible.has(translateText(language, bookingNote)), 'Remove the crossed-out group/private booking paragraph');
      const hero = markup.match(/<section class="hero [\s\S]*?<\/section>/)?.[0];
      assert.ok(hero && visibleStrings(hero).has(translateText(language, 'Book this experience')), 'Hero offers booking, not an enquiry label');
      assert.ok(hero.includes('href="/contact"'), 'Tour booking still leads to Contact');
      assert.ok(!visible.has(translateText(language, 'Tuesday, Thursday and Saturday')), 'Do not restore the crossed-out old schedule');
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
    checkCampusUpdates(englishMarkup, route, 'en');
    const english = visibleStrings(englishMarkup);
    assert.ok(!english.has('Accommodations'), `${route}: use singular Accommodation throughout the visible site`);
    for (const language of ['tr', 'de']) {
      const markup = await renderPage(route, language);
      checkCafeLinks(markup, route, language);
      checkCampusProgramme(markup, route, language);
      checkSafariPhotos(markup, route, language);
      checkCampusTour(markup, route, language);
      checkCampusUpdates(markup, route, language);
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
  console.log('Campus updates passed: six clean homepage actions, expanded card 01, three tour additions, five supplied photos and complete seven-day School Camp in all languages.');
} finally {
  console.warn = originalWarn;
  console.error = originalError;
  globalThis.fetch = originalFetch;
  await server.close();
}
