# Horsehead Lake Lodge — visual continuity brief

The replacement must feel like an improved edition of [horseheadlakelodge.com](https://horseheadlakelodge.com/), not a new unrelated resort brand.

## Established reference from the existing public site
- Full business name: Horsehead Lake Lodge & Event Center.
- Wedding and event venue is the primary offering, with lodging/cabins on the same website.
- Original navigation covers Weddings (including The Enclave), Corporate, Video Gallery, Gallery, Excursions, Cabins, Available Dates, Blog, Contact, Book Tour.
- Original homepage order/subjects: venue welcome, weddings/events, nature experience, gallery/ceremony facilities, real reviews, lodging, inquiry/contact.
- Property: 72 acres by Horsehead Lake, Clarksville, Arkansas.
- Live integrations: VenueX tour scheduling, external availability calendar and Airbnb cabin listings.

## Design direction
- Large real property photos before decorative sections. Natural wood, lake and building materials drive the visual feel.
- White or warm-neutral surfaces, charcoal text, restrained wood tone as an accent. Not green/beige editorial-luxury design.
- Modern practical typography and normal-sized navigation; no huge editorial serif headlines.
- No decorative section numbering, invented metrics, generic AI labels, unnecessary gradients, card piles, or faux badges.
- Preserve all established content areas and existing event/booking flows.
- Photography must originate from Scott's original site or other explicitly approved assets.

**Important:** Hex values are a provisional approximation. The available web text does not expose the WordPress CSS or exact current palette, and the original images could not be downloaded in this environment. Match final palette and original assets in a browser before launch.

## Safe launch rules
- Do not switch the domain until all original photos/videos are copied and verified, RSVP is migrated, forms are working, and old URL redirects are planned.
- Never index staging. Run `npm run media:sync`, `npm run audit`, `npm run smoke`, `npm run lint`, `npm run build` locally.
- Resolve all old blog and event URLs separately, not a catch-all redirect.
