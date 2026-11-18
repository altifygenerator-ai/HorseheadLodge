# Horsehead Lake Lodge — mandatory editorial and visual rules

This file governs all automated and human changes to the site.

**Goal:** A distinctive, credible, understated venue website that helps couples tour, guests find the right accommodation, and group organizers make inquiries. It must look as though a designer studied *this particular property*, not as though a generator selected a lodge template.

## Non-negotiables

1. **Specificity beats polish.** Each section must answer something a visitor needs to know about *Horsehead Lake Lodge*: ceremony locations, guest accommodation, pricing structure, photos, directions, tour booking, lake access or unit-specific details. If it could describe any wedding venue, rewrite or remove it.
2. **Never invent.** Do not invent amenities, review quotes, award badges, guest counts, acreage, traffic statistics, booking availability, capacity, prices, nearby travel times, photographer credits, testimonials or amenities. Use only confirmed owner content, existing site pages, or the linked unit's actual listing. If a fact isn't verified, omit it from the visitor-facing page and add it to the launch checklist.
3. **No decorative numbers.** Absolutely no `01 /`, `02`, arbitrary section indices, numbered cards, fake KPI strips, nonsense data badges, made-up scores or random counters. Real, useful numbers are permitted when substantiated: e.g. *72 acres*, *up to 50 guests*, *sleeps 4*, or the venue's published package prices.
4. **No AI-typical copy.** Avoid *unforgettable experience*, *where memories are made*, *elevate*, *breathtaking*, *nestled*, *hidden gem*, *luxury meets nature*, *discover the magic*, *perfect blend*, *journey*, *we understand*, and empty “let's make memories” copy. Prefer plain, specific language: “The ceremony deck looks across Horsehead Lake”; “Waterfall Cabin Three has two queen beds and a porch hot tub.”
5. **No AI-typical layout.** Do not automatically compose hero + centered intro + three identical cards + stat strip + FAQ accordion + oversized CTA on every page. Change the rhythm and proportions by page purpose. Avoid gradient blobs, neon glows, glass cards, decorative icons, faux dashboard widgets and over-rounded components.
6. **No arbitrary taxonomy.** Menu labels must match what guests actually call things (“Weddings,” “Packages,” “Cabins,” “The Enclave”), never “01 STAY / 02 CELEBRATE” or labels introduced only to style the interface.
7. **Real photographs only.** Use photographs owned/licensed by the venue. Preserve original proportions and avoid filters that misrepresent the property. Source links in `src/lib/content.ts` currently point to the venue's **old WordPress domain**; download and approve local copies before switching DNS. Do not use stock/AI photos or a photo from someone else's wedding gallery without explicit rights.
8. **Visible text is for visitors, not developers.** No “placeholder,” “migration pending,” “verify before launch,” “preview only,” “TODO,” “new system” or framework language on rendered pages. Track implementation issues privately in `LAUNCH-CHECKLIST.md`.
9. **Functional CTAs only.** Book tour must use the existing working VenueX appointment link. Event dates must use the existing availability site. Each stay must link to *its own* verified Airbnb room. Do not invent a booking engine or show an untested contact/RSVP form.
10. **SEO that helps people.** Use page-specific titles, a single natural H1, accurate metadata, obvious internal links and genuinely distinct content. Do not spin dozens of keyword-stuffed location pages. Keep existing indexed pages, guest RSVP, events and video links safe during migration.
11. **Accessibility and responsive quality.** Check 375px, 768px, 1280px widths; keyboard navigation; alt text; contrast; tap targets; overflow; headings and focus styles. Be conservative with animation and honor reduced-motion settings.
12. **Edit in place carefully.** Never move Scott's existing domain, replace WordPress, delete content or redirect blog/event URLs until sources are inventoried, images are backed up and new workflows have been tested.

## Before completing any change

- Read the current live source and original content when making factual changes.
- Review the page with this question: **Would this section feel honest and locally specific if the owner stood beside the visitor?**
- Run `npm run audit`, `npm run lint`, `npm run build` when dependencies are available. Check navigation and external links manually in a browser.
- Report verified outcomes separately from items still awaiting the owner's approval.


## Essential visual continuity rule
Horsehead is an existing venue, not a blank-slate luxury resort. Treat `BRAND-REFERENCE.md` as the governing design reference. Keep original navigation, full business name, photo-first wedding positioning, practical typography, light surfaces and minimal restrained accents. Do not use forest-green luxury editorial styling or numerical filler. Never claim exact brand colors until the original CSS is verified.

## Preserve the live site's *actual interactions*
- A still image is NOT an acceptable replacement for the original site's scroll-through/slideshow photography.
- Preserve gallery browsing on the home page, wedding pages, and The Enclave with working manual navigation, and use subtle optional autoplay only where appropriate (hero).
- All rotating images must be real business-owned/published photographs, not invented or generated stand-ins.
- Never reduce multiple named, verified testimonials to a single unattributed sentence.
- Sliders must support arrow buttons, touch swiping, keyboard operation, visible photo selection and reduced-motion settings.
- Never tell the client the site is production-ready without verifying original media has been stored independently of the WordPress domain, inquiry/RSVP/video migration, responsive layouts, and a full Next production build.
