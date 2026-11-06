# Karibu Assalam Frontend Rebuild

Production-ready React + Vite website for **Karibu Assalam**, built from local assets in `pics/` and constrained to the provided facts.

## How To Run

1. `npm install`
2. `npm run dev`
3. `npm run build`

Vercel deploys `main` automatically. `vercel.json` supplies the SPA fallback so
direct links and refreshes on routes such as `/booking` reach React Router.
After deployment, check page URLs as well as static assets on the public URL.

## Request delivery and email

Public forms default to **direct handoff**: visitors prepare their request, then
send it through WhatsApp or their email app. The form itself sends no email.
WhatsApp goes to **+255 776 143 285**; email links go to **camps@vassalam.org**.

Keep `VITE_BOOKING_DELIVERY=direct` (or leave it unset) while the Supabase project
is unavailable. Draft details remain in the form until the visitor sends the
prepared message. The interface never reports a prepared message as delivered.

## Supabase Setup

To enable database submission, verify the Supabase project and then set these
Vite environment variables before rebuilding:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_BOOKING_DELIVERY=database
```

Setup steps:

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Copy `.env.example` to `.env` and add your project URL + anon key.
4. Create staff users in Supabase Auth.
5. Add each staff user to `public.staff_profiles` using the SQL note at the bottom of `supabase/schema.sql`.

Rerun `supabase/schema.sql` after pulling schema updates. It is idempotent and enables Realtime updates for the booking inbox.

The admin dashboard uses browser local storage if Supabase is not configured.
In database delivery mode, failed submissions can also fall back to an unsent
local draft. Database saves do not send email notifications.

Local fallback is an unsent draft, not confirmation that the team received a request. If the database cannot be reached, the booking form keeps the guest's details and shows prefilled WhatsApp and email links next to the error. It also preserves the handoff when browser storage is blocked or full.

Run `npm run test:booking` to check confirmed delivery, network failure, a rejected insert, and unavailable browser storage using a stubbed transport. These checks do not create real bookings.

If submissions fail with `ENOTFOUND` or `ERR_NAME_NOT_RESOLVED`, check that the Supabase project is active and its project URL matches the environment configuration. A frontend change cannot restore an unavailable Supabase project. After updating environment variables, restart the local Vite server; deployed builds need to be rebuilt with the corrected configuration.

## Content Editing Guide

- Retreat content model: `src/data/retreats.js`
- FAQ content: `src/data/faq.js`
- Brand/contact settings (name, WhatsApp, email, tagline): `src/data/siteConfig.js`
- UI language labels (English / Turkish / German toggle labels for navigation/common UI): `src/data/i18n.js`

## Image Usage

- All local images are loaded from the existing workspace `pics/` directory.
- No external images are required.

## Booking Integrations

- Booking form:
  - Public route: `/booking`
  - Prepares a WhatsApp or email message by default, with explicit send instructions
  - Saves requests to Supabase only with `VITE_BOOKING_DELIVERY=database`
  - Clearly identifies failed database delivery and offers direct WhatsApp/email links
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
- The Spice Route Cafe's Tripadvisor details live in `SPICE_ROUTE_CAFE` in the same file.
  - Its rating belongs to the Stone Town cafe, not the Kizimkazi eco-resort.
  - It is a dated, manually checked snapshot, not a live feed. Recheck the linked listing and update `rating`, `reviewCount`, and `checkedAt` together.
  - The cafe appears in the Experiences cards and at `/restaurant#spice-route-cafe`. Tripadvisor, Instagram, and these card links open in new tabs.
  - Leave the resort's separate `SITE.tripAdvisorUrl` empty until its own verified listing is supplied.
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
