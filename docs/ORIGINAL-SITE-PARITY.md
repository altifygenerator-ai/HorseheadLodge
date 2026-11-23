# Horsehead Lake Lodge — original-site parity and expansion audit

Original business: https://horseheadlakelodge.com/ (reviewed November 22, 2026)

**Objective:** Upgrade the existing business website, retaining recognizable visual identity and every important customer journey. The Next.js version must be mechanically and visually *better*, never a simplified substitute.

## Visual and interactive requirements
- Original homepage uses multi-image sliders that automatically advance **and also have previous/next arrows**. These are not a click-only gallery. Keep smooth fade transitions, no layout shifts, swipe navigation on touch, sensible rotation interval (~6.5 s), pause when pointer/focus is inside, and `prefers-reduced-motion` support. Confirm exact original timing with a browser before launch.
- Dedicated gallery is a separate browsing experience and may have enlargement, filtering and thumbnails; this must not be confused with homepage sliders.
- Large, high-quality original property photography matters more than abstract design accents. Match the real site and use actual venue photographs, not unrelated stock imagery.
- Maintain credible design: no decorative page numbering, filler statistics, fake reviews or fabricated selling points.
- Preserve original 360° hall tours if their media/iframe links can be extracted. They are referenced on the live wedding page but **not yet recovered**.

## Public information inventory

| Original page / URL | New location | Current work | Launch requirement |
| --- | --- | --- | --- |
| `/` | `/` | Photo-first homepage, rotating hero, amenities/wedding views, original guest reviews, film feature | Verify original media and all autoplay behavior in desktop/mobile browsers |
| `/wedding/` | `/weddings`, `/wedding-packages` | Full weekend, weekday, and shorter rates, photo slideshows | Confirm prices/deposit terms and recover 360° tours |
| `/the-enclave/` | `/the-enclave` | 5-photo series, published capacity and pricing | Validate original photo files, booking CTA |
| `/corporate/` | `/corporate-retreats` | Original corporate packages, retreat venue imagery | Confirm pricing and corporate inquiries |
| `/video-gallery/` | `/video-gallery` | Public wedding film by Wild Bloom Films, official channel link | **Find and migrate the exact original embedded YouTube videos**; don't assume the external film was on the original page |
| `/gallery/` | `/gallery` | Lightbox and category filtering | Export more original photos, confirm permitted use and captions |
| `/services/` | `/amenities` | Lake access, courts, venues, lodging, courtyard, recreational references | Confirm Turo/Jeep listing and all current amenities |
| `/booking/` | `/cabins` and six `/cabins/<slug>` | All six published individual Airbnb links | Check availability/reservation path on every device |
| `/guest-information/` | `/guest-information` | Guest directions/invitation guidance | **Restore original event-specific RSVP and any guest portal**; verify apartment info |
| `/winery/` | `/things-to-do/wineries` | Original winery names | Check business details, travel times and external destination URLs |
| `/restaurant/` | `/things-to-do/restaurants` | Original restaurant names | Check hours and links before publication |
| `/hiking-trails-waterfalls/` | `/things-to-do/trails` | Local recreation context | Research and verify individual destinations |
| `/blog/` | `/blog` | Current index is provisional | **Migrate important indexed posts and their permalink URLs before DNS cutover** |
| `availabledates.horseheadlakelodge.com` | External current availability service | Preserved as outbound link | Verify domain, calendar freshness, and whether DNS change affects subdomain |
| VenueX | Existing tour booking | Existing direct link preserved | Test scheduling and email confirmations |
| Privacy / Terms | Not yet migrated | Needs owner-provided current policies | Include legal documents and preserve SEO redirects where appropriate |
| WordPress forms | Inquiry integration not complete | Contact details present | Build, test deliverability and spam defenses, or preserve legacy provider until working |
| Email agent | Existing integration unknown | Proposed concierge spec and non-sending triage | Requires Scott's provider, access, rules and explicit approval before any sending |

## Additional original content to account for
- Published wedding and corporate starting price options and deposit terms (owner verification before launch).
- The Enclave (smaller events), original reviews and real wedding/photo galleries.
- Ceremony hall, reception hall, ceremony deck, connecting walkway, rooftop deck, bridal suite, guest quarters, lake and recreation.
- Existing event calendar, videos, 360° content, cabin listings, contact and guest forms, privacy/terms, Google Analytics/Search Console.
- Existing blog and event pages with search equity: export crawl, title/H1, metadata, redirects, internal links. Never redirect all blog entries to homepage.

## Sources verified from public pages
- https://horseheadlakelodge.com/
- https://horseheadlakelodge.com/wedding/
- https://horseheadlakelodge.com/corporate/
- https://horseheadlakelodge.com/the-enclave/
- https://horseheadlakelodge.com/booking/
- https://horseheadlakelodge.com/services/
- https://horseheadlakelodge.com/restaurant/
- https://horseheadlakelodge.com/winery/
- https://horseheadlakelodge.com/guest-information/
- https://horseheadlakelodge.com/video-gallery/
- https://horseheadlakelodge.com/blog/
- Public independent venue wedding film: https://www.youtube.com/watch?v=dcqyySknUgg (Wild Bloom Films, 2022; **not confirmed as an original on-site embed**)
- Lodge's public YouTube channel: https://www.youtube.com/channel/UCb8g5lrxpIb41_nVb3DWXdQ

## Prelaunch acceptance criteria
1. Exact migration inventory and signed-off pricing/amenities from Scott.
2. All original **photo/video assets downloaded** from authorized source to site storage, with their usage rights confirmed.
3. Slider auto-advance, arrows, keyboard, swipe, visible images, timing and reduced-motion behavior tested on mobile and desktop.
4. Cabin reservations, tour booking, event availability, forms, legal pages, RSVP, old event/blog URLs and email routing verified end-to-end.
5. No broken external WordPress-media references remain before domain change. Staging stays `noindex` until launch approval.
6. Site build passes TypeScript, Next production compilation, accessibility and cross-browser checks; mobile performance verified with original media.
7. Never migrate or replace the current email assistant without Scott's specific approval and a shadow/draft period.
