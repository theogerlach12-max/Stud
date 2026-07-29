# Stud — Shopify theme

A Shopify Online Store 2.0 theme for Stud, a magnetic earring brand. Structure and flow (sticky announcement/countdown bar, hero, category tiles, tabbed best-sellers grid, trust badges, brand story, testimonials, AJAX cart drawer) are modeled after luckyfours.com, adapted for magnetic earrings with an ivory/charcoal/gold palette instead of Lucky Fours' dark red.

## Uploading to Shopify

You need a Shopify store (any plan, including a free dev store) before this can go live — theme files alone don't create a store.

1. Zip the **contents** of this folder (not the `Stud` folder itself — the zip's top level should contain `layout/`, `sections/`, `templates/`, etc. directly).
2. In Shopify Admin: **Online Store → Themes → Add theme → Upload zip file**.
3. Once uploaded, click **Customize** to preview, or **Publish** to make it live.

If you'd rather use the Shopify CLI (`shopify theme push`) once a store exists, just say so and I can push directly instead of zip upload.

## Where things go

- **Product photos** (the ones you'll upload) go in **Shopify Admin → Products → [product] → Media** — not in this repo. The theme pulls product images automatically from whatever's on the product; nothing to wire up per-product.
- **Site imagery** — hero background, logo, category tile photos, brand-story photo — is uploaded through the **Theme Editor** (Customize → click a section → image picker). No repo edits needed for those either.
- **Favicon** — Theme Editor → Theme settings → Logo → Favicon.

## Suggested first steps once uploaded

1. Create these collections in Shopify Admin so the homepage isn't empty: **Studs, Hoops, Huggies, Bundles, Gifting** (matches the default category tiles — rename/remove tiles in Customize if you want different categories).
2. Add products to at least one collection, then point the "Best sellers" section's tab(s) at it in Customize.
3. Set your main and footer navigation under **Online Store → Navigation** (the theme reads whatever menus exist there automatically).
4. Replace the placeholder testimonial text in the Testimonials section (Customize → Testimonials) with real reviews once you have them — it ships with clearly-labeled placeholder copy on purpose, not fake reviews.

## Notes on how a few things work

- **Color swatches**: if a product has a variant option named "Color" or "Colour", the theme shows small colored dots for common jewelry finishes (Gold, Rose Gold, Silver, Black, White/Pearl). Unrecognized values fall back to a neutral gray dot — add more mappings in `assets/base.css` under `.swatch[data-color="..."]` if you use other finish names.
- **Star ratings**: only render if a review app (Judge.me, Loox, etc.) populates `product.metafields.reviews.rating` / `rating_count`. No ratings are hardcoded — nothing shows until you connect a reviews app.
- **Cart**: AJAX drawer (add-to-cart doesn't reload the page) backed by Shopify's native cart — no third-party cart service. `/cart` also works as a full page if you ever want to link to it directly.
- **Countdown timer**: end date is set in Theme Settings → Announcement bar. If the date has already passed, it auto-resets to 48 hours from now rather than showing all zeros.

## Structure

Standard Shopify OS 2.0 layout — `layout/theme.liquid`, `sections/`, `snippets/`, `templates/*.json`, `config/settings_schema.json` (theme settings), `locales/en.default.json`.
