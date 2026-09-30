# Typography

Reference: https://www.peacevillages.com/, checked 30 September 2026.
The public stylesheets declare two main font families, not three:
Inter for body/interface copy and Cormorant Garamond 600 for h1–h3/editorial titles.
Mono utilities and map fallbacks are not additional brand fonts.

Karibu Assalam uses those same two families through `--font-body` and
`--font-heading` in `src/styles.css`. Handwritten section classes retain their
names for compatibility but now use Cormorant Garamond, as does the landing hero.
Do not reintroduce Caveat or El Messiri overrides.

- Body: 1rem Inter, 1.7 paragraph line height.
- Leads: clamp(1.05rem, 1.4vw, 1.3rem), line height 1.65 (reference rule).
- Editorial titles: Cormorant Garamond 600, tight tracking and line height.
- Headings/cards/hero: use `--text-h1`, `--text-h2`, `--text-h3`, `--text-hero`;
  sizes stay fluid but capped to fit this site's cards and translated titles.
- Navigation, buttons, labels and form fields: Inter. Eyebrows use uppercase,
  0.18em tracking and 700 weight, following the reference's treatment.

Evidence: `/_next/static/chunks/2jk41gzisn8wp.css` contains the font declarations;
`/_next/static/chunks/3xlgickl6thd8.css` defines the body and h1–h3 font roles,
`.body-lg`, `.display` and `.eyebrow`. Hashes can change with deployments.
