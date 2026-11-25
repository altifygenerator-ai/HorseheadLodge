# Horsehead operations and concierge

The rebuild now includes the website inquiry form, event availability and tour scheduler, an authenticated operations page, and a Postgres-backed background worker. The existing public destinations remain the default until the cutover flag is enabled. The worker defaults to shadow mode, which stores prepared replies for review and leaves Outlook calendar records alone.

## Workflow

- One normalized email identifies a lead. Each inquiry retains its own source and message ID. Appointment records separately identify whether a guest, the agent, or staff booked the tour.
- The Outlook inquiry folder is polled by the worker. Approved marketplace sender addresses are configured per source. A marketplace message needs a recipient in its Reply-To header that differs from the platform sender. Ambiguous marketplace inquiries go to staff. Validate real examples for each provider before changing mail routing.
- The model can classify intent and interpret an explicit date. Email content comes from approved, versioned venue answers, live inventory, and fixed transactional replies. An owner can update each approved answer from the dashboard. A message cannot change calendar settings or venue policies.
- The agent can offer times by email. A guest's explicit signed BOOK reply books the offered slot if it is still open. The agent, guest and staff use the same availability check. Outlook blocks are considered and scheduled tours are projected to the selected calendar once live.
- The worker sends confirmations and reminders. A guest can reply to confirm or cancel. Staff only record outcomes the system cannot observe, such as attendance. Canceled and past unresolved appointments remain distinguishable in reporting.
- An event hold removes overlapping listings that share resources. A held listing automatically reappears at expiry if it is set to publish and its resources are still free. Event pricing displayed on the website and quoted for a specific date both come from the active inventory.
- An authenticated, agreed deposit receipt records the payment, confirms the reservation and queues the guest email. A deposit is accepted only for the linked eligible window and for its approved USD amount. The system does not create charges or sign contracts.
- Recurring follow-ups run at days 1, 4 and 11 by default. The cadence is configurable. A reply, opt-out, booked tour or closed lead prevents older follow-ups. Staff handoffs and unrecoverable delivery failures are visible in Operations.

## Connect a staging environment

1. Apply `migrations/001_venue_automation.sql` to a new PostgreSQL database and set `DATABASE_URL`. Use a separate database for staging. Create random staff, offer, receipt and cron secrets with at least 32 characters.
2. Sign in at `/operations`. Add Scott's current event holds and bookings before publishing open inventory. Enter approved deposit amounts, event package windows, room/cabin overlaps, tour availability and answers. Rates and capacity from the VenueX audit should be reconciled with Scott before being approved.
3. Configure a Microsoft Graph app for the intended venue mailbox and calendar. Limit its mailbox access to the intended mailbox using the organization's Exchange application access controls. The integration uses mail read/write and send capabilities plus calendar read/write. Use a dedicated intake folder with rules for the approved inquiry channels and their replies. Start with `HORSEHEAD_SEND_MODE=shadow`, a test folder and a fresh `HORSEHEAD_INBOX_START_AT`.
4. Schedule the host to send `GET /api/venue/run` with `Authorization: Bearer <CRON_SECRET>` once per minute. Use the host's scheduler or an independent HTTP scheduler. The worker stores jobs and checks provider delivery state before retrying sends. Connect only one primary scheduler for the intended environment.
5. Confirm the public inquiry, direct tour, email offer and signed deposit flows in staging with a test mailbox and database. Verify attendee notifications, staff handoff routing and booking collision handling. Run a few provider-specific marketplace messages through shadow mode and compare the drafts with Scott's usual responses.
6. Route production inquiries and deployment URLs only after that check. Set `HORSEHEAD_PUBLIC_URL` to the configured public origin. Enable `HORSEHEAD_SEND_MODE=live` for the mailbox only when the existing responder is disabled for that mailbox flow. Build with `NEXT_PUBLIC_HORSEHEAD_AUTOMATION_LIVE=true` to switch the website links. Existing VenueX links continue to work when the feature flag is off.

### Booking provider receipt

Connect the payment or booking provider through a trusted adapter that verifies the provider's payment and agreement first. Submit the following event to `POST /api/venue/receipt`:

```json
{
  "kind": "deposit_paid",
  "currency": "USD",
  "eventId": "payment-provider-event-id",
  "providerReference": "verified-deposit-reference",
  "windowId": "approved-horsehead-window-uuid",
  "amountCents": 250000,
  "email": "guest@example.com"
}
```

Set `X-Horsehead-Timestamp` to the current Unix seconds and `X-Horsehead-Signature` to base64url HMAC-SHA256 over the timestamp, a period, and the exact request body, keyed by `HORSEHEAD_RECEIPT_SECRET`. Keep this secret server-side. Duplicate events and payment references return a successful duplicate status. A conflict returns HTTP 409 and should be surfaced by the adapter for reconciliation. Derive the window ID and amount from the approved booking record, with the provider's confirmed payment data used to verify amount and currency.

The operations dashboard shows results for activity recorded in this system. Historical events and outcomes need a verified migration. The current intake channels are the website inquiry form and Outlook email. There is no SMS or independent live web chat connection in this branch.
