# Production launch checklist (NOT page copy)

Status as of November 18, 2026: **staging-only; do not switch DNS.**

## Completed in this code update

- Replaced decorative section counters and generic copy with property-specific design and text.
- Found and connected the real VenueX tour URL and six distinct Airbnb room IDs.
- Preserved existing event-availability subdomain as a separate link.
- Added meaningful pages for weddings, published pricing, The Enclave, groups, cabins and unit-specific amenities.
- Implemented responsive navigation, page metadata, canonical tags, staging noindex and conditional sitemap.
- Prepared a first-party photo manifest for migration.

## Must be done before launch

- [ ] **Media:** Run `npm run media:sync` from an internet-connected development machine. Review all downloaded images for correct context, permission, photographer credit and resolution. Enable `NEXT_PUBLIC_LOCAL_MEDIA=true` and verify all files before DNS cutover. The URLs currently refer to the OLD WordPress site and will fail if that site is replaced without copying them.
- [ ] **Video gallery:** Inventory WordPress embeds, YouTube/Vimeo IDs and original files; embed or migrate real videos. Replace the external link back to the old same-domain `/video-gallery/` route.
- [ ] **RSVP:** Determine backend for current event-code RSVP. Port or preserve functional data submission and confirmation, with privacy protections. Remove current same-domain legacy link after it is working.
- [ ] **Blog:** Crawl all indexed blog URLs, prioritize real events and useful pages, migrate copy + original imagery + author/credit details, and map legacy post URLs. The staging blog currently points to the old same-domain blog.
- [ ] **Events:** Audit WordPress `/events/` and `/event/*` URLs, including dated package events. Preserve or redirect each meaningful URL only after validating its replacement. Do not generate fake current availability.
- [ ] **Forms:** Decide whether to use VenueX or a properly tested first-party inquiry system; avoid fake success messages. Test delivery to Scott and spam controls.
- [ ] **Pricing:** Reconfirm wedding packages, The Enclave pricing, what is included and deposit policies directly with Scott. The site currently shows the existing published figures, not a guaranteed quote.
- [ ] **Lodging:** Review each Airbnb description and current capacity with Scott, including Waterfall Cabin One's external bathroom entrance and the steep road to glamping.
- [ ] **Analytics:** Connect and test appropriate GA4, Search Console, and Bing Webmaster accounts only after approval. Record existing baseline metrics and use actual data, not guesses.
- [ ] **SEO:** Create a full old-URL inventory and proper 301 map; carry over meaningful existing article URLs; update XML sitemap and schema; verify canonicals and robots after cutover.
- [ ] **Live settings:** Only after completing all tasks, set `NEXT_PUBLIC_SITE_LIVE=true`, with locally hosted media, and re-run `npm run audit && npm run lint && npm run build`. Test production site URLs and booking flows again.
- [ ] **Go-live:** Leave WordPress and DNS untouched until owner approves final comparison.

## Source pages used to ground current content

- https://horseheadlakelodge.com/ and /wedding/, /booking/, /the-enclave/, /corporate/, /services/
- https://app.venuexai.com/book-appointment/HF37r4yoWYHWbzUZbCHB?extended=false
- https://availabledates.horseheadlakelodge.com/
- https://www.airbnb.com/rooms/22246525
- https://www.airbnb.com/rooms/45281089
- https://www.airbnb.com/rooms/879535773986067585
- https://www.airbnb.com/rooms/907810186496081029
- https://www.airbnb.com/rooms/23291812
- https://www.airbnb.com/rooms/815701483202479525
