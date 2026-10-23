# October campus photo update

The 14 numbered originals in `pics/new` were inspected visually. They remain
unchanged. The website uses optimized WebP copies in
`pics/site-marketing/campus-2026`, with 640px thumbnails and full images up to
1600px on the longest edge. No image is upscaled.

| Original number | Verified subject | Placement |
| --- | --- | --- |
| 01 | Reading beside the ocean | Campus Life gallery |
| 02 | Community celebration | Campus Life gallery |
| 03 | Guests in the shaded courtyard | Campus Life gallery |
| 04 | Preparing food baskets | Campus Life gallery and Volunteering Camp preview/hero |
| 05 | Mother Language Day dancing | Campus Life gallery |
| 06 | School gathering | Campus Life gallery |
| 07 | Guest bedroom | Accommodation, eco-resort, retreats, homepage room collection |
| 08 | Student gardening | Campus Life gallery and International School card |
| 09 | Mother Language Day performance | Campus Life gallery |
| 11 | Mosque interior | Campus mosque card |
| 12 | Sufi Festival performance | Special-event cards |
| 14 | Restaurant meal service | Restaurant page and campus restaurant card |
| 15 | Hands holding finished soaps | Hamamni workshop detail and eco-resort card |
| 16 | Guests on a guided spice garden visit | City & Spice excursion card and detail-page hero |

Photo 16 was supplied as `pics/new/16-tours-spice-city.jpg`, from
[the supplied Tours (Spice & City) Drive file](https://drive.google.com/file/d/1zTvKSMjmhG1NxFVegQO89bmo4wn09sWN/view?usp=share_link).
The existing Stone Town image remains in the tour's "What is included" section.

## Conflicting or missing sources

- The file numbered 11 was labelled mosque, festival and boutique in the
  messages. Its actual subject is the mosque, not the boutique.
- The file numbered 09 was labelled mosque in the messages but shows a school
  performance. The converted copy is rotated clockwise to display upright.
- Files numbered 10 and 13 were not supplied. No substitute is presented as
  those photographs.
- Boutique now uses `campus-boutique.webp`; Vocational Training Workshop uses
  `carpentry-workshop.webp`. These were selected from the separately supplied
  marketing download folder and visually checked against the actual spaces.
  Their card titles and non-clickable layout are preserved. Source filenames are
  recorded in `pics/site-marketing/README.md`.

## Regeneration

Run `./scripts/prepare-campus-photos.ps1` with FFmpeg and FFprobe installed.
The HEIF files are tiled: the script assembles the full primary tile grid,
crops to its recorded dimensions and then resizes. Exporting only the first
HEIF video stream would produce an incomplete 512px tile.

Review converted images after regeneration, especially orientation. Captions
and alt text are in `src/data/campusGallery.js`; translations are in
`src/data/translations/gallery2026.js`.
