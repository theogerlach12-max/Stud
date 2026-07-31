# Stud — Shopify theme

A Shopify Online Store 2.0 theme for Stud, magnetic diamond studs for men who
play sports. Three colours only: **matte black `#121212`, stark white `#FFFFFF`,
metallic silver `#B4BABF`**.

The home page is a single long-scroll landing page with no nav links. The top
half is black, the bottom half is white, and the page fades between the two as
you scroll rather than cutting.

## Page order

| # | Section file | Tone | Does |
|---|---|---|---|
| 1 | `landing-hero.liquid` | black | Full-bleed photograph, headline, star rating, "Save 10%" |
| 2 | `landing-marquee.liquid` | black | Right-to-left scrolling row of publication logos |
| 3 | `landing-media-accordion.liquid` | black | "To be the best…" — photo left, expandable copy right |
| 4 | `landing-tone-shift.liquid` | black → white | Fades to white with the diamond clip playing behind it |
| 5 | `landing-sizing.liquid` | white | The sizes (5mm and 6mm), then the CTA |
| 6 | `landing-media-accordion.liquid` | white | "Piercings and sports don't mix" — photo **right**, copy left |
| 7 | `landing-social.liquid` | white | "Why do something permanent…" rotating photo carousel |
| 8 | `landing-tone-shift.liquid` | white → black | Fades back down into the footer |

Sections 3 and 6 are the same section type used twice with `Image side` flipped.
Sections 4 and 8 are the same tone-shift section with the direction reversed.
Copy lives in `templates/index.json` and is editable in **Customize**.

## Brand

- **Wordmark**: the supplied STUD artwork ships as `assets/logo-stud.png` — black
  ink, transparent background, trimmed to the letterforms. Used as-is on the
  white header and flipped to white with `filter: invert(1)` in the footer, so
  one file covers both. Swap it under **Theme settings → Logo**.
- **Type**: headlines use a neo-grotesque stack (`Helvetica Neue → Helvetica →
  Inter → Segoe UI → Arial`) at weight 800, the same family the wordmark is cut
  from. Set in `layout/theme.liquid` as `--font-grotesque` / `--font-display`.
- **Silver** is an accent only: eyebrows, small caps, star ratings, hairlines.
  Never body copy — it does not have the contrast for it on white.
- The **header stays white** against the black upper page. That inversion is
  deliberate.

## Press logos

The six mastheads in `assets/` (`press-gq.png`, `press-esquire.png`,
`press-complex.png`, `press-hypebeast.png`, `press-menshealth.png`,
`press-vogue.png`) came from Wikimedia Commons, where each is filed as public
domain — plain typographic wordmarks fall below the threshold of originality, so
there is no copyright in them. They were flattened to black on transparent alpha
and trimmed, then normalised to 120px tall; the marquee flips them to white with
a CSS filter and scales them by the section's logo-height setting.

Trademark still applies. Showing a masthead states that the publication covered
Stud, which is fine for genuine placements and a false-endorsement problem
otherwise.

## Photography

| File | Used in |
|---|---|
| `hero-rolls.png` | Hero (full bleed) |
| `athlete-chain.png` | "Why this exists", carousel |
| `athlete-shades.png` | 5mm size card, carousel |
| `athlete-sweater.png` | 6mm size card, carousel |
| `athlete-barber.jpg` | Stay-on, carousel |
| `athlete-vest.png` | Carousel |
| `hero-porsche.png` | unused — kept in case you want it back |

Every image slot resolves **Theme Editor image → bundled `assets/` file →
placeholder**, so the theme looks finished before a store exists and picking an
image in Customize silently takes over.

**These photos are not licensed.** Fine for a mockup, a real problem the day the
store takes payments. Replace them with your own shoot before launch.

## Motion

- **Scroll reveal** — sections ease up into place as they enter the viewport
  (`[data-reveal]`, `initReveal` in `theme.js`).
- **Header** — retracts on scroll down, returns on scroll up
  (`initHeaderScroll`).
- **Press marquee** — loops continuously, with no rules above or below so it
  floats in the gap between sections.
- **Announcement bar** — cycles through the messages set in Customize, fading
  one out as the next fades in. Messages are stacked in a grid cell so the bar
  never changes height.
- **Tone transition** — the black → white band plays `diamond-man.mp4` behind
  the fade, desaturated to match the palette. The clip is 0.3s, so it runs at
  0.4x (**Playback speed** in the section) to slow the loop. The gradient is
  opaque at both ends and clear through the middle, so the footage only shows in
  the gap and neither join is visible.
- **Photo carousel** — drifts right to left forever. Each card is turned away
  from the viewer at the edges, squares up as it crosses the middle, and turns
  the other way as it leaves; the angle is a function of distance from centre
  (`CAROUSEL_MAX_ANGLE`, `turnCards`). The row is duplicated so the loop is
  seamless, and the drift pauses on hover or keyboard focus.
- All of the above no-op under `prefers-reduced-motion`; the carousel falls back
  to a plain scroll-snap row.

## Uploading to Shopify

1. Zip the **contents** of this folder (`layout/`, `sections/`, `templates/`…
   at the zip's top level). `stud-theme.zip` here is a pre-built copy.
2. Shopify Admin: **Online Store → Themes → Add theme → Upload zip file**.
3. **Customize** to preview, **Publish** to go live.

Or `shopify theme push` with the CLI once a store exists.

## Before you publish

- **The "Save 10%" buttons have no destination.** The on-page email signup was
  removed, so each button needs a URL: **Customize → [section] → Button link**.
  Four places — hero, sizing, stay-on, carousel — plus the header and sticky
  bar under **Header**.
- **The review count is empty on purpose.** The stars in the hero do not render
  until you fill in **Customize → Hero → Review count**. Publishing a review
  count you don't have is what the FTC's fake-review rule covers.
- **Highsnobiety has no logo file.** The other six mastheads ship in `assets/`
  as `press-*.png`. Highsnobiety is not on Wikimedia Commons, so it renders as
  text until you supply artwork: drop a PNG in `assets/` and name it in
  **Customize → Press marquee → Highsnobiety → Bundled logo filename**.
- **The video is not in `stud-theme.zip`.** Shopify's Admin zip upload rejects
  video in `assets/`, so `diamond-man.mp4` is in the repo but excluded from the
  zip. Either push with the Shopify CLI, or upload the clip under
  **Content → Files** and pick it in **Customize → Tone transition → Video**.
- **Claims to verify**: the 10% offer and the material and sizing copy
  throughout. Confirm each against your supplier and your actual policies.

## Local preview

`..\Stud-preview\build_preview.py` renders a static approximation of the landing
page from `templates/index.json` and `assets/base.css`, so the design can be
checked in a browser without a Shopify store:

```
python ..\Stud-preview\build_preview.py
```

Then open `..\Stud-preview\preview.html`. It is a mockup — buttons do nothing,
and it fills in the review count so the lockup can be judged.

## Structure

Standard Shopify OS 2.0 — `layout/theme.liquid`, `sections/`, `snippets/`,
`templates/*.json`, `config/settings_schema.json`, `locales/en.default.json`.
Product, collection, cart, blog, search and account templates are all still
there and styled, ready for when there is something to sell.
