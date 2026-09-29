import assert from 'node:assert/strict';
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
  const { SITE, SPICE_ROUTE_CAFE } = await server.ssrLoadModule('/src/data/siteConfig.js');
  assert.notEqual(SITE.tripAdvisorUrl, SPICE_ROUTE_CAFE.tripAdvisorUrl, 'Cafe reviews must not be attributed to the resort');
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
    const english = visibleStrings(englishMarkup);
    for (const language of ['tr', 'de']) {
      const markup = await renderPage(route, language);
      checkCafeLinks(markup, route, language);
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
} finally {
  console.warn = originalWarn;
  console.error = originalError;
  globalThis.fetch = originalFetch;
  await server.close();
}
