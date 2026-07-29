# Stud — Shopify theme

A Shopify Online Store 2.0 theme for Stud, magnetic diamond studs for men who
play sports. Black and white: white background, black type, no accent colour.

The home page is a **single long-scroll landing page** with no nav links. It is
currently a **pre-launch email capture** — there is no pricing section and no
add-to-cart on the page. Every call to action points at `#signup`, the email
form in the footer, offering 10% off on launch day.

## Page order

| # | Section file | Does |
|---|---|---|
| 1 | `sections/landing-hero.liquid` | Split hero: headline, star rating and "Save 10%" on the left, photograph on the right |
| 2 | `sections/landing-marquee.liquid` | Right-to-left scrolling row of publication names |
| 3 | `sections/landing-media-accordion.liquid` | "Why this exists" — photo left, expandable copy right |
| 4 | `sections/landing-sizing.liquid` | The 3 sizes, then the CTA |
| 5 | `sections/landing-media-accordion.liquid` | Stay-on / easy on / off — photo left, expandable copy right, black background |
| 6 | `sections/landing-social.liquid` | "Why do something permanent when you don't have to?" photo carousel |
| 7 | `sections/landing-final-cta.liquid` | Repeat the offer |

Sections 3 and 5 are the same section type used twice with different copy and
`Image side` flipped. Order and content are editable in **Customize** — the copy
lives in `templates/index.json`, not hardcoded in the sections.

## Brand

- **Wordmark**: "STUD", uppercase and italic, in a neo-grotesque stack
  (`Helvetica Neue → Helvetica → Inter → Segoe UI → Arial`), weighted and
  tracked to match the HAUS reference. Set in `layout/theme.liquid` as
  `--font-grotesque`; the same stack drives every headline via `--font-display`.
  Turn it off under **Theme settings → Typography** to fall back to the Shopify
  heading font instead.
- **Colour**: `#FFFFFF` background, `#000000` text, `#F4F4F4` for grey fills,
  plus full-black inverted sections for rhythm. There is no accent colour.

## Photography

Seven black-and-white photos ship in `assets/` and are wired into the template:

| File | Used in |
|---|---|
| `hero-porsche.png` | Hero |
| `athlete-football.png` | "Why this exists", carousel |
| `athlete-barber.jpg` | Stay-on, carousel |
| `athlete-sweater.png` | 4mm size card, carousel |
| `athlete-shades.png` | 5mm size card, carousel |
| `athlete-chain.png` | 6mm size card, carousel |
| `athlete-vest.png` | Carousel, final CTA |

Every image slot resolves in this order: **Theme Editor image → bundled
`assets/` file → placeholder.** So the theme looks finished before a store
exists, and picking an image in Customize silently takes over. The bundled
filename is a per-slot text setting, so nothing needs a code change to swap.

**These photos are not licensed and one of them is a recognisable professional
footballer.** They are fine for a mockup and a real problem the day the store
takes payments. Replace them with your own shoot before launch.

## Uploading to Shopify

1. Zip the **contents** of this folder (`layout/`, `sections/`, `templates/`…
   at the zip's top level). `stud-theme.zip` here is a pre-built copy.
2. Shopify Admin: **Online Store → Themes → Add theme → Upload zip file**.
3. **Customize** to preview, **Publish** to go live.

Or `shopify theme push` with the CLI once a store exists.

## Before you publish

- **The review count is empty on purpose.** The stars in the hero do not render
  until you fill in **Customize → Hero → Review count**. Publishing a review
  count you don't have is what the FTC's fake-review rule covers.
- **The press marquee names are placeholders.** A scrolling row of publication
  names reads as press coverage. Keep only titles that have actually written
  about Stud, or delete the section.
- **Claims to verify**: "free shipping" in the announcement bar, "10% off launch
  day", and the material and sizing copy throughout. Confirm each against your
  supplier and your actual policies.

## Local preview

`..\Stud-preview\build_preview.py` renders a static approximation of the landing
page from `templates/index.json` and `assets/base.css`, so the design can be
checked in a browser without a Shopify store:

```
python ..\Stud-preview\build_preview.py
```

Then open `..\Stud-preview\preview.html`. It is a mockup — the email form and
cart do nothing, and it fills in the review count so the lockup can be judged.

## Structure

Standard Shopify OS 2.0 — `layout/theme.liquid`, `sections/`, `snippets/`,
`templates/*.json`, `config/settings_schema.json`, `locales/en.default.json`.
Product, collection, cart, blog, search and account templates are all still
there and styled, ready for when there is something to sell.
