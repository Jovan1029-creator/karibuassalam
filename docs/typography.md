# Typography

Reference: [Peace Villages](https://www.peacevillages.com/), checked 24 October 2026.

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
| Page title | `.headline` | `clamp(2.5rem, 5.4vw, 5.75rem)` |
| Section title | `.headline`, mobile `.home-heading` | Same as page title; up to 640px: `clamp(2.35rem, 11vw, 3.1rem)` |
| Card title | Village-card heading | `clamp(1.65rem, 2.5vw, 2.35rem)`, line height 1.02 |
| Featured activity | Intro heading | `clamp(1.9rem, 2.8vw, 3.2rem)` |
| Review quote | Editorial introduction | `clamp(1.75rem, 2.5vw, 2.8rem)`, line height 1.08 |
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

The Ramadan Camp introduction also follows the reference's "Local wisdom"
section, inspected 27 October 2026: equal desktop columns, a tall unframed photo
on the left, and a vertically centred title, serif standfirst and body copy on
the right. At 1024px and above the column gap is 4rem and the photo is at least
42rem tall. Smaller screens stack the photo before the copy.

This composition uses `--text-editorial-title` (`clamp(3rem, 5.5vw, 6.2rem)`,
line height .91, tracking -.045em), the existing quote scale for its standfirst,
and `--text-editorial-body` (`clamp(1rem, 1.2vw, 1.15rem)`, line height 1.8).
The title switches to the reference's mobile heading scale up to 640px. The
original description and booking action are preserved, with no text over the
photo except its small location caption.

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
