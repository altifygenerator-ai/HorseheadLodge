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


## Critical: current-domain links
Do not add links on the new site to `https://horseheadlakelodge.com/video-gallery/` or `https://horseheadlakelodge.com/guest-information/` as supposed WordPress backups: after DNS cutover those URLs point back to the new app. Migrate the original video gallery and working RSVP workflow before launch.


## November 23, 2026 — visitor experience expansion (staging)

Completed in this code revision:
- Refined the photographic hero, tour actions, responsive navigation and grouped desktop/mobile menus.
- Kept automatic, pausable property photo carousels and added independently rotating ceremony and wedding-moments gallery collections.
- Built dedicated Waterfall Cabins and Glamping Cabins category guides, retained all six individual Airbnb listing destinations, and expanded each cabin detail page with property context and practical arrival notes.
- Restored the original winery guide’s Mount Bethel, Post Winery and Chateau Aux Arc entries with visitor links; also included the nearby Wiederkehr wine-cellar destination already referenced in the original dining guide.
- Restored all six original dining-guide places, expanded the hiking guide with the original named trails/waterfalls, and connected local guides from the homepage, menus and footer.
- Explained the original Event Center Apartment/guest quarters as event-related accommodation rather than inventing a seventh standalone bookable Airbnb cabin.
- Extended route and UI safeguards for the new category pages and guidance.

Outstanding blockers (unchanged, do not switch DNS):
- Migrate original WordPress blog posts and maintain each indexed article permalink.
- Preserve original event pages, RSVP data entry, form delivery and confirmation; no fake replacements.
- Recover the real ceremony-hall 360 panorama/embed and verify the original gallery’s precise video IDs; independent filmmaker embeds are not proof of original-video parity.
- Sync all remaining original WordPress photos, including Enclave and specific cabins, to durable first-party storage. The 81-image experience gallery is already first-party; some older SitePhoto assets are still sourced from WordPress.
- Approve photographer/photo usage, current package prices, any venue guest-quarter arrangements, and final mobile/browser review with Scott.
- Verify the attached Vercel project and deployment, crawl it with an interactive browser at 375/768/1280, and confirm all book-tour/Airbnb/calendar/outbound links before a launch decision.


## November 23, 2026 — varied page layouts and editorial flow (staging)

- Reworked Weddings into an immersive venue-photo hero, large ceremony/reception chapters, real-wedding auto-rotating gallery, and stay/weekend storytelling.
- Reworked The Enclave with its own intimate layout and original Enclave photo carousel rather than the standard sitewide page-intro template.
- Reworked Corporate Retreats around an actionable meet/reconnect/stay flow and clear published rate comparison.
- Reworked Amenities as a property-photo mosaic and recreation list.
- Differentiated Wineries (wine-country travel note and destination cards), Restaurants (location-grouped directory) and Hiking (outdoor field guide).
- Simplified Guest Information into practical arrival/RSVP guidance and Contact into a clear visit/contact layout.
- Retained original photos, source labels, six Airbnb bookings, tour/calendar links, staging noindex and current launch gates.
- Automated layout/content assertions added; still requires real browser visual review before replacing the original WordPress site.

## November 25, 2026 — public booking and automation source migration
- Added the public event-dates address as a separate date-inquiry channel in site config, labeled as published but not deliverability-tested.
- Added a dedicated /plan-your-event guide connecting the EXISTING VenueX tour scheduler, the independent published event-date calendar, package information, and correct email inquiry path. It does NOT claim to confirm availability, hold dates, charge deposits, or send email itself.
- Added event-booking links to the nav, footer, contact and wedding-package page.
- Added source-attributed publicly documented package/deposit/rental facts to knowledge/venue-facts.json, all deliberately NOT owner-approved or authorized for AI auto-replies.
- The old site's WordPress REST namespace inventory publicly identifies Contact Form 7 and WP Mail SMTP, plus The Events Calendar, but does not reveal Scott's private delivery routing or VenueX automation configuration. Do not connect to its form submission API or infer an AI mailbox webhook from plugin presence.
- Found original live privacy policy and terms pages (both last updated 2023-11-20); original terms include the unfilled phrase [Your Jurisdiction]. Do not copy legally stale/unfinished text into a production policy; require owner/legal revision.
- Original /events/ contains old dated availability-like event entries, some in early 2026. Do not import these as fresh calendar openings: use the linked date-availability service until authoritative integration is approved.
- A public Typeform feedback link exists but couldn't be submission-tested. Keep the URL documented, not embedded as a production form.
- Still blocked: verified end-to-end form email delivery, mailbox/agent access, owner-approved facts, current calendar integration, event RSVP backend and source media migration.

## November 25, 2026 — venue automation staging

- [ ] Load Scott's approved open dates, current holds and confirmed weddings, including shared resources.
- [ ] Connect the verified Outlook intake folder, tour calendar, delivery permissions and host scheduler.
- [ ] Verify marketplace Reply-To routing and the payment provider adapter using test records.
- [ ] Run shadow inquiries and a complete test tour and deposit before enabling live delivery or switching public links.

See [Horsehead operations and concierge](docs/EMAIL-CONCIERGE-ARCHITECTURE.md).
