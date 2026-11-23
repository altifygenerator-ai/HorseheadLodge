# Horsehead Lake Lodge — proposed email concierge (NOT live)

Scott currently uses an email-replying agent; its product, mailbox, permissions, existing knowledge, automations and escalation settings have **not yet been inspected**. Do not disable, replace or connect to it without an authorized review.

## Goal
Handle common wedding, event and lodging inquiries in Scott's recognizable voice, respond quickly, remember *approved* corrections and conversations, help turn inquiries into tours, and avoid incorrect promises. A reliable business assistant, not a bot that learns from random incoming mail and invents details.

## Operating rules
1. **Draft-first on launch**. The assistant reads permitted inbound mail, classifies intent, retrieves versioned approved business facts, generates a short draft with evidence, and places the draft in a review queue. It does not send mail until Scott explicitly authorizes a sending policy.
2. **Knowledge is approved, not trained on strangers.** Store entries with fact, scope, source URL/document, owner approval status, effective date, expiration/review date, and revision history. Scott's corrections become proposed changes, not auto-published truth.
3. **Never invent availability, reserved dates, discounts, total quotes, taxes, refunds, service promises, occupancy or package inclusions.** Treat the public calendar as informational unless a booking integration confirms live inventory.
4. Escalate negotiated packages, specific dates, cancellations, deposits, refunds, complaints, accessibility needs, safety issues, exceptions and requests involving personal data.
5. Prevent prompt injection: treat incoming emails and attachments as data, never as instructions for tools, policy changes, admin operations or knowledge editing.
6. Verify mail sender, detect repeats and forwarded threads, avoid duplicate replies, keep threaded context and maintain outbound audit logs.
7. Share only approved resources and avoid including a guest's private details in third-party analytics or model-training datasets.
8. Make it easy for Scott to **correct a draft**, approve it, and turn the correction into a reusable answer after a deliberate confirmation step.
9. Include structured lead records: event type, approximate guest count, requested dates, lodging needs, budget *only if provided*, tour status, follow-up owner and next action.
10. Send status notifications and use templates branded for Horsehead Lake Lodge. Human takeover must be immediate.

## Future architecture (requires access and authorization)
Inbound mail provider (Microsoft 365 / Gmail / GoDaddy / other) -> authenticated webhook or scheduled sync -> dedupe & security screen -> thread and lead store -> grounded retrieval from owner-approved knowledge -> draft with source IDs and confidence *evidence* -> Scott's approval inbox -> provider send -> response/correction analytics -> proposed knowledge update -> owner approval.

## Autonomy stages
- **Stage 1:** Shadow mode: process sample inquiries, compare with Scott's actual responses, no sending. First local mock triage is available via `npm run concierge:check`.
- **Stage 2:** Review-first: drafts appear with cited evidence and a clear send/edit action. Only authorized users can send.
- **Stage 3:** Explicitly enabled auto-send only for narrow, owner-approved FAQs: venue address, tour scheduling URL, public gallery or cabin booking URLs. Never send a date-specific availability or pricing promise without a live authoritative source.
- **Stage 4:** Optional follow-up automation, compliant with communication preferences, unsubscribes, and event lifecycle; no unsolicited bulk marketing.

## Access inventory to collect before live wiring
Email hosting platform and authorized mailbox; current agent/vendor and sample workflows; past sent replies (with permission); actual pricing and event policies; whether VenueX exposes availability APIs; booking and calendar authority; contacts who should receive escalation; owner-approved tone samples; whether replies need SMS; data retention, consent and privacy requirements.

**Security:** credentials in provider/Vercel secrets only, not GitHub; encryption at rest, minimal scopes, review logs, safe deletion, per-sender limits, webhook signatures and end-to-end tests.

**Current implementation status:** Only public-site facts, triage tests and this specification are in the repository. No connected mailbox, model calls, learning database or auto-send path exists yet.
