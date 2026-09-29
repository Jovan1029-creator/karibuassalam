import React from 'react';
import { PassThrough } from 'node:stream';
import { renderToPipeableStream } from 'react-dom/server';
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
    let html = '';
    const output = new PassThrough();
    output.on('data', chunk => { html += chunk; });
    output.on('end', () => resolve(html));
    output.on('error', reject);
    const stream = renderToPipeableStream(
      <LanguageProvider initialLanguage={language}>
        <MemoryRouter initialEntries={[route]}><App /></MemoryRouter>
      </LanguageProvider>,
      { onAllReady() { stream.pipe(output); }, onError: reject },
    );
  });
}
