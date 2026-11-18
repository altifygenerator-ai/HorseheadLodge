# Horsehead Lake Lodge — current verification, November 18, 2026

## What was actually checked

- Confirmed the new GitHub repository `altifygenerator-ai/HorseheadLodge` was empty, then committed the Next.js starter and later corrections to `main`.
- Reworked the V2 green/cream split-screen visual approach toward the current site's photo-led, wedding-first structure. Updated navigation, venue sections, gallery and the main page. The exact current WordPress palette remains unverified.
- Changed color tokens and older green hard-coded CSS values to restrained neutrals. Updated the site design brief to REQUIRE visual continuity with the original.
- Confirmed all 18 page components render through the JSX shim test and have one H1 and no dead *internal* links. `npm run smoke` passed.
- `npm run audit` passed source checks for the external booking destinations, no template numbering, and staging robots.
- `npm run prelaunch` found **0 of 9 original media files locally** and correctly reported that launch is blocked.
- Removed staged same-domain links to the legacy WordPress video and RSVP pages, which would become self-links after a DNS switch. The actual video library and RSVP functionality remain to be migrated.
- No changes to the existing WordPress domain, DNS, booking calendar, Airbnb, VenueX or event reservations.

## Not verified / open blockers

- **The exact live WordPress styles, brand assets and photos were not available as downloadable files in this runtime.** Existing-site color matching is a conservative approximation, not a screenshot-exact match.
- Chromium visual screenshot capture timed out in this sandbox. No new responsive browser screenshots or mobile overflow pass are claimed for V3.
- Full Next.js `npm run lint` and `npm run build` could not run because local `node_modules` / Next / React types are not installed; TypeScript component smoke tests do not replace them.
- All nine original photos need to be downloaded and visually verified. Do not switch DNS while their source URLs still resolve to the old WordPress installation. Run `npm run media:sync` from a machine with internet.
- Original WordPress blog articles, indexed URLs and event pages still need migration/redirect mapping.
- Original video files, guest RSVP form/data, and working event/contact inquiry forms have not been rebuilt and tested. These are release blockers.
- Booking flows have links but have not been fully submitted or checkout-tested; do not claim end-to-end booking verification.
- Vercel creation was attempted for `horsehead-lodge-staging` under `hometown-webs-projects`; the API returned **403 forbidden**. No Vercel staging project or deployment was created here.

## Safe local checks

```powershell
npm install
npm run audit
npm run smoke
npm run prelaunch
npm run lint
npm run build
npm run dev
```

Do not enable `NEXT_PUBLIC_SITE_LIVE=true` or connect the production domain until the missing files, functionality, SEO migration, and full browser/build tests have been completed. The current staging configuration is noindex.
