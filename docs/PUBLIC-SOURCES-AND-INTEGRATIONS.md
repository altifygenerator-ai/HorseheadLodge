# Public source and integration inventory — November 25, 2026

Public sources only. This is not access to private WordPress, email, VenueX or Airbnb accounts.

## Verified existing links now used by the rebuild
- Tour scheduling: https://app.venuexai.com/book-appointment/HF37r4yoWYHWbzUZbCHB?extended=false. Publicly linked by original site; booking, confirmations and deliverability NOT submission-tested.
- Event date windows and indicative prices: https://availabledates.horseheadlakelodge.com/. Separate site with selectable calendar. DO NOT cache open dates as static AI truth.
- Date-hold inquiry address: info@horseheadlakelodge.com published on event-date site. Inbox deliverability and agent handoff NOT verified.
- General contact: scott@horseheadlakelodge.com and (479) 214-0218. Source: https://horseheadlakelodge.com/contact-us/
- Six distinct Airbnb listing URLs, as recorded in src/lib/content.ts. Source: https://horseheadlakelodge.com/booking/
- Typeform visitor feedback: https://nbttoo7psqw.typeform.com/to/nJHfuwxy as linked from original Contact. Could not open or submission-test; not a booking/inquiry form.

## Published event facts — subject to Scott's approval before AI responses
Source https://horseheadlakelodge.com/wedding/
- Full weekend from $9,900, Fri noon–Sun 10 a.m.
- Long weekday from $6,900, Mon noon–Thu 10 a.m.
- Friday/Sunday shorter wedding from $2,900; shorter weekday from $1,900; Saturday from $6,900.
- 25% weekend deposit plus another 25% within 90 days and balance 60 days before event. Ambiguous "within 90 days" needs clarification.
- Other packages: 50% deposit and balance 60 days before event.
- Extra weekend waterfall/glamping cabin from $400 per cabin, as described.
- Published 72-acre grounds, ceremony hall up to 200 guests, package lodging for 26. Reconcile lodging inclusions with Airbnb capacity and separate event guest quarters.
Source https://horseheadlakelodge.com/the-enclave/
- The Enclave up to 50 guests; standard event rental from $800; ceremony-space package from $1,900 with only ceremony space and bridal suite.

## Public WordPress tooling clues
Public WordPress REST root at https://horseheadlakelodge.com/wp-json/ registers namespaces for Contact Form 7, WP Mail SMTP, The Events Calendar, Elementor, Google Tag Manager for WordPress, MonsterInsights, and marketing plugins.
Registered plugins do NOT prove connected accounts, actual email routing, an authenticated API integration, or VenueX webhook settings. Don't attempt submission API reuse or private admin REST access without Scott's authorization.

## Launch flags that remain
- 20 titles visible on original /blog/ index. Preserve real posts, original author names, photos and exact permalinks from authorized export. Don't replace content with fabricated AI-written posts.
- Original /events/ page contains calendar entries for old dates and should NOT become live availability; use the separate event-dates subdomain until actual calendar authority is verified.
- Original /privacy-policy/ and /terms-conditions/ both claim last updated 2023-11-20; Terms still contains literal "[Your Jurisdiction]". Must get revised owner-approved legal text before migrating into production.
- Original Contact, Wedding and Enclave pages include WordPress forms, but current routing and deliverability can't be inferred from public form markup.
- Indoor ceremony hall 360 tour asset and exact original video embeds still not publicly recovered.
- No working new email API, customer inquiry database, AI auto-replies, guest RSVP backend or real event payment processing exists in the rebuild. Existing WordPress and VenueX workflows must not be disabled until tested replacement exists.
