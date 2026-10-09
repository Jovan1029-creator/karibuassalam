# Homepage review excerpts

`src/data/guestReviews.js` contains the manually curated carousel. It is not a
live feed or an exhaustive import. No API keys or Supabase setup are needed.

## Sources

- Google: the user supplied review text in the conversation and its expanded
  text attachment on 9 October 2026. The ten supplied authors are represented,
  including Lamaar Malik's critical feedback with a separately labelled excerpt
  of the owner's response. Review text is not inferred from owner replies.
- Tripadvisor: two short excerpts from the Assalam Community Foundation listing,
  checked on 9 October 2026. Seren P: 6 September 2025; A Tailor: 15 October 2024.
  The source link is in `SITE.foundationTripAdvisorUrl`.
- The Spice Route Cafe is a different venue. Its Tripadvisor rating remains in
  its own cafe panel and is not used as a Foundation or resort rating.

## Editing

Keep each excerpt faithful to the original and clearly attributed. Add the
matching Turkish and German translations to `translations/reviews2026.js`.
Translated excerpts are labelled in the interface. Do not turn a critical
review into a positive testimonial by removing the substance of its feedback.

Preserve author names as supplied. Add an ISO `date` only when an exact
publication date is known. Relative dates and copied star glyphs are not used
to infer publication dates or star scores. Never label this as a live feed.

The two source links lead to the full Foundation listings. Footer directions and
the Contact page use the user-supplied `SITE.googleMapsUrl`. The Stone Town link
under the footer brand leads directly to the cafe's separate Tripadvisor page.

Run `npm run test:i18n` and `npm run build` after changes.
