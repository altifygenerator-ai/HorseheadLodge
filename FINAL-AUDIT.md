# Design and implementation QA — November 18, 2026

## Verified here

- Read starter source and compared published venue pages and all linked Airbnb units.
- Replaced the generic `01 / Weddings` numbered labels, boilerplate, empty room descriptions and visitor-visible implementation notes.
- Verified `VenueX` destination and all **six distinct** Airbnb room IDs against the original website links.
- Audited the event-availability subdomain separately from the WordPress events system.
- Parsed **21 TS/TSX source files** with the TypeScript compiler: **0 syntax errors**.
- Exercised the site's design and booking-link guard: **pass**.
- Rendered **18 pages**, including six individual accommodations, with a Next-free JSX test harness: one H1 per page and **no dead internal links**.
- Parsed CSS using a standards parser: **0 CSS parse errors**.
- Loaded those 18 generated HTML pages in headless Chromium at **320, 375, 768, and 1280 pixels**: **no horizontal overflow, missing image alt attributes, or missing/duplicate H1 elements**. Native mobile menu toggled open successfully.
- Checked the desktop/mobile visual composition with Chromium screenshots. Note: remote photos could not be loaded from this runtime, so the photo regions appear as neutral blocks in those screenshots.
- No modifications made to the current domain, existing WordPress website, calendar, forms, Airbnb, or live booking accounts.

## Not yet verified — must not be described as passing

- `npm run lint` and `npm run build` could not complete here because `next`, `react`, `@types/react`, and the project's other `node_modules` are not installed and the current container cannot access npm. TypeScript parsing and the JSX smoke harness do not prove a Next production build.
- Original photo files could not be downloaded from this runtime. Staging currently references the original website media URLs. Download/approve copies from an internet-connected computer before switching DNS.
- External availability, Airbnb checkout and VenueX interactive booking cannot be fully submitted safely or comprehensively tested through this code review.
- No original video files, guest RSVP data, existing WordPress blog posts, or full old-event URL inventory have been migrated. Those are explicit go-live blockers.
- No Search Console access or verified search ranking data was used; no SEO growth claims are made.

## Local final checks

```powershell
npm install
npm run audit
npm run smoke
npm run lint
npm run build
npm run dev
```

Test the full site on local and mobile browsers and confirm the 6 Airbnb links, the VenueX tour calendar, and event dates. Run `npm run media:sync` to copy the actual WordPress photos while the old website is still live.

## Production safeguard

`NEXT_PUBLIC_SITE_LIVE=false` keeps the rebuild noindex and disallowed in `robots.txt`. The `audit` script intentionally blocks setting it to `true` until remaining migration work is completed.
