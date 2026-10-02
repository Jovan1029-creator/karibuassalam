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
  const { routes, renderPage, renderBookingSummary, renderBookingConfirmation, renderProgrammeSlide } = await server.ssrLoadModule('/scripts/i18n-render-fixture.jsx');
  const { BOOKING_TYPES, getBookingTypeLabel } = await server.ssrLoadModule('/src/data/bookingOptions.js');
  const { bookingNights, bookingDate } = await server.ssrLoadModule('/src/components/BookingSummary.jsx');
  const { campusProgramme } = await server.ssrLoadModule('/src/data/campusProgramme.js');
  assert.deepEqual(BOOKING_TYPES.slice(-3).map(item => item.value), ['group-program', 'volunteering', 'general']);
  assert.equal(getBookingTypeLabel('volunteering'), 'Volunteering options');
  assert.equal(bookingNights('2026-10-06', '2026-10-13'), 7);
  assert.equal(bookingNights('2026-10-06', '2026-10-06'), 0, 'Support a same-day campus visit');
  assert.equal(bookingNights('2026-10-13', '2026-10-06'), null);
  assert.equal(bookingNights('', '2026-10-06'), null);
  assert.equal(bookingNights('invalid', '2026-10-06'), null);
  assert.equal(bookingDate('', 'de'), null);
  const summaryDraft = {
    bookingType: 'volunteering', retreatSlug: 'school-camp', roomType: 'shared-room',
    arrivalDate: '2026-10-06', departureDate: '2026-10-13', adults: '2', children: '1',
    guestLanguage: 'de', preferredContact: 'email', airportPickup: true,
    name: 'Example Visitor', email: 'visitor@example.com', phone: '+255000000000', country: 'Germany',
    dietaryNeeds: 'Vegetarian meals', message: '<script>not executable</script>',
  };
  assert.equal(new Set(campusProgramme.activities.map(item => item.image)).size, 3, 'Each activity has its own photograph');
  assert.ok(campusProgramme.activities.every(item => item.date === null), 'Do not publish example dates as confirmed events');
  for (const language of ['en', 'tr', 'de']) {
    const summary = renderBookingSummary(summaryDraft, language);
    const visible = visibleStrings(summary);
    for (const phrase of ['Your trip so far', 'Volunteering options', 'Shared eco-village room', 'German', 'Email', 'Requested',
      'Adults', 'Children', 'Room preference', 'Preferred language', 'Preferred contact', 'Airport pickup', 'Dietary or access needs', 'Message']) {
      assert.ok(visible.has(translateText(language, phrase)), `Expanded booking summary: ${phrase} (${language})`);
    }
    for (const value of [summaryDraft.name, summaryDraft.email, summaryDraft.phone, summaryDraft.country, summaryDraft.dietaryNeeds]) assert.ok(visible.has(value), 'Preserve user-entered details without translating them');
    assert.ok(visible.has(bookingDate(summaryDraft.arrivalDate, language)), 'Localize summary dates');
    assert.ok(visible.has('7') && visible.has('2') && visible.has('1'), 'Show nights and separate adult/child counts');
    assert.ok(!visible.has(translateText(language, 'School Camp')), 'Do not show a stale retreat on a volunteering enquiry');
    assert.ok(!summary.includes('<script>'), 'Escape user notes in the summary');
    const changed = renderBookingSummary({ ...summaryDraft, bookingType: 'retreat', retreatSlug: 'school-camp', airportPickup: false }, language);
    assert.ok(visibleStrings(changed).has(translateText(language, 'School Camp')), 'Reflect a changed form selection');
    assert.ok(visibleStrings(changed).has(translateText(language, 'Not requested')));
    for (const record of [null, { storageMode: 'local-fallback' }, { storageMode: 'memory-fallback' }, {}]) {
      assert.equal(renderBookingConfirmation(record, language), '', 'Never show next steps as success for unsent requests');
    }
    const confirmation = renderBookingConfirmation({ storageMode: 'supabase', id: 'test-confirmed' }, language);
    for (const phrase of ['What happens next', 'The team reviews your dates and interests.', 'We contact you using your preferred contact method.',
      'You receive the relevant details, availability and next steps.', 'This is a request, not a confirmed booking.']) {
      assert.ok(visibleStrings(confirmation).has(translateText(language, phrase)), 'Translate all post-submission copy');
    }
    assert.match(confirmation, /id="booking-next-title" tabindex="-1"/, 'The successful result can receive focus');
    const campConfirmation = renderBookingConfirmation({ storageMode: 'supabase', bookingType: 'retreat' }, language);
    assert.ok(visibleStrings(campConfirmation).has(translateText(language, 'A 20% deposit confirms a camp booking. Individual stays can be paid on arrival.')), 'Preserve existing camp and accommodation payment guidance');
    const volunteerConfirmation = renderBookingConfirmation({ storageMode: 'supabase', bookingType: 'volunteering' }, language);
    assert.ok(!visibleStrings(volunteerConfirmation).has(translateText(language, 'A 20% deposit confirms a camp booking. Individual stays can be paid on arrival.')), 'Do not imply a camp deposit applies to volunteering enquiries');
    for (const item of campusProgramme.activities) {
      assert.ok(routes.includes(item.to), 'Every activity links to a real detail page');
      assert.ok(statSync(new URL(`..${item.image}`, import.meta.url)).size > 0, 'Every slider photo exists');
      const slide = renderProgrammeSlide(item, language);
      for (const phrase of [item.title, item.description, item.alt, 'Date to be confirmed', 'Activity preview — not a confirmed event.']) {
        assert.ok(visibleStrings(slide).has(translateText(language, phrase)), 'Translate every slide, not just the first');
      }
      assert.ok(slide.includes(`href="${item.to}"`));
    }
    const datedSlide = renderProgrammeSlide({ ...campusProgramme.activities[0], date: '2026-10-06' }, language);
    assert.match(datedSlide, /datetime="2026-10-06"/i, 'A confirmed date can be added without changing the slider');
    assert.ok(!visibleStrings(datedSlide).has(translateText(language, 'Date to be confirmed')));
  }
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
        assert.ok(anchor[1].includes('class="btn btn-primary stay-option-action"'), 'Give all six card actions the same clear button treatment');
        assert.ok(card.includes(`<span class="stay-option-number" aria-hidden="true">0${index + 1}</span>`), 'Keep the visual sequence without duplicating it for screen readers');
        assert.ok(card.indexOf('stay-option-number') < card.indexOf('stay-option-body'), 'Place the number badge in the photo frame');
      });
      assert.ok(visibleStrings(cards[4]).has(translateText(language, 'Join an existing volunteer programme for a few weeks - support our teachers in the school, engage in practical experience in our permaculture garden, support our operations, fundraise for Qurban and Ramadan donations or apply for long-term volunteering opportunities.')), 'Preserve the complete approved volunteer copy in every language');
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
      assert.ok(visible.has(translateText(language, 'Ask the team about a trip to Mikumi national park as well as other routes and hikes in Tanzania.')), 'Use the requested Mikumi enquiry sentence in all languages');
      assert.doesNotMatch(markup, /Lake Manyara|Manyara-See|Manyara Gölü|Ngorongoro|Serengeti/, 'Remove the superseded park list from the safari page');
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
    const main = markup.match(/<main\b[\s\S]*?<\/main>/)?.[0];
    assert.ok(!main.includes('href="/contact"'), 'Remove the crossed-out programme and upcoming-date contact links');
    for (const phrase of ['Ask about the programme', 'Ask about upcoming dates']) {
      assert.ok(!visible.has(translateText(language, phrase)), 'Remove the superseded enquiry actions');
    }
    assert.ok(main.includes('class="happenings-carousel" role="region"'), 'Render the photo-based activity slider');
    assert.ok(main.includes('id="programme-slide" aria-live="polite"'), 'Announce manually selected slides');
    for (const phrase of ['Previous activity', 'Next activity', 'Date to be confirmed', 'Activity preview — not a confirmed event.', 'Campus Tour incl Hamammni Workshop']) {
      assert.ok(visible.has(translateText(language, phrase)), 'Localize slider controls and the first activity');
    }
    assert.equal((main.match(/aria-pressed="true"/g) || []).length, 1, 'Exactly one activity is selected');
    assert.equal((main.match(/class="happenings-dot"/g) || []).length, 3, 'Each photograph has a direct navigation control');
  }
  function checkBookingUpdates(markup, route, language) {
    if (route !== '/booking') return;
    const visible = visibleStrings(markup);
    for (const phrase of ['Interested?', 'Submit your request', 'Volunteering options',
      'Tell us which retreat, tour or workshop you are interested in, and our team will reach out to you with more information.',
      'Share your dates and details, and the team will confirm availability and the next steps.']) {
      assert.ok(visible.has(translateText(language, phrase)), `New booking copy: ${phrase} (${language})`);
    }
    assert.ok(!visible.has(translateText(language, 'What happens next')), 'Next steps appear after delivery, not beside an empty form');
    const menu = markup.match(/<select id="bookingType"[\s\S]*?<\/select>/)?.[0];
    const values = [...menu.matchAll(/<option value="([^"]+)"/g)].map(match => match[1]);
    assert.deepEqual(values, BOOKING_TYPES.map(option => option.value), 'Keep volunteering between group/school and general travel');
    const aside = markup.match(/<aside class="booking-aside"[\s\S]*?<\/aside>/)?.[0];
    assert.ok(aside.indexOf('id="trip-summary-title"') < aside.indexOf('class="aside-contact"'), 'Trip summary is first in the sidebar');
    assert.ok(aside.includes('booking-summary-hint'), 'Explain the live summary');
  }
  function checkCampusSpaces(markup, route, language) {
    if (route !== '/campus') return;
    const section = markup.match(/<section id="campus-spaces"[\s\S]*?<\/section>/)?.[0];
    assert.ok(section && visibleStrings(section).has(translateText(language, 'Around the campus')), 'Use the updated campus heading');
    const cards = [...section.matchAll(/<article class="eco-discover-card">([\s\S]*?)<\/article>/g)].map(match => match[1]);
    const titles = ['International School', 'Open-air amphitheatre', 'Campus mosque', 'Jetty & beach', 'Istanbul restaurant', 'Permaculture garden', 'Halal Spa & Pool', 'Boutique', 'Arts & Cultural Centre', 'Vocational Training Workshop'];
    assert.equal(cards.length, titles.length, 'Keep the original three campus spaces and add all seven requested spaces');
    cards.forEach((card, index) => {
      assert.ok(visibleStrings(card).has(translateText(language, titles[index])), `Translate the campus space: ${titles[index]}`);
      if ([7, 9].includes(index)) {
        assert.ok(visibleStrings(card).has(translateText(language, 'PLACEHOLDER')), 'Clearly label unverified venue photos');
        assert.ok(card.includes('role="img"') && card.includes('aspect-ratio:3 / 2'), 'Keep accessible placeholders at the same ratio as other card photos');
        assert.ok(!card.includes('<img'), 'Do not publish damaged source previews');
      } else {
        const image = card.match(/<img\b[^>]*>/)?.[0];
        assert.ok(image?.includes('loading="lazy"'), 'Campus photos load lazily');
        const src = image.match(/src="([^"]+)"/)?.[1];
        assert.ok(src?.startsWith('/pics/site-marketing/'), 'Use the selected website assets, not the ignored raw source folder');
        assert.ok(statSync(new URL(`..${src}`, import.meta.url)).size > 0, 'Campus image assets exist');
      }
    });
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
      assert.ok(decode(cards[3]).includes(translateText(language, 'Follow us')), 'Fourth card: Follow us');
      assert.ok(cards[3].includes(SITE.instagramUrl), 'Follow Us links to Karibu Assalam Instagram');
      assert.ok(!cards[3].includes('href="/booking"'), 'Follow Us must not lead to a booking form');
      assert.ok(visibleStrings(cards[2]).has(translateText(language, 'You can find us in Stone Town as well - our Spice Route Cafe offers yummy drinks & food in the heart of the historic city and our Spice Route Museum takes you on a story telling journey all about spice trade in Zanzibar.')), 'Use the supplied Stone Town cafe and museum copy');
      assert.ok(visibleStrings(cards[3]).has(translateText(language, 'We are on Instagram and Tripadvisor - follow us and learn more about our camps & retreats, volunteer experiences, life in our eco-village as well as special events.')), 'Use the supplied Follow us copy');
      for (const [index, label, href] of [[2, 'Find out more', SPICE_ROUTE_CAFE.tripAdvisorUrl], [3, 'Follow us', SITE.instagramUrl]]) {
        const action = cards[index].match(/<div class="event-card-action">\s*<a\b([^>]*)>([\s\S]*?)<\/a>/);
        assert.ok(action?.[1].includes(`href="${href}"`), `${label} leads directly to the requested external page`);
        assert.ok(decode(action[2]).includes(translateText(language, label)), 'Use the requested localized button label');
        assert.ok(action[1].includes('target="_blank"') && action[1].includes('rel="noopener noreferrer"'), 'Open the card action safely in a new tab');
      }
    }
    if (['/experiences', '/experiences/events', '/restaurant'].includes(route)) {
      assert.ok(markup.includes('The Spice Route Cafe'), 'The rated venue must be identified');
      assert.ok(decode(markup).includes(translateText(language, '{count} Tripadvisor reviews', {count: 33})), 'Show the sourced review count');
    }
    if (route === '/restaurant') assert.ok(markup.includes('id="spice-route-cafe"'), 'Stone Town links have a real destination');
    if (route === '/') assert.ok(!markup.includes('class="cafe-rating'), 'Do not present cafe ratings as homepage resort ratings');
  }
  function checkHospitalityUpdates(markup, route, language) {
    if (['/experiences/events', '/experiences/volunteer'].includes(route)) {
      const section = markup.match(/<section id="explore-more"[\s\S]*?<\/section>/)?.[0];
      assert.ok(section?.includes('permaculture-campus-tour.webp'), 'Fill the sparse Explore more section with a campus photograph');
      assert.ok(section.includes('loading="lazy"'), 'Lazy-load the supporting image');
      const copy = route.endsWith('/events')
        ? 'Make a day of your visit to Karibu Assalam. Alongside music and community events, explore our beachfront campus, discover the permaculture gardens and take part in a hands-on workshop.'
        : "Get to know the people and places around your volunteering experience. Visit our Kizimkazi campus, learn a new skill in a workshop and discover more of Zanzibar's culture through our guided excursions.";
      assert.ok(visibleStrings(section).has(translateText(language, copy)), 'Show meaningful, category-specific copy in all languages');
      assert.ok(visibleStrings(section).has(translateText(language, 'Join the Karibu Assalam Tour, try soap-making or drumming, or discover Stone Town and the spice gardens. Our team can help you choose experiences around your stay.')));
      for (const href of ['/experiences', '/contact']) assert.ok(section.includes(`href="${href}"`), 'Keep discovery and planning destinations');
    }
    if (route === '/restaurant') {
      const section = markup.match(/<section id="dining-experience"[\s\S]*?<\/section>/)?.[0];
      assert.ok(section, 'Keep the restaurant page simple with one dining section');
      const visible = visibleStrings(markup);
      for (const phrase of ['Dining Experience', 'Farm to Table', 'Delicious', 'Swahili and international cuisine', 'Talented Chefs',
        'Camp and retreat guests are served three meals daily, prepared by talented chefs and featuring Swahili and international cuisine.',
        'Dining also includes beach dinners with sunset views, creating a shared mealtime experience alongside the program schedule.',
        'Karibu Assalam offers more than just food: If you would like to learn how to cook Swahili cuisine, join us for a cooking lesson. During Ramadan, we welcome you to join an iftar in our kanga village.']) {
        assert.ok(visible.has(translateText(language, phrase)), `Restaurant includes requested copy: ${phrase} (${language})`);
      }
      for (const old of ['Hygienic', 'Multicultural', 'Kitchen & Dining Features']) {
        assert.ok(!visible.has(translateText(language, old)), 'Remove the superseded restaurant labels');
      }
      assert.equal((section.match(/class="pill"/g) || []).length, 4, 'Keep four simple dining features');
      assert.equal([...markup.matchAll(/<h2\b[^>]*>([^<]*)<\/h2>/g)].filter(match => decode(match[1]) === translateText(language, 'Dining Experience')).length, 1, 'Do not repeat the dining heading');
      const image = section.match(/<img\b[^>]*>/)?.[0];
      assert.ok(image?.includes('/pics/rooms/food-1-enhanced.webp'), 'Use the selected food photograph, not the old terrace photo');
      assert.ok(image.includes('loading="lazy"') && image.includes('width="1672"') && image.includes('height="941"'));
      assert.ok(visibleStrings(image).has(translateText(language, 'A fresh meal with fruit, bread and vegetables served in a woven tray')));
    }
    if (route === '/eco-resort') {
      const card = markup.match(/<article id="kanga-africa"[\s\S]*?<\/article>/)?.[0];
      assert.ok(card && visibleStrings(card).has(translateText(language, 'Our campus has a tailoring workshop creating unique textiles and souvenirs. Explore our boutique and support our local women tailors by choosing a special souvenir to take home.')), 'Describe Kanga Africa as the campus tailoring workshop and boutique');
      assert.ok(card.includes('kanga-tailoring-workshop.webp'), 'Keep the relevant tailoring photo');
      assert.ok(!card.includes('<a '), 'Remove the crossed-out tour link from the Kanga Africa card');
    }
  }
  function checkSocialRail(markup, route, language) {
    const rail = markup.match(/<nav class="social-rail(?: on-light)?"[^>]*>[\s\S]*?<\/nav>/)?.[0];
    assert.ok(rail, `${route}: preserve the shared social navigation`);
    assert.ok(visibleStrings(rail).has(translateText(language, 'Stay connected')));
    assert.equal(rail.includes('class="social-rail on-light"'), route !== '/', 'Use a light surface outside the home hero');
    const links = [...rail.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)];
    const expected = [
      [SITE.instagramUrl, 'Follow us on Instagram', true],
      [`https://wa.me/${SITE.whatsAppPhone}`, 'Message us on WhatsApp', true],
      [`mailto:${SITE.email}`, 'Email', false],
    ];
    assert.equal(links.length, expected.length, 'Keep exactly the three existing social destinations');
    links.forEach((link, index) => {
      const [href, phrase, external] = expected[index];
      const label = translateText(language, phrase);
      assert.ok(link[1].includes(`href="${href}"`), 'Keep the configured destination');
      assert.ok(visibleStrings(`<a ${link[1]}>`).has(label), 'Localize each accessible link name');
      assert.ok(visibleStrings(link[2]).has(label), 'Localize the revealed label as well');
      assert.ok(link[2].includes('class="social-rail-label" aria-hidden="true"'), 'Do not announce the same label twice');
      assert.ok(!link[1].includes('title='), 'Avoid a second native tooltip over the designed label');
      assert.equal(link[1].includes('target="_blank"'), external, 'Only external destinations open a new tab');
      if (external) assert.ok(link[1].includes('rel="noopener noreferrer"'));
      for (const icon of link[2].matchAll(/<svg\b[^>]*>/g)) {
        assert.ok(icon[0].includes('aria-hidden="true"'), 'Keep decorative icons out of the accessibility tree');
      }
    });
  }
  const leaked = [];
  for (const route of routes) {
    const englishMarkup = await renderPage(route, 'en');
    checkCafeLinks(englishMarkup, route, 'en');
    checkCampusProgramme(englishMarkup, route, 'en');
    checkCampusSpaces(englishMarkup, route, 'en');
    checkSafariPhotos(englishMarkup, route, 'en');
    checkCampusTour(englishMarkup, route, 'en');
    checkCampusUpdates(englishMarkup, route, 'en');
    checkHospitalityUpdates(englishMarkup, route, 'en');
    checkSocialRail(englishMarkup, route, 'en');
    checkBookingUpdates(englishMarkup, route, 'en');
    const english = visibleStrings(englishMarkup);
    assert.ok(!english.has('Accommodations'), `${route}: use singular Accommodation throughout the visible site`);
    for (const language of ['tr', 'de']) {
      const markup = await renderPage(route, language);
      checkCafeLinks(markup, route, language);
      checkCampusProgramme(markup, route, language);
      checkCampusSpaces(markup, route, language);
      checkSafariPhotos(markup, route, language);
      checkCampusTour(markup, route, language);
      checkCampusUpdates(markup, route, language);
      checkHospitalityUpdates(markup, route, language);
      checkSocialRail(markup, route, language);
      checkBookingUpdates(markup, route, language);
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
  console.log('Campus spaces and safari checks passed: all ten space cards, explicit photo placeholders, localized labels and exact Mikumi enquiry copy.');
  console.log('Hospitality checks passed: populated Explore more sections, dining photo and revised copy, direct external card links, and Kanga Africa boutique description in all languages.');
  console.log('Social rail checks passed: three preserved destinations, localized hover/accessibility labels, safe external links and route-specific surfaces.');
  console.log('Booking and programme checks passed: new copy, volunteering option, live summary data, delivery-gated next steps, three photo slides and no invented event dates.');
} finally {
  console.warn = originalWarn;
  console.error = originalError;
  globalThis.fetch = originalFetch;
  await server.close();
}
