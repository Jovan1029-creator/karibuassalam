import assert from "node:assert/strict";
import { after, test } from "node:test";
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { createServer } from "vite";
import { schedulePhotoChange } from "../src/utils/photoRotation.js";
import { reviewReadingTime, scheduleReviewAdvance } from "../src/utils/reviewAutoplay.js";
import { translateText } from "../src/data/i18n.js";

const server = await createServer({
  mode: "test", logLevel: "silent", server: { middlewareMode: true }, appType: "custom",
});
after(() => server.close());
const { campusMoments } = await server.ssrLoadModule("/src/data/campusMoments.js");
const { renderCampusMoments, renderMomentCard, renderMomentLightbox, renderSafariLightbox } = await server.ssrLoadModule("/scripts/i18n-render-fixture.jsx");
const { safariGalleryPhotos } = await server.ssrLoadModule("/src/data/safariPhotos.js");

function fakeRotation({ index = 0, count = 3, decode } = {}) {
  const pending = new Map();
  const requests = [];
  const changed = [];
  let timerId = 0;
  const stop = schedulePhotoChange({
    photos: Array.from({ length: count }, (_, i) => ({ image: `/photo-${i}.webp` })),
    index, delay: 7000, onReady: next => changed.push(next),
    createImage: () => {
      const image = { decode: decode || (() => Promise.resolve()) };
      requests.push(image);
      return image;
    },
    schedule: (callback, delay) => { assert.equal(delay, 7000); pending.set(++timerId, callback); return timerId; },
    cancel: id => pending.delete(id),
  });
  const tick = () => {
    const entry = pending.entries().next().value;
    assert.ok(entry, "A change is scheduled");
    pending.delete(entry[0]);
    entry[1]();
  };
  return { pending, requests, changed, tick, stop };
}

test("only advance after the next photo loads and decodes, then wrap", async () => {
  let finishDecode;
  const rotation = fakeRotation({ index: 2, decode: () => new Promise(resolve => { finishDecode = resolve; }) });
  assert.equal(rotation.requests.length, 0, "No eager download before the delay");
  rotation.tick();
  assert.equal(rotation.requests[0].src, "/photo-0.webp");
  const loading = rotation.requests[0].onload();
  assert.deepEqual(rotation.changed, [], "Keep the old photo while decoding");
  finishDecode();
  await loading;
  assert.deepEqual(rotation.changed, [0]);
  rotation.stop();
});

test("pausing cancels both the timer and a pending image decode", async () => {
  const waiting = fakeRotation();
  waiting.stop();
  assert.equal(waiting.pending.size, 0);
  assert.equal(waiting.requests.length, 0);

  let finishDecode;
  const loading = fakeRotation({ decode: () => new Promise(resolve => { finishDecode = resolve; }) });
  loading.tick();
  const load = loading.requests[0].onload();
  loading.stop();
  finishDecode();
  await load;
  assert.deepEqual(loading.changed, [], "An old load cannot advance a paused/unmounted card");
  assert.equal(loading.requests[0].onload, null);
  assert.equal(loading.requests[0].onerror, null);
});

test("failed photos are skipped without replacing the current image", async () => {
  const rotation = fakeRotation();
  rotation.tick();
  rotation.requests[0].onerror();
  assert.deepEqual(rotation.changed, []);
  rotation.tick();
  assert.equal(rotation.requests[1].src, "/photo-2.webp");
  await rotation.requests[1].onload();
  assert.deepEqual(rotation.changed, [2]);
  rotation.stop();
});

test("decode failures and exhausted collections stop safely", async () => {
  const rotation = fakeRotation({ decode: () => Promise.reject(new Error("Unreadable image")) });
  rotation.tick();
  await rotation.requests[0].onload();
  rotation.tick();
  await rotation.requests[1].onload();
  assert.equal(rotation.pending.size, 0, "Do not retry broken assets endlessly");
  assert.deepEqual(rotation.changed, []);
  rotation.stop();
  for (const count of [0, 1]) {
    const staticCollection = fakeRotation({ count });
    assert.equal(staticCollection.pending.size, 0);
    staticCollection.stop();
  }
});

test("seven collections fill the original mosaic with a new craft tile", () => {
  assert.deepEqual(campusMoments.map(item => item.id), ["learning", "craft", "coast", "rooms", "community", "meals", "nature"]);
  assert.deepEqual(campusMoments.slice(0, 3).map(item => item.className), ["moment-card-tall", "moment-card-tall", "moment-card-wide"]);
  for (const moment of campusMoments) {
    assert.ok(moment.photos.length >= 3 && moment.photos.length <= 5);
    assert.equal(new Set(moment.photos.map(photo => photo.image)).size, moment.photos.length);
    for (const photo of moment.photos) {
      const path = resolve(decodeURIComponent(photo.image).replace(/^\//, ""));
      assert.ok(path.startsWith(resolve("pics")), "Use supplied local assets");
      assert.ok(statSync(path).size > 0, `Missing photo: ${path}`);
      assert.ok(photo.alt.length > 15, "Every image has a useful description");
    }
  }
  assert.deepEqual(campusMoments.find(item => item.id === "meals").photos.map(photo => photo.image.split("/").at(-1)), [
    "food-1-enhanced.webp", "fresh-shared-meal.webp", "oceanfront-dining.webp", "swahili-kitchen.webp",
  ]);
});

test("gallery and every collection/lightbox photo render in all three languages", () => {
  for (const language of ["en", "tr", "de"]) {
    const html = renderCampusMoments(language);
    assert.equal([...html.matchAll(/class="moment-card(?:\s|\")/g)].length, 7);
    assert.equal([...html.matchAll(/<img\b/g)].length, 7, "Only seven photos render initially, not the entire library");
    assert.ok(html.includes("moments-hint"));
    assert.ok(!html.includes("moments-playback"), "Do not show a photo-rotation control");
    assert.equal([...html.matchAll(/<button\b/g)].length, 7, "Only the seven photo collection buttons remain");
    assert.ok(!html.includes('aria-live="polite"'), "Do not announce continuous automatic changes");
    for (const moment of campusMoments) {
      assert.ok(html.includes(translateText(language, moment.label)));
      for (const [index, photo] of moment.photos.entries()) {
        const translatedAlt = translateText(language, photo.alt);
        if (language !== "en") assert.notEqual(translatedAlt, photo.alt);
        const card = renderMomentCard({ ...moment, photos: [photo] }, language);
        assert.ok(card.includes('loading="lazy"') && card.includes('type="button"'));
        const lightbox = renderMomentLightbox(moment, index, language);
        assert.ok(lightbox.includes(`src="${photo.image}"`), "Open the exact selected photo");
        assert.ok(lightbox.includes('role="dialog"') && lightbox.includes('aria-modal="true"'));
        assert.equal([...lightbox.matchAll(/<img\b/g)].length, 1);
      }
    }
  }
});

test("every safari photo opens in the shared viewer with its own caption and navigation", () => {
  for (const language of ["en", "tr", "de"]) {
    for (const [index, photo] of safariGalleryPhotos.entries()) {
      const html = renderSafariLightbox(index, language);
      assert.ok(html.includes(`src="${photo.src}"`), "Open the chosen photo, including the first photo at index zero");
      assert.ok(html.includes(translateText(language, photo.label)), "Show the selected photo's caption");
      assert.ok(html.includes('role="dialog"') && html.includes('aria-modal="true"'));
      for (const control of ["Close", "Previous slide", "Next slide"]) {
        assert.ok(html.includes(translateText(language, control)));
      }
      const counter = html.match(/class="lightbox-count">([\s\S]*?)<\/span>/)?.[1];
      assert.equal(counter?.replace(/<!--[\s\S]*?-->/g, ""), `${index + 1} / 3`);
    }
  }
});

test("responsive styles retain the tall-pair and wide-photo mosaic on phones and desktop", () => {
  const css = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
  const tablet = css.slice(css.indexOf("@media (max-width: 960px)"), css.indexOf("@media (max-width: 700px)", css.indexOf("@media (max-width: 960px)")));
  assert.match(css, /\.moments-grid\s*\{[^}]*repeat\(5, minmax\(0, 1fr\)\)[^}]*grid-auto-rows: 12rem/s);
  assert.match(tablet, /\.moments-grid\s*\{[^}]*repeat\(2, minmax\(0, 1fr\)\)[^}]*grid-auto-rows: 10rem/s);
  assert.match(css, /\.moment-card-tall\s*\{\s*grid-row: span 2;/);
  assert.match(css, /\.moment-card-wide\s*\{\s*grid-column: span 2;/);
  assert.equal([...css.matchAll(/\.moments-grid\s*\{[^}]*grid-template-columns:/g)].length, 2, "No single-column phone override");
  assert.ok(!tablet.includes(".moment-card-tall,"), "Keep both spans on small screens");
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)\s*\{\s*\.moment-photo-enter \{ animation: none;/);
  assert.ok(!css.includes(".moment-card span {"), "Caption positioning must not affect counters/zoom controls");
});

test("review autoplay gives longer quotes more reading time and wraps to the first", () => {
  assert.equal(reviewReadingTime("Lovely place."), 8000);
  assert.equal(reviewReadingTime("word ".repeat(60)), 22000);
  assert.equal(reviewReadingTime("word ".repeat(200)), 30000);
  let advance;
  let next;
  let cancelled;
  const stop = scheduleReviewAdvance({
    enabled: true, count: 11, index: 10, text: "Lovely place.", onAdvance: value => { next = value; },
    schedule: (callback, delay) => { assert.equal(delay, 8000); advance = callback; return 7; },
    cancel: timer => { cancelled = timer; },
  });
  assert.equal(next, undefined, "Wait before changing a quote");
  advance();
  assert.equal(next, 0, "The final review wraps to the first");
  stop();
  assert.equal(cancelled, 7, "Cleanup cancels the current timer");
});

test("review slides share one grid cell so changing quotes cannot shrink the panel", () => {
  const css = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
  assert.match(css, /\.guest-review-slides\s*\{\s*display: grid;/);
  assert.match(css, /\.guest-review-slide\s*\{[^}]*grid-area: 1 \/ 1;[^}]*visibility: hidden;/);
  assert.match(css, /\.guest-review-slide\.is-active\s*\{\s*visibility: visible;/);
  assert.match(css, /\.guest-review-slide blockquote\s*\{\s*flex: 1;/, "Keep attribution and controls at a steady position");
});

test("review autoplay does not schedule when paused, out of view, or with fewer than two quotes", () => {
  for (const options of [{ enabled: false, count: 11 }, { enabled: true, count: 0 }, { enabled: true, count: 1 }]) {
    const stop = scheduleReviewAdvance({
      ...options, index: 0, text: "A review", onAdvance: () => assert.fail("Must not advance"),
      schedule: () => assert.fail("Must not schedule a timer"),
    });
    stop();
  }
});
