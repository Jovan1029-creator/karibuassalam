# Karibu Assalam Frontend Rebuild

Production-ready React + Vite website for **Karibu Assalam**, built from local assets in `pics/` and constrained to the provided facts.

## How To Run

1. `npm install`
2. `npm run dev`
3. `npm run build`

## Supabase Setup

The booking system uses Supabase when these Vite environment variables exist:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Setup steps:

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Copy `.env.example` to `.env` and add your project URL + anon key.
4. Create staff users in Supabase Auth.
5. Add each staff user to `public.staff_profiles` using the SQL note at the bottom of `supabase/schema.sql`.

Rerun `supabase/schema.sql` after pulling schema updates. It is idempotent and enables Realtime updates for the booking inbox.

Without those variables, `/booking` and `/admin` use browser local storage as a fallback.

## Content Editing Guide

- Retreat content model: `src/data/retreats.js`
- FAQ content: `src/data/faq.js`
- Brand/contact settings (name, WhatsApp, email, tagline): `src/data/siteConfig.js`
- UI language labels (English / Turkish / German toggle labels for navigation/common UI): `src/data/i18n.js`

## Image Usage

- All local images are loaded from the existing workspace `pics/` directory.
- No external images are required.

## Booking Integrations

- Structured booking form:
  - Public route: `/booking`
  - Saves booking requests to Supabase when configured
  - Falls back transparently to browser local storage when Supabase is missing or unreachable
  - Prompts guests to send the prepared WhatsApp or email handoff if cloud sync is unavailable
  - Adds automated priority, room estimate, next action, and reply draft
- Operations dashboard:
  - Local admin route: `/admin`
  - Tracks booking status from `new` through `confirmed`
  - Requires Supabase staff sign-in when Supabase is configured
  - Refreshes on Supabase Realtime changes, with a quiet 30-second polling fallback
  - Includes sample inquiry creation for workflow testing
- WhatsApp number is configured in `src/data/siteConfig.js` as:
  - `SITE.whatsAppPhone` (used for `wa.me`)
  - `SITE.phoneDisplay` / `SITE.phoneTel` (display + click-to-call)
- Email address is configured in `src/data/siteConfig.js` as `SITE.email`
- Contact URL builders live in `src/utils/contact.js`
- Future backend integration point:
  - Replace `sendEmailApiStub()` in `src/utils/contact.js` with a real API call
  - Replace local storage helpers in `src/utils/bookingAutomation.js` with database/API calls
  - Add staff login protection before exposing `/admin` in production

## SEO Notes

- Route-level titles and descriptions are set in each page via `src/components/SEO.jsx`
- OpenGraph tags (`og:title`, `og:description`, `og:image`, `og:type`) are updated client-side

## Accessibility + Performance Checklist

### Accessibility

- [x] Meaningful alt text added for content images
- [x] Skip link included (`Skip to main content`)
- [x] Visible focus outlines with `:focus-visible`
- [x] Keyboard-accessible accordion buttons with `aria-expanded`
- [x] Form labels connected to inputs on Contact page
- [x] Mobile nav and Eco-Village submenu work with keyboard controls
- [x] No dead `Tours` or `Volunteer` navigation links

### Performance

- [x] Local assets used only from `pics/`
- [x] WebP used where available
- [x] Non-hero images use `loading="lazy"` and `decoding="async"`
- [x] No heavy UI or animation libraries added
- [x] CSS-based visual effects used instead of runtime animations

## Admin Note (Brand Naming)

`Karibu Assalam` is used as the primary public-facing brand across the site for consistency and clarity. `Assalam Community Foundation` is referenced in About/impact sections as the nonprofit entity, matching the provided facts.
