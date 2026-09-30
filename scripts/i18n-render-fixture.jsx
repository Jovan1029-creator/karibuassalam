import React from 'react';
import { PassThrough } from 'node:stream';
import { renderToPipeableStream, renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import App from '../src/App';
import { LanguageProvider } from '../src/context/LanguageContext';
import { retreats } from '../src/data/retreats';
import { experienceDetails } from '../src/data/experienceDetails';

export const routes = [
  '/', '/about', '/retreats', '/experiences', '/eco-resort', '/faq', '/contact',
  '/contact?retreat=kindness-camp', '/booking', '/admin', '/campus', '/accommodations', '/restaurant', '/whats-happening',
  ...retreats.map(item => `/retreats/${item.slug}`),
  ...experienceDetails.map(item => `/experiences/${item.type}/${item.slug}`),
  ...['events', 'volunteer', 'safari'].map(category => `/experiences/${category}`),
  '/retreats/not-found', '/experiences/not-found', '/experiences/workshops/not-found', '/not-found',
];

export function renderPage(route, language) {
  return new Promise((resolve, reject) => {
    const page = (
      <LanguageProvider initialLanguage={language}>
        <MemoryRouter initialEntries={[route]}><App /></MemoryRouter>
      </LanguageProvider>
    );
    // First resolve lazy pages. React 18's streaming encoder can flush a padding
    // NUL when a multibyte character does not fit the last byte of its buffer.
    // This is a client-rendered site, so inspect a fresh non-streaming render of
    // the resolved tree instead of asserting against those streaming artifacts.
    const output = new PassThrough();
    output.resume();
    output.on('end', () => {
      try { resolve(renderToString(page)); } catch (error) { reject(error); }
    });
    output.on('error', reject);
    const stream = renderToPipeableStream(
      page,
      { onAllReady() { stream.pipe(output); }, onError: reject },
    );
  });
}
