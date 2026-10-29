# Typography

Reference: [Peace Villages](https://www.peacevillages.com/), checked 24 October 2026. Sitewide layout and sizing pass: 29 October 2026.

Use upright **Cormorant Garamond 600** for editorial headings and **Inter** for
body copy and controls. The reference uses two main families; mono utilities
and map fallbacks are not additional brand fonts. Do not reintroduce Caveat,
El Messiri, decorative italic headings or heavy introductory paragraphs.

## Shared size and style mapping

The tokens in `src/styles.css` apply across pages, retreat showcases, cards,
reviews and the programme. Layouts, colours and branding remain Karibu Assalam's.

| Role | Reference treatment | Shared value |
| --- | --- | --- |
| Home hero | Home headline | `clamp(3.1rem, 12.5vw, 5.25rem)`; from 1024px: `clamp(3.8rem, 5vw, 6rem)` |
| Page title | `.headline` | `clamp(2.5rem, 4.5vw, 4.75rem)` |
| Section title | `.headline`, mobile `.home-heading` | `clamp(2rem, 3.5vw, 3.75rem)`; up to 640px: `clamp(1.9rem, 8vw, 2.5rem)` |
| Card title | Village-card heading | `clamp(1.65rem, 2.5vw, 2.35rem)`, line height 1.02 |
| Featured activity | Intro heading | `clamp(1.9rem, 2.8vw, 3.2rem)` |
| Review quote | Editorial introduction | `clamp(1.4rem, 1.8vw, 1.85rem)`, line height 1.3 |
| Body | Regular Inter | `1rem`, paragraph line height 1.65 |
| Lead paragraph | `.body-lg` | `clamp(1.05rem, 1.4vw, 1.3rem)`, line height 1.65 |
| CTA | `.button` | `.75rem`, 700, uppercase, `.08em` tracking |
| Desktop navigation | Header links | `.74rem`, 700, uppercase, `.095em` tracking |
| Eyebrow | `.eyebrow` | `.68rem`, 700, uppercase, `.18em` tracking |

Headings use tight negative tracking and line heights around 1. Small utility
labels, captions and form fields retain readable interface sizes. Buttons keep
their touch targets even though their lettering is smaller. Handwritten section
class names remain for compatibility, but use the upright editorial typeface.
The review carousel still sizes its shared grid to the longest quote, so it
does not shrink or jump when reviews rotate.

## Editorial split layout

Every interior page uses the shared `Hero` composition: photograph on the left,
title and description on the right on desktop, stacked photo first below 1024px.
The home slideshow retains its full-width photographs and existing controls.

The font families follow the reference, with contextual sizes adapted to the
available column width. Section headings have wider measures, and narrow-column
titles use the feature scale. Headings wrap at word boundaries. Full descriptions
stay in normal flow without line clamps.

Photographs in introductions, showcase rows and room/stay sections preserve their
complete frame. The Campus Life grid and portrait cards use contained photographs;
gallery viewers still open the original full-size image. Selected additional
photographs and source links are in `pics/site-marketing/october-albums/`.
The swing is no longer used in active page components.

Reviews keep all slides in one overlapping grid to reserve the longest quote's
height while rotating. The title and quote scales are smaller than a full-width
page title. The floating contact dock retains its curved labels at a smaller
phone size, without the tooltip obscuring content.

Accommodation's bathroom, shower, balcony/terrace and A/C icons are a labelled,
non-interactive list matching the homepage facility illustrations.

## Local font delivery

`src/fonts.css` loads the same WOFF2 files used by the reference. Files live in
`public/fonts`, with Latin and Latin Extended subsets covering English, German
and Turkish. The two Latin files are preloaded by `index.html`; the additional
subsets load when needed. No Google Fonts connection is required at runtime.

Both families are distributed under SIL Open Font License 1.1. Keep the
`Inter-OFL.txt` and `CormorantGaramond-OFL.txt` licences beside the font files.

Source prefix: `https://www.peacevillages.com/_next/static/media/`

| Local file | Original source filename |
| --- | --- |
| `inter-latin.woff2` | `83afe278b6a6bb3c-s.p.2bn3s6zvc0dyp.woff2` |
| `inter-latin-ext.woff2` | `1bffadaabf893a1e-s.3-6t-g6q0vh0a.woff2` |
| `cormorant-garamond-latin.woff2` | `01e4147cff8141ee-s.p.3huc2loe0ie8a.woff2` |
| `cormorant-garamond-latin-ext.woff2` | `1f9e983605289f29-s.3aak_kra40y8r.woff2` |

## Evidence and checks

The reference's [font declarations](https://www.peacevillages.com/_next/static/chunks/2jk41gzisn8wp.css)
and [typography rules](https://www.peacevillages.com/_next/static/chunks/3xlgickl6thd8.css)
provide the values above. Stylesheet hashes can change with deployments.

Run `npm run test:typography` to check local font delivery, shared styles and
responsive size tokens. Run `npm run test:i18n` for route and translation coverage
and `npm run test:gallery` for the stable review layout and gallery behaviour.
