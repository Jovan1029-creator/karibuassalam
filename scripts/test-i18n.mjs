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
  const { routes, renderPage, renderBookingSummary, renderBookingConfirmation, renderProgrammeSlide, renderReviewQuote, renderGuestReviews } = await server.ssrLoadModule('/scripts/i18n-render-fixture.jsx');
  const { BOOKING_TYPES, getBookingTypeLabel } = await server.ssrLoadModule('/src/data/bookingOptions.js');
  const { bookingNights, bookingDate } = await server.ssrLoadModule('/src/components/BookingSummary.jsx');
  const { campusProgramme } = await server.ssrLoadModule('/src/data/campusProgramme.js');
  const { faqSections } = await server.ssrLoadModule('/src/data/faq.js');
  assert.deepEqual(faqSections.map(section => section.id), ['preparation', 'travel-support', 'stay', 'booking'], 'Preparation comes first and cancellation last');
  assert.equal(faqSections.flatMap(section => section.items).length, 24, 'Preserve all FAQ questions');
  const { SITE, SPICE_ROUTE_CAFE, ECO_VILLAGE_LINKS, RETREAT_LINKS } = await server.ssrLoadModule('/src/data/siteConfig.js');
  const { guestReviews, reviewSources } = await server.ssrLoadModule('/src/data/guestReviews.js');
  const { reviewIndex } = await server.ssrLoadModule('/src/components/GuestReviews.jsx');
  assert.equal(SITE.googleMapsUrl, 'https://maps.app.goo.gl/gQsTRmh4VrURr1zRA', 'Use the exact supplied map pin');
  assert.notEqual(SITE.foundationTripAdvisorUrl, SPICE_ROUTE_CAFE.tripAdvisorUrl, 'Keep the Foundation and cafe listings separate');
  assert.equal(guestReviews.length, 11);
  assert.equal(new Set(guestReviews.map(review => review.id)).size, guestReviews.length, 'Stable unique slide identities');
  assert.deepEqual(guestReviews.filter(review => review.source === 'google').map(review => review.author), [
    'Monem Daymi', 'Turan Akgün', 'Muhammad Romadhon Mubarok', 'Venance Dulle',
    'shan ali sumar', 'Cihan', 'Cengizhan Atlihan', 'Suliman Albimani', 'Hayrunnisa E',
  ], 'Preserve the selected Google excerpts after the requested review removal');
  assert.ok(!guestReviews.some(review => review.id === 'google-lamaar' || review.response), 'Remove the specified review and its attached owner response');
  assert.equal(reviewIndex(-1, guestReviews.length), guestReviews.length - 1, 'Previous wraps from first to last');
  assert.equal(reviewIndex(guestReviews.length, guestReviews.length), 0, 'Next wraps from last to first');
  assert.equal(reviewIndex(5, guestReviews.length), 5);
  assert.equal(reviewIndex(0, 0), 0, 'Handle an empty selection safely');
  assert.ok(guestReviews.filter(review => review.source === 'tripadvisor').reduce((words, review) => words + review.text.split(/\s+/).length, 0) <= 25, 'Keep the sourced Tripadvisor excerpts short');
  for (const language of ['en', 'tr', 'de']) {
    assert.equal(renderGuestReviews([], language), '', 'Do not render an empty review section');
    assert.ok(!renderGuestReviews([guestReviews[0]], language).includes('guest-review-controls'), 'A single quote needs no slider controls');
    for (const review of guestReviews) {
      assert.ok(reviewSources[review.source], 'Every quote has an identified source');
      assert.equal(review.rating, undefined, 'Do not infer stars from pasted glyphs');
      if (review.source === 'google') assert.equal(review.date, undefined, 'Do not invent dates from relative timestamps');
      const quote = renderReviewQuote(review, language);
      const visible = visibleStrings(quote);
      assert.ok(visible.has(translateText(language, review.text)), 'Translate every slide, not just the first');
      assert.ok(visible.has(review.author), 'Preserve reviewer names without translating them');
      assert.ok(visible.has(SITE.nonprofitName), 'Attribute each review to the Foundation');
      assert.ok(visible.has(reviewSources[review.source].platform));
      assert.ok(visible.has(translateText(language, language === 'en' ? 'Review excerpt' : 'Translated review excerpt')));
      assert.ok(quote.includes('<blockquote>') && quote.includes('<figcaption>'), 'Use accessible quotation semantics');
      assert.ok(!quote.includes('<img') && !quote.includes('<iframe'), 'Reviews have no photos or embedded widgets');
      assert.ok(quote.includes(`href="${reviewSources[review.source].href}"`) && quote.includes('target="_blank"') && quote.includes('rel="noopener noreferrer"'));
      assert.ok(!quote.includes(SPICE_ROUTE_CAFE.tripAdvisorUrl), 'Do not mix cafe reviews into Foundation quotes');
      if (review.response) {
        assert.ok(visible.has(translateText(language, 'Owner response - excerpt')));
        assert.ok(visible.has(translateText(language, review.response.text)));
        assert.ok(quote.indexOf('guest-review-response') > quote.indexOf('</figcaption>'), 'Keep owner responses outside the guest quotation');
      }
      if (review.date) assert.ok(quote.toLowerCase().includes(`datetime="${review.date}"`));
    }
  }
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
  assert.equal(campusProgramme.month, '2026-10', 'Keep recurring activities scoped to the confirmed October edition');
  assert.deepEqual(campusProgramme.activities.map(item => [item.schedule, item.title, item.to, item.joinLabel]), [
    ['Every Tuesday', 'Campus Tour including Hamamni Workshop', '/experiences/tours/campus-village-tour', 'Join the next tour'],
    ['Every Thursday', 'Campus Tour including Ngoma Workshop', '/experiences/tours/campus-village-tour', 'Join the workshop'],
    ['Every Wednesday', 'Swahili cooking class', '/experiences/workshops/cooking', 'Join the next class'],
  ], 'Use the supplied weekly schedule, detail pages and join actions');
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
      for (const phrase of [item.title, item.description, item.alt, item.schedule, item.joinLabel]) {
        assert.ok(visibleStrings(slide).has(translateText(language, phrase)), 'Translate every slide, not just the first');
      }
      assert.ok(slide.includes(`href="${item.to}"`));
      for (const old of ['Date to be confirmed', 'Activity preview - not a confirmed event.']) {
        assert.ok(!visibleStrings(slide).has(translateText(language, old)), 'Confirmed weekly activities must not show preview warnings');
      }
      const join = [...slide.matchAll(/<a\b([^>]*)>/g)].find(match => match[1].includes('https://wa.me/'))?.[1];
      assert.ok(join?.includes('target="_blank"') && join.includes('rel="noopener noreferrer"'), 'Join links open WhatsApp safely in a new tab');
      const url = new URL(decode(join.match(/href="([^"]+)"/)[1]));
      assert.equal(url.pathname, `/${SITE.whatsAppPhone}`);
      assert.equal(url.searchParams.get('text'), translateText(language, item.whatsAppMessage), 'Prefill the correct localized activity message without sending it');
    }
    const datedSlide = renderProgrammeSlide({ ...campusProgramme.activities[0], date: '2026-10-06' }, language);
    assert.match(datedSlide, /datetime="2026-10-06"/i, 'A confirmed date can be added without changing the slider');
    assert.ok(!visibleStrings(datedSlide).has(translateText(language, 'Date to be confirmed')));
  }
  const { safariHeroPhoto, safariOverviewPhoto, safariPlanningPhoto, safariGalleryPhotos } = await server.ssrLoadModule('/src/data/safariPhotos.js');
  const { campusTour, safari, tours } = await server.ssrLoadModule('/src/data/experiences.js');
  const { getExperienceDetail } = await server.ssrLoadModule('/src/data/experienceDetails.js');
  const campusDetail = getExperienceDetail('tours', 'campus-village-tour');
  assert.deepEqual(tours.map(item => item.title), ['City & Spice', 'South East Coast', 'Sandbank & Snorkeling', 'Kizimkazi Village Tour'], 'Use the four requested excursion names and order');
  for (const tour of tours) {
    assert.equal(getExperienceDetail('tours', tour.slug)?.title, tour.title, 'Every excursion card matches its detail page');
    assert.ok(routes.includes(`/experiences/tours/${tour.slug}`), 'Every excursion has a tested destination');
  }
  const spiceCity = getExperienceDetail('tours', 'spice-tour');
  assert.equal(spiceCity.intro, "Explore Zanzibar's cultural heritage on a full day tour with a visit of spice gardens and a guided tour of the old town's maze of alleys.");
  assert.equal(tours[0].text, spiceCity.intro, 'Use the supplied City & Spice introduction on both pages');
  assert.deepEqual(spiceCity.included, ['Guided spice farm tour', 'Guided tour of the historic city centre'], 'Combine spice and city activities in the shared tour');
  const villageTour = getExperienceDetail('tours', 'kizimkazi-village-tour');
  assert.equal(villageTour.intro, 'Take a village tour with our team to connect with the community, learn about local life and visit Salaam Cave.');
  assert.equal(tours[3].text, villageTour.intro, 'Use the supplied village tour introduction on both pages');
  assert.ok(villageTour.included.includes('Visit Salaam Cave'), 'Include the requested Salaam Cave visit');
  assert.equal(villageTour.duration, 'Ask the team');
  assert.equal(villageTour.start, 'Ask the team');
  assert.equal(villageTour.price, undefined, 'Do not invent the new village tour price');
  assert.equal(getExperienceDetail('tours', 'blue-safari').title, 'Sandbank & Snorkeling', 'Preserve the old ocean-tour URL after renaming');
  assert.ok(decodeURIComponent(getExperienceDetail('tours', 'blue-safari').image).endsWith('/East Coast Tour.jpg'), 'Use the actual sandbank photograph despite its legacy filename');
  assert.ok(decodeURIComponent(getExperienceDetail('tours', 'east-coast-tour').image).endsWith('/Blue Safari.jpg'), 'Use The Rock photograph for South East Coast despite its legacy filename');
  const appSource = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8');
  assert.match(appSource, /path="\/experiences\/tours\/city-tour" element=\{<Navigate to="\/experiences\/tours\/spice-tour" replace/, 'Old city-tour links redirect to the combined tour');
  const { getRetreatBySlug, retreats } = await server.ssrLoadModule('/src/data/retreats.js');
  const kindness = getRetreatBySlug('kindness-camp');
  const volunteerCamp = getRetreatBySlug('volunteering-camp');
  assert.deepEqual(RETREAT_LINKS.slice(1, 4).map(item => item.to), ['/retreats/kindness-camp', '/retreats/volunteering-camp', '/retreats/ramadan-camp'], 'Insert Volunteering Camp between Kindness and Ramadan');
  assert.deepEqual(retreats.slice(0, 3).map(item => item.slug), ['kindness-camp', 'volunteering-camp', 'ramadan-camp'], 'Keep the same order in listings and booking choices');
  const originalVolunteerCamp = JSON.parse(JSON.stringify(kindness).replaceAll('"slug":"kindness-camp"', '"slug":"volunteering-camp"').replaceAll('Kindness Camp', 'Volunteering Camp'));
  const volunteeringIntro = 'Our Volunteering Camp is for travellers who want to give back and share their time and skills while visiting Zanzibar. Meet local communities, share meaningful moments, connect with the local culture and give back along the way - just come with an open heart for people, an open mind for another culture and open hands to join in and support our projects.';
  assert.equal(volunteerCamp.details.intro, volunteeringIntro, 'Use the supplied volunteering introduction, correcting visiting');
  originalVolunteerCamp.details.intro = volunteeringIntro;
  assert.deepEqual(volunteerCamp, originalVolunteerCamp, 'Keep the rest of the independently editable camp copy unchanged');
  assert.notEqual(volunteerCamp.details, kindness.details, 'Volunteering copy can be edited independently');
  assert.notEqual(volunteerCamp.details.schedule, kindness.details.schedule, 'Volunteering itinerary can be edited independently');
  assert.notEqual(volunteerCamp.details.schedule[0], kindness.details.schedule[0]);
  for (const language of ['en', 'tr', 'de']) {
    const markup = await renderPage('/retreats/volunteering-camp', language);
    const visible = visibleStrings(markup);
    const copy = volunteerCamp.details;
    for (const phrase of [copy.heading, copy.intro, copy.inclusionHeading, copy.itineraryIntro, copy.stayCopy, copy.bookingCopy, ...copy.includedItems, ...copy.foodCopy, ...copy.schedule.flatMap(item => [item.heading, item.copy])]) {
      assert.ok(visible.has(translateText(language, phrase)), `Volunteering Camp preserves and translates ${phrase}`);
    }
    assert.equal((markup.match(/class="accordion-item"/g) || []).length, 7, 'Copy all seven itinerary days');
    const booking = await renderPage('/booking?retreat=volunteering-camp', language);
    assert.ok(booking.includes('value="volunteering-camp"'), 'The new camp is available in booking choices');
  }
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
      const actions = section.match(/<div class="section-actions">([\s\S]*?)<\/div>/)?.[1];
      const buttons = [...actions.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)];
      assert.equal(buttons.length, 3, 'Keep booking, reviews and discovery as three actions');
      assert.deepEqual(buttons.map(button => decode(button[2])), ['Book this experience', 'Read the reviews', 'Explore more Zanzibar excursions'].map(phrase => translateText(language, phrase)), 'The review CTA is in the middle');
      assert.ok(buttons[1][1].includes(`href="${SITE.dailyTourTripAdvisorUrl}"`) && buttons[1][1].includes('target="_blank"') && buttons[1][1].includes('rel="noopener noreferrer"'), 'Open the actual daily-tour listing safely in a new tab');
      assert.notEqual(SITE.dailyTourTripAdvisorUrl, SITE.foundationTripAdvisorUrl);
      assert.match(SITE.dailyTourTripAdvisorUrl, /AttractionProductReview-g482884-d23329866-Daily_Karibu_Assalam_Tour/);
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
  assert.equal(campusDetail.description, undefined, 'Keep the long tour description on the overview only');
  assert.equal(campusDetail.duration, 'Half day');
  assert.equal(campusDetail.days, 'Runs daily');
  assert.equal(campusDetail.price, '$40 per person', 'Keep the existing paid price; do not invent a new price');
  const soapDetail = getExperienceDetail('workshops', 'soap-making');
  assert.equal(soapDetail.title, 'Hamamni soap workshop');
  assert.equal(soapDetail.days, 'Any day');
  assert.equal(soapDetail.price, '$40 per person', 'Use the soap workshop price supplied in the annotation');
  assert.equal(soapDetail.duration, '2–3 hours');
  assert.equal(soapDetail.start, 'Morning or afternoon');
  const workshopInclusions = {
    'soap-making': ['Guided workshop', 'Your own soap to take home'],
    drumming: ['Guided workshop', 'Your own drum to take home'],
    'eco-print': ['Guided workshop', 'Your printed fabric to take home'],
    cooking: ['Guided cooking class', 'The dish you make for lunch'],
  };
  for (const [slug, included] of Object.entries(workshopInclusions)) {
    const workshop = getExperienceDetail('workshops', slug);
    assert.deepEqual(workshop.included, included, 'Keep each workshop’s specific inclusions');
    for (const photo of [workshop.detailPhoto, workshop.optionsPhoto]) {
      assert.ok(photo?.src && photo.alt, `${slug}: both sections need a photograph and accessible description`);
      assert.ok(statSync(new URL(`..${photo.src}`, import.meta.url)).size > 0, 'Workshop photographs exist on disk');
    }
    assert.notEqual(workshop.detailPhoto.src, workshop.optionsPhoto.src, 'Use a different photograph for the extension section');
    assert.equal(workshop.bring, campusDetail.bring, 'Keep the campus dress guidance with the extension options');
  }
  for (const slug of ['soap-making', 'drumming']) {
    assert.deepEqual(getExperienceDetail('workshops', slug).options, campusDetail.options, 'Reuse the approved tour extensions');
  }
  assert.deepEqual(getExperienceDetail('workshops', 'eco-print').options, [
    'add a lunch', 'add a cooking lesson on campus or in the kanga village', 'extend the day with a private spa experience',
  ], 'Do not offer Eco-print as an extra on the Eco-print workshop');
  assert.deepEqual(getExperienceDetail('workshops', 'cooking').options, [
    'Combine with another workshop', 'extend the day with a private spa experience',
  ], 'Do not offer already-included cooking and lunch as paid extras');
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
      assert.ok(!images.some(tag => tag.includes('/pics/safari/')), 'Keep mainland safari photographs out of Sandbank & Snorkeling');
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
      assert.ok(images.some(tag => decodeURIComponent(tag.match(/src="([^"]+)"/)?.[1] || '').includes('East Coast Tour.jpg')), 'Use the supplied sandbank photograph');
    } else {
      assert.ok(!markup.includes('photo-slot'), 'The dedicated safari page uses real photos throughout');
      assert.ok(visible.has(translateText(language, 'Ask the team about a trip to Mikumi national park as well as other routes and hikes in Tanzania.')), 'Use the requested Mikumi enquiry sentence in all languages');
      assert.doesNotMatch(markup, /Lake Manyara|Manyara-See|Manyara Gölü|Ngorongoro|Serengeti/, 'Remove the superseded park list from the safari page');
      assert.equal((markup.match(/class="safari-gallery-item"/g) || []).length, 3, 'Keep the three-portrait gallery');
      const photoButtons = [...markup.matchAll(/<button\b[^>]*class="safari-gallery-open"[^>]*>[\s\S]*?<\/button>/g)].map(match => match[0]);
      assert.equal(photoButtons.length, 3, 'All three safari photos are keyboard/touch-accessible buttons');
      for (const [index, photo] of safariGalleryPhotos.entries()) {
        assert.ok(visible.has(translateText(language, photo.label)), 'Localize every gallery caption');
        assert.ok(photoButtons[index].includes('type="button"') && photoButtons[index].includes('aria-haspopup="dialog"'));
        assert.ok(photoButtons[index].includes(`src="${photo.src}"`), 'Keep the correct photo within each clickable target');
        assert.ok(visibleStrings(photoButtons[index]).has(`${translateText(language, photo.label)} - ${translateText(language, 'View photo')}`));
      }
      assert.ok(visible.has(translateText(language, 'Moments on safari')), 'Localize the gallery heading');
      const exploreMore = markup.match(/<section id="explore-more"[\s\S]*?<\/section>/)?.[0];
      assert.ok(exploreMore?.includes('permaculture-campus-tour.webp'), 'Explore more includes a relevant campus photograph');
      assert.ok(exploreMore.includes('href="/experiences"') && exploreMore.includes('href="/contact"'), 'Explore more has working discovery and contact links');
      assert.ok(visibleStrings(exploreMore).has(translateText(language, 'Make time for more of Zanzibar before or after your safari. Visit our Kizimkazi campus, meet the community and explore the island through hands-on workshops and guided excursions.')), 'Translate the new Explore more copy');
    }
  }
  function checkCampusTour(markup, route, language) {
    const visible = visibleStrings(markup);
    assert.doesNotMatch([...visible].join(' '), /Blue Safari|Mavi Safari/i, 'Do not display the superseded ocean-tour name, including in the FAQ');
    const currentTour = tours.find(tour => route === `/experiences/tours/${tour.slug}`);
    if (currentTour) {
      const detail = getExperienceDetail('tours', currentTour.slug);
      const hero = markup.match(/<section class="hero [\s\S]*?<\/section>/)?.[0];
      assert.ok(hero && visibleStrings(hero).has(translateText(language, currentTour.title)), 'Detail hero matches the new excursion name');
      assert.ok(visibleStrings(hero).has(translateText(language, detail.intro)), 'Translate the updated detail introduction');
      if (detail === villageTour) assert.ok(visible.has(translateText(language, 'Visit Salaam Cave')));
    }
    assert.doesNotMatch([...visible].join(' '), /hamammni/i, `Use Hamamni consistently in visible copy and accessibility labels: ${route} (${language})`);
    const detailRoute = route.match(/^\/experiences\/(tours|workshops)\/([^/]+)$/);
    const bookingNote = 'Group and private options are available. Ask the team to confirm dates and the final price before booking.';
    if (detailRoute && detailRoute[2] !== 'campus-village-tour' && getExperienceDetail(detailRoute[1], detailRoute[2])) {
      const otherVisible = visibleStrings(markup);
      assert.ok(otherVisible.has(translateText(language, bookingNote)), 'Keep booking notes on other experience pages');
      assert.equal(otherVisible.has(translateText(language, 'Plan your experience')), detailRoute[2] !== 'soap-making', 'Remove only the marked campus tour and soap workshop planning headings');
    }
    if (route === '/experiences/workshops/soap-making') {
      const hero = markup.match(/<section class="hero [\s\S]*?<\/section>/)?.[0];
      assert.ok(hero && visibleStrings(hero).has(translateText(language, soapDetail.title)), 'Use the shorter Hamamni soap workshop title');
      const facts = markup.match(/<section class="section experience-detail-facts"[\s\S]*?<\/section>/)?.[0];
      assert.ok(facts, 'Preserve the soap workshop fact cards');
      for (const fact of [soapDetail.duration, soapDetail.days, soapDetail.start, soapDetail.price]) {
        assert.ok(visibleStrings(facts).has(translateText(language, fact)), `Localize the soap workshop fact: ${fact}`);
      }
      assert.ok(!visibleStrings(facts).has(translateText(language, 'Any day, subject to availability')), 'Remove the crossed-out availability qualification only from the soap facts');
    }
    if (!['/experiences', '/experiences/tours/campus-village-tour'].includes(route)) return;
    for (const oldPhrase of ['Daily campus tour', 'A free guided walk through the eco-village, every day.', 'Free for guests', 'About 45 minutes', 'Karibu Assalam Tour: campus & village']) {
      assert.ok(!visible.has(translateText(language, oldPhrase)), `Remove the duplicate/free tour claim: ${oldPhrase}`);
    }
    if (route === '/experiences') {
      const excursions = markup.match(/<section id="zanzibar-excursions"[\s\S]*?<\/section>/)?.[0];
      const cards = [...excursions.matchAll(/<article class="experience-card">([\s\S]*?)<\/article>/g)].map(match => match[1]);
      assert.equal(cards.length, 4, 'Show four excursion cards, not separate Spice and City offers');
      cards.forEach((card, index) => {
        assert.ok(visibleStrings(card).has(translateText(language, tours[index].title)), 'Translate the revised excursion names in order');
        assert.ok(visibleStrings(card).has(translateText(language, tours[index].text)), 'Show the requested localized excursion descriptions');
        if ([1, 2].includes(index)) {
          const photo = card.match(/<img\b[^>]*src="([^"]+)"/)?.[1];
          assert.equal(photo, getExperienceDetail('tours', tours[index].slug).image, 'Keep the corrected coast and sandbank photos consistent across cards and details');
        }
        assert.ok(card.includes(`href="/experiences/tours/${tours[index].slug}"`));
      });
      assert.ok(visible.has(translateText(language, campusTour.text)), 'Preserve the supplied tour description on All Experiences in all languages');
      const intro = markup.match(/<div class="set-intro">([\s\S]*?)<\/div>/)?.[1];
      const eyebrow = intro?.match(/<p class="eyebrow">([\s\S]*?)<\/p>/)?.[1];
      assert.equal(decode(eyebrow || ''), translateText(language, campusTour.promise), 'Move the Kizimkazi invitation above the title');
      assert.ok(intro.indexOf('class="eyebrow"') < intro.indexOf('<h2'), 'Keep the invitation above the tour title');
      assert.equal((intro.match(/<p\b/g) || []).length, 1, 'Do not repeat the invitation beneath the title');
      assert.ok(!visibleStrings(intro).has(translateText(language, 'Visit our campus')), 'Replace the old campus eyebrow');
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
      assert.ok(!visible.has(translateText(language, campusTour.text)), 'Remove the duplicate long description from the tour detail page');
      assert.ok(!markup.includes('experience-detail-description'), 'Do not leave an empty paragraph beneath the facts');
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
  function checkWorkshopLayout(markup, route, language) {
    const slug = route.match(/^\/experiences\/workshops\/([^/]+)$/)?.[1];
    if (!workshopInclusions[slug]) return;
    const workshop = getExperienceDetail('workshops', slug);
    const included = markup.match(/<section id="what-is-included"[\s\S]*?<\/section>/)?.[0];
    const customize = markup.match(/<section id="make-it-your-own"[\s\S]*?<\/section>/)?.[0];
    assert.ok(included?.includes('class="retreat-feature-split"'), 'Use the tour’s two-column inclusion layout');
    assert.ok(customize?.includes('class="retreat-feature-split experience-customize-layout"'), 'Use the photo-and-options layout for every workshop');
    assert.ok(customize.includes('experience-customize-section') && !customize.includes('closing-section'), 'Keep the centered heading and left-aligned extension list');
    assert.ok(markup.indexOf(included) < markup.indexOf(customize), 'Show inclusions before Make it your own');
    assert.ok(included.indexOf('<img') < included.indexOf('<ul'), 'Place the inclusion photograph on the left');
    assert.ok(customize.indexOf('</ul>') < customize.indexOf('<img'), 'Place the extension photograph on the right');
    for (const [section, photo, phrases] of [
      [included, workshop.detailPhoto, ['What is included', ...workshop.included]],
      [customize, workshop.optionsPhoto, ['Make it your own', ...workshop.options, workshop.bring, workshop.languages]],
    ]) {
      const visible = visibleStrings(section);
      assert.ok(!section.includes('photo-slot'), 'Do not leave empty workshop photo placeholders');
      assert.equal((section.match(/<img\b/g) || []).length, 1, 'One photograph per section');
      const image = section.match(/<img\b[^>]*>/)?.[0];
      assert.ok(image.includes(`src="${photo.src}"`) && image.includes('loading="lazy"'), 'Use the selected lazy-loaded photograph');
      assert.ok(visibleStrings(image).has(translateText(language, photo.alt)), 'Translate photo descriptions');
      for (const phrase of phrases) assert.ok(visible.has(translateText(language, phrase)), `${slug}: translate ${phrase} (${language})`);
    }
    const list = customize.match(/<ul class="check-list experience-options">([\s\S]*?)<\/ul>/)?.[1];
    assert.equal((list?.match(/<li>/g) || []).length, workshop.options.length, 'Keep extension options as the tour-style vertical checklist');
    for (const href of ['/contact', '/experiences#workshops']) assert.ok(customize.includes(`href="${href}"`), 'Preserve booking and workshop discovery links');
  }
  const typography = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');
  assert.match(typography, /\.retreat-feature-split\s*\{[^}]*grid-template-columns: minmax\(0, 1fr\) minmax\(0, 1fr\)/, 'Shared experience sections use two equal desktop columns');
  assert.match(typography, /@media \(max-width: 960px\)\s*\{[\s\S]*?\.retreat-feature-split\s*\{[^}]*grid-template-columns: 1fr/, 'Shared experience sections stack on smaller screens');
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
    for (const phrase of ['Workshops, tours and special events', 'What is happening on campus this month?', 'October 2026', 'What else is happening?', '12–14 March 2027', 'Spice Route Cafe', 'Spice Route Museum', 'Follow us on Instagram and stay updated.']) {
      assert.ok(visible.has(translateText(language, phrase)), `Campus programme missing: ${phrase} (${language})`);
    }
    for (const phrase of ['Weekly activities', 'Join our weekly campus tours and cooking classes this October. Choose an activity and message us on WhatsApp to join.']) {
      assert.ok(!visible.has(translateText(language, phrase)), 'Remove the extra weekly activity badge and introduction');
    }
    assert.ok(!markup.includes('happenings-status') && !markup.includes('happenings-intro-copy'));
    assert.match(markup, /datetime="2026-10"/i, 'Keep the explicitly requested October edition');
    assert.ok(markup.indexOf('id="happenings-later-title"') > markup.indexOf('id="programme-month"'), 'Later heading follows the monthly programme');
    const main = markup.match(/<main\b[\s\S]*?<\/main>/)?.[0];
    for (const phrase of ['Programme coming soon', 'Activity preview - not a confirmed event.', 'Date to be confirmed', 'More dates will be shared here once confirmed.']) {
      assert.ok(!visibleStrings(main).has(translateText(language, phrase)), 'Remove obsolete pending and preview copy');
    }
    const more = main.match(/<section class="happenings-later"[\s\S]*?<\/section>/)?.[0];
    assert.equal((more.match(/class="happenings-more-card"/g) || []).length, 3, 'Show the festival, Stone Town venues and Instagram updates');
    for (const href of [SITE.sufiFestivalUrl, SPICE_ROUTE_CAFE.tripAdvisorUrl, SITE.spiceRouteMuseumUrl, SITE.instagramUrl]) {
      const anchor = [...more.matchAll(/<a\b([^>]*)>/g)].find(match => match[1].includes(`href="${href}"`))?.[1];
      assert.ok(anchor?.includes('target="_blank"') && anchor.includes('rel="noopener noreferrer"'), 'Every outside event and venue link opens a safe new tab');
    }
    assert.ok(!main.includes('href="/contact"'), 'Remove the crossed-out programme and upcoming-date contact links');
    for (const phrase of ['Ask about the programme', 'Ask about upcoming dates']) {
      assert.ok(!visible.has(translateText(language, phrase)), 'Remove the superseded enquiry actions');
    }
    assert.ok(main.includes('class="happenings-carousel" role="region"'), 'Render the photo-based activity slider');
    assert.ok(main.includes('id="programme-slide" aria-live="polite"'), 'Announce manually selected slides');
    for (const phrase of ['Previous activity', 'Next activity', 'Every Tuesday', 'Join the next tour', 'Campus Tour including Hamamni Workshop']) {
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
      assert.ok(cards.every(card => !card.includes('cafe-rating')), 'Do not squeeze the rating into an event card');
      const reviewStrip = markup.match(/<aside class="cafe-review-strip">[\s\S]*?<\/aside>/)?.[0];
      assert.ok(reviewStrip, 'Give cafe reviews a dedicated full-width panel');
      assert.ok(markup.indexOf(reviewStrip) > markup.indexOf(cards[3]) + cards[3].length, 'Place the review panel after the four-card grid');
      assert.ok(reviewStrip.includes('<h3>The Spice Route Cafe</h3>'), 'Visibly attribute reviews to the cafe, not the resort');
      assert.ok(visibleStrings(reviewStrip).has(translateText(language, 'This cafe is in Stone Town, separate from our eco-village in Kizimkazi.')));
      assert.ok(reviewStrip.includes(SPICE_ROUTE_CAFE.tripAdvisorUrl), 'Keep the review link in the wider panel');
      assert.ok(reviewStrip.includes('cafe-rating-note') && !reviewStrip.includes('cafe-rating--compact'), 'Use the full dated snapshot, not the compact variant');
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
  function checkReviewsAndFooter(markup, route, language) {
    const footer = markup.match(/<footer class="site-footer">[\s\S]*?<\/footer>/)?.[0];
    assert.ok(footer, 'Every page retains the footer');
    const brand = footer.match(/<section class="footer-col footer-col-brand"[\s\S]*?<\/section>/)?.[0];
    assert.ok(brand?.includes(`href="${SPICE_ROUTE_CAFE.tripAdvisorUrl}"`), 'Move Stone Town below the footer brand and link directly to the cafe listing');
    assert.ok(visibleStrings(brand).has(translateText(language, 'Visit us in Stone Town')));
    assert.ok(!footer.includes('href="/restaurant#spice-route-cafe"'), 'Remove the old duplicate link in Explore');
    const contacts = footer.match(/<ul class="footer-contact-list">([\s\S]*?)<\/ul>/)?.[1];
    const items = [...contacts.matchAll(/<li class="footer-contact-item">([\s\S]*?)<\/li>/g)].map(match => match[1]);
    assert.equal(items.length, 4, 'Directions are the fourth Contact item');
    for (const [index, href] of [[0, `tel:${SITE.phoneTel}`], [1, `mailto:${SITE.email}`], [2, SITE.instagramUrl], [3, SITE.googleMapsUrl]]) {
      assert.ok(items[index].includes(`href="${href}"`), 'Preserve the requested Contact order');
    }
    assert.ok(items[3].includes('<svg') && visibleStrings(items[3]).has(translateText(language, 'Find us on Google Maps')));
    for (const part of [brand, items[3]]) assert.ok(part.includes('target="_blank"') && part.includes('rel="noopener noreferrer"'));
    assert.ok(!footer.includes('<iframe'), 'Keep footer directions as a lightweight link');
    if (route.startsWith('/contact')) {
      const locationLink = markup.match(/<a\b[^>]*class="text-link location-link"[^>]*>/)?.[0];
      assert.ok(locationLink?.includes(`href="${SITE.googleMapsUrl}"`), 'Use the supplied pin on the Contact page too');
    }
    if (route === '/') {
      const reviews = markup.match(/<section id="guest-reviews"[\s\S]*?<\/section>/)?.[0];
      assert.ok(reviews, 'Show the dedicated review section on the homepage');
      assert.ok(!reviews.includes('<img') && !reviews.includes('<iframe'), 'The review carousel is text only');
        assert.equal((reviews.match(/class="guest-review-card"/g) || []).length, guestReviews.length, 'Reserve space for the longest translated review');
        assert.equal((reviews.match(/class="guest-review-slide is-active" aria-hidden="false"/g) || []).length, 1, 'Show only one spacious quote at a time');
        assert.equal((reviews.match(/class="guest-review-slide" aria-hidden="true" inert=""/g) || []).length, guestReviews.length - 1, 'Inactive slides cannot be focused or read by assistive technology');
      assert.ok(reviews.includes('aria-live="polite"') && reviews.includes('aria-atomic="true"'));
      for (const phrase of ['Guest reviews', 'From the people who’ve been here', 'Previous review', 'Next review', 'Pause reviews', 'Read Google reviews', 'Read Tripadvisor reviews']) {
        assert.ok(visibleStrings(reviews).has(translateText(language, phrase)));
      }
      assert.ok(visibleStrings(reviews).has(translateText(language, 'Review {number} of {total}', { number: 1, total: guestReviews.length })));
      assert.equal((reviews.match(/<button /g) || []).length, 3, 'Keep previous/next controls and a small review-autoplay toggle');
      for (const source of Object.values(reviewSources)) assert.ok(reviews.includes(`href="${source.href}"`));
      assert.ok(!reviews.includes(SPICE_ROUTE_CAFE.tripAdvisorUrl), 'The cafe link belongs in its separate footer location');
    }
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
    checkReviewsAndFooter(englishMarkup, route, 'en');
    checkCafeLinks(englishMarkup, route, 'en');
    checkCampusProgramme(englishMarkup, route, 'en');
    checkCampusSpaces(englishMarkup, route, 'en');
    checkSafariPhotos(englishMarkup, route, 'en');
    checkCampusTour(englishMarkup, route, 'en');
    checkWorkshopLayout(englishMarkup, route, 'en');
    checkCampusUpdates(englishMarkup, route, 'en');
    checkHospitalityUpdates(englishMarkup, route, 'en');
    checkSocialRail(englishMarkup, route, 'en');
    checkBookingUpdates(englishMarkup, route, 'en');
    const english = visibleStrings(englishMarkup);
    assert.ok(!english.has('Accommodations'), `${route}: use singular Accommodation throughout the visible site`);
    for (const language of ['tr', 'de']) {
      const markup = await renderPage(route, language);
      checkReviewsAndFooter(markup, route, language);
      checkCafeLinks(markup, route, language);
      checkCampusProgramme(markup, route, language);
      checkCampusSpaces(markup, route, language);
      checkSafariPhotos(markup, route, language);
      checkCampusTour(markup, route, language);
      checkWorkshopLayout(markup, route, language);
      checkCampusUpdates(markup, route, language);
      checkHospitalityUpdates(markup, route, language);
      checkSocialRail(markup, route, language);
      checkBookingUpdates(markup, route, language);
      const localized = visibleStrings(markup);
      assert.doesNotMatch([...localized].join(' '), /\u2014/, 'Do not use em dashes in visible text or accessibility labels');
      if (route === '/faq') {
        const main = markup.match(/<main\b[\s\S]*?<\/main>/)?.[0];
        const headings = [...main.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/g)].map(match => decode(match[1]));
        assert.deepEqual(headings, faqSections.map(section => translateText(language, section.title)), 'Render the requested FAQ order in every language');
      }
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
  console.log('Campus programme checks passed: weekly October schedules, WhatsApp join links, festival dates and Stone Town venue links in all languages.');
  console.log('Safari checks passed: all five supplied photos, no mainland placeholders, localized captions/alt text, lazy loading and separate Sandbank & Snorkeling imagery.');
  console.log('Tour and typography checks passed: one paid daily half-day tour, supplied copy, correct CTAs, expanded Explore more and Peace Villages font roles.');
  console.log('Experience edits passed: overview-only tour description, invitation above the title, consistent Hamamni spelling and revised soap workshop facts in all languages.');
  console.log('Workshop layout checks passed: four alternating photo-and-text layouts, preserved inclusions, tailored extensions and translated guidance in all languages.');
  console.log('Campus updates passed: six clean homepage actions, expanded card 01, three tour additions, five supplied photos and complete seven-day School Camp in all languages.');
  console.log('Campus spaces and safari checks passed: all ten space cards, explicit photo placeholders, localized labels and exact Mikumi enquiry copy.');
  console.log('Hospitality checks passed: populated Explore more sections, dining photo and revised copy, direct external card links, and Kanga Africa boutique description in all languages.');
  console.log('Social rail checks passed: three preserved destinations, localized hover/accessibility labels, safe external links and route-specific surfaces.');
  console.log('Booking and programme checks passed: volunteering option, live summary data, delivery-gated next steps and three confirmed weekly photo slides.');
  console.log('Volunteering Camp checks passed: independently editable Kindness Camp copy, seven-day itinerary, menu order, booking choice and translations.');
  console.log('Excursion checks passed: four requested offers, consistent detail pages, retained links and no invented village-tour pricing.');
  console.log('Review checks passed: 11 attributed text-only excerpts, translations, requested review removal, source links, wraparound navigation and footer directions.');
} finally {
  console.warn = originalWarn;
  console.error = originalError;
  globalThis.fetch = originalFetch;
  await server.close();
}
