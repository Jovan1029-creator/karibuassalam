import React from 'react';
import { PassThrough } from 'node:stream';
import { renderToPipeableStream, renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import App from '../src/App';
import { LanguageProvider } from '../src/context/LanguageContext';
import { retreats } from '../src/data/retreats';
import { experienceDetails } from '../src/data/experienceDetails';
import BookingSummary from '../src/components/BookingSummary';
import BookingConfirmation from '../src/components/BookingConfirmation';
import { ProgrammeSlide } from '../src/components/ProgrammeSlider';
import GuestReviews, { ReviewQuote } from '../src/components/GuestReviews';
import CampusMoments, { MomentCard } from '../src/components/CampusMoments';
import Lightbox from '../src/components/Lightbox';
import { safariLightboxPhotos } from '../src/components/SafariGallery';

export function renderSafariLightbox(index, language) {
  return renderToString(<LanguageProvider initialLanguage={language}><Lightbox items={safariLightboxPhotos} index={index} onClose={() => {}} onChange={() => {}} /></LanguageProvider>);
}

export function renderCampusMoments(language) {
  return renderToString(<LanguageProvider initialLanguage={language}><CampusMoments /></LanguageProvider>);
}

export function renderMomentCard(moment, language) {
  return renderToString(<LanguageProvider initialLanguage={language}><MomentCard moment={moment} order={0} playing={false} onOpen={() => {}} /></LanguageProvider>);
}

export function renderMomentLightbox(moment, index, language) {
  return renderToString(<LanguageProvider initialLanguage={language}><Lightbox items={moment.photos.map(photo => ({ ...photo, label: moment.label }))} index={index} onClose={() => {}} onChange={() => {}} /></LanguageProvider>);
}

export function renderReviewQuote(review, language) {
  return renderToString(<LanguageProvider initialLanguage={language}><ReviewQuote review={review} /></LanguageProvider>);
}

export function renderGuestReviews(reviews, language) {
  return renderToString(<LanguageProvider initialLanguage={language}><GuestReviews reviews={reviews} /></LanguageProvider>);
}

export function renderBookingSummary(form, language) {
  return renderToString(<LanguageProvider initialLanguage={language}><BookingSummary form={form} /></LanguageProvider>);
}

export function renderBookingConfirmation(record, language) {
  return renderToString(<LanguageProvider initialLanguage={language}><BookingConfirmation record={record} /></LanguageProvider>);
}

export function renderProgrammeSlide(item, language) {
  return renderToString(<LanguageProvider initialLanguage={language}><MemoryRouter><ProgrammeSlide item={item} /></MemoryRouter></LanguageProvider>);
}

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
