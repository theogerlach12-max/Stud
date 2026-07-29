# Stud — Shopify theme

A Shopify Online Store 2.0 theme for Stud, magnetic diamond studs for men who
play sports. Black and white: white background, black type, no accent colour.

The home page is a **single-product long-scroll landing page** — no nav tabs, no
category pages, no exit ramps between the shopper and the buy button. The
structure is modeled on Gruns' one-product flow.

## Page order

| # | Section file | Does |
|---|---|---|
| 1 | `sections/landing-hero.liquid` | Athlete shot, "Look good. Feel good. Play good.", price + CTA above the fold |
| 2 | `sections/landing-problem.liquid` | Why piercings don't work for athletes (bans, healing, losing one) |
| 3 | `sections/landing-sizing.liquid` | The 3 sizes and "find your fit in 10 seconds" |
| 4 | `sections/landing-stay-on.liquid` | Stay-on proof — the game/practice footage |
| 5 | `sections/landing-easy.liquid` | Easy on, stays on, off when you say so |
| 6 | `sections/landing-social.liquid` | Athlete photo grid, "as worn by" strip, customer quotes |
| 7 | `sections/landing-offer.liquid` | What's in the box + pricing tiers (`#offer` — every CTA scrolls here) |
| 8 | `sections/landing-faq.liquid` | Guarantee band + FAQ accordion |
| 9 | `sections/landing-final-cta.liquid` | Repeat the offer |

Order and content are editable in **Customize** — the copy lives in
`templates/index.json`, not hardcoded in the sections.

## Brand

- **Wordmark**: "STUD", uppercase and italic, in a neo-grotesque stack
  (`Helvetica Neue → Helvetica → Inter → Segoe UI → Arial`) — the Haus wordmark
  look, using faces that ship on every OS, so there is no webfont to load or
  license. Set in `layout/theme.liquid` as `--font-grotesque`; the same stack
  drives every landing headline via `--font-display`.
  Turn it off under **Theme settings → Typography** to fall back to the
  Shopify heading font instead.
- **Colour**: `#FFFFFF` background, `#000000` text, `#F4F4F4` for the one grey
  section, plus full-black inverted sections (2, 4, 9) for rhythm. There is no
  accent colour by design.

## Uploading to Shopify

You need a Shopify store (any plan, including a free dev store) before this can
go live — theme files alone don't create a store.

1. Zip the **contents** of this folder (the zip's top level should contain
   `layout/`, `sections/`, `templates/`, etc. directly). `stud-theme.zip` in
   this folder is a pre-built copy.
2. Shopify Admin: **Online Store → Themes → Add theme → Upload zip file**.
3. **Customize** to preview, **Publish** to go live.

To push with the CLI instead once a store exists: `shopify theme push`.

## First steps once uploaded

1. Create the product in Shopify (the kit), then open **Customize** and select it
   under the **Pricing & what's in the box** section, the **Hero**, and the
   **Final CTA**. Every price on the page then comes from Shopify, and the
   pricing buttons become real add-to-cart buttons.
2. Add photos through the Theme Editor image pickers: hero, size cards, the
   easy-on/off close-up, the athlete photo grid, the box shot.
3. Add the stay-on footage to section 4 — upload to Shopify, or paste a YouTube
   or Vimeo URL.
4. Set the footer menu under **Online Store → Navigation** (keep it to policies
   and contact).

## Things to know

- **Prices**: connect the product and prices come from Shopify. Until then each
  section falls back to editable price text, so the page reads correctly before
  the product exists.
- **Bundle tiers**: a tier with quantity 2 adds 2 of the product, which is 2× the
  price — not a discount. For a real bundle, create a 2-pack product priced
  below 2× and select it in that tier's own product picker.
- **Cart**: AJAX drawer backed by Shopify's native cart. `/cart` also works as a
  full page.
- **Sticky buy bar**: appears once the hero scrolls out of view (bottom on
  mobile, top on desktop). Toggle under **Theme settings → Buy bar**.
- **No invented social proof**: the photo/quote section ships with zero sample
  reviews, and quote blocks don't render until you put a real quote in them.
- **Countdown timer**: off by default. Only turn it on for a real dated
  deadline — it rolls over to a fresh 48 hours once the date passes, which is a
  fake-urgency pattern if the deadline isn't real.
- **Claims to verify before launch**: "nickel-free surgical steel",
  "hypoallergenic", "cubic zirconia", "ships within one business day",
  "free shipping", the 30-day return window and the stay-on guarantee all appear
  in the default copy. Confirm each against your actual supplier and policies,
  or edit them in Customize.

## Structure

Standard Shopify OS 2.0 — `layout/theme.liquid`, `sections/`, `snippets/`,
`templates/*.json`, `config/settings_schema.json`, `locales/en.default.json`.
Product, collection, cart, blog, search and account templates are all still
there and styled, they are just not linked from the landing page.
