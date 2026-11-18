# Horsehead Lake Lodge / staging rebuild

A wedding-first, human-designed Next.js replacement for Scott's existing WordPress website. This repository is a **staging build** and must not replace the current domain yet.

## Local preview

```powershell
npm install
npm run dev
```

Visit http://localhost:3000. Use `npm run build && npm start` for a production-mode preview (noindex remains on by default). This project does not require database credentials for the pages supplied here.

## What changed

- Editorial, varied layouts instead of generic numbered cards and repeated section grids.
- Actual venue details and distinct cabin-specific information from the lodge's current site and individual listings.
- Working VenueX tour destination, availability calendar and six different Airbnb booking URLs.
- Better mobile menu, accessibility basics, unique metadata, local business schema and launch-safe robots policy.
- Original first-party photo URLs used for staging visuals; a downloader is included to save the actual assets for deployment.

## Photo migration — important

Staging currently hotlinks photos from the owner's original WordPress site, so an internet connection is required for those images to appear. This is **temporary**. Before replacing WordPress, run:

```powershell
npm run media:sync
```

After the photos have been downloaded, inspected and approved, set `NEXT_PUBLIC_LOCAL_MEDIA=true` in your local `.env.local` / Vercel environment. Never switch DNS before copying image assets. This environment flag means the new website loads `/public/photos` directly instead of WordPress.

## Check changes

```powershell
npm run audit
npm run lint
npm run build
```

`npm run audit` scans for missing routes, made-up decorative numbering, major template filler, missing booking IDs and staging robot protections. It cannot replace human browser testing. All launch blockers are recorded in `LAUNCH-CHECKLIST.md`.

## Non-negotiables

Read `AGENTS.md` and `HUMAN-DESIGN-PROMPT.md`. The replacement must stay `noindex` until blog URLs, events, existing RSVP, video galleries and media are migrated and tested. Avoid fake forms, invented reviews and “AI-looking” stock imagery. **No live domain changes have been made.**

Optional route-render smoke test after `npm install`:

```powershell
npm run smoke
```

This exercises all page components and internal links without starting a Next web server. It is **not** a substitute for a real production build or browser-based test on a deployed preview.


### V3 visual correction
This revision returns to the original site’s sections and photo-first venue feel. Refer to `BRAND-REFERENCE.md` for fidelity notes; verify final palette against the live site before launch.


## Interactive venue photography (V4)

The homepage now has an automatic but pausable photograph carousel, a manual venue showcase with thumbnails, and a guest review carousel. The Weddings and Enclave pages have separate photograph carousels. The Gallery page has category filters and a full-screen, keyboard-accessible lightbox. All controls are ordinary buttons with clear labels; slides are swipeable on mobile. Autoplay stops for reduced-motion users or background tabs.

Run `npm run ui-audit` alongside `npm run audit`, `npm run smoke`, and `npm run build`. The first three are code/route checks; they do not replace a full dependency-backed build or a real browser test.

The Enclave photo URLs come from the live Enclave page. Before connecting the production domain, run `npm run media:sync` and verify that all **13** image files exist under `public/photos/`; otherwise same-domain WordPress image requests will break on cutover.
