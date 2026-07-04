---
name: eos-baas-embedded-payments
description: 'Use when integrating the eOS Embedded Payments product — Banking-as-a-Service: let partner fintechs embed accounts and payments via a single API on Bank Esh''s license.'
---

# Embedded Payments

Embedded Payments transforms a licensed bank into a Banking-as-a-Service (BaaS) provider. The sponsor bank holds the license and clearing relationships; a fintech partner integrates over a single API to offer real current accounts and payments to its own end-customers. The live BaaS surface delivers the integration foundation — OAuth 2.0 client-credentials authentication, short-lived JWT Bearer tokens, per-partner rate limiting, request signing on protected calls (ES256/RS256 via X-Partner-* headers), and RFC 9457 problem-details errors — plus the Partner Payments API: originate and track transfers over eOS rails (MASAV first), with returns, cancellation, and signed transfer.* webhook events. Account and transaction APIs are on the roadmap.

**Domain:** baas · **Status:** beta

## Capabilities

- OAuth 2.0 client-credentials authentication
- Short-lived JWT Bearer tokens (15 min)
- Request signing on protected calls (ES256/RS256)
- Per-partner rate limiting
- RFC 9457 problem-details errors
- Transfers API — originate, return, cancel, and track payments
- Signed transfer.* webhook events (HMAC-SHA256, Standard-Webhooks)

## Endpoints

### BaaS API

Live BaaS connectivity and security endpoints. Every path lives under /v3/baas/.

Base path: `/v3/baas`

- `POST /v3/baas/auth/token` — Exchange client_credentials (form-encoded) for a 15-minute JWT Bearer token.
- `GET /v3/baas/health` — Confirm connectivity and read the service version. No auth required.
- `GET /v3/baas/ping` — Protected liveness check — requires a Bearer token plus the four X-Partner-* request-signing headers. Returns 204 on success.

### Transfers

Partner Payments API — originate and track payments over eOS rails (MASAV first; rail-agnostic by design). One resource covers all transfer types. Every path lives under /v3/baas/.

Base path: `/v3/baas`

- `POST /v3/baas/transfers` — Originate an outgoing transfer — direction credit (push) or debit (pull). Body: direction, rail_type (ach|swift|faster_payments), amount (decimal string), currency (ISO 4217), optional value_date and reference. Idempotency-Key header required; replays within 24h return the original (HTTP 409). Returns 201 with the created transfer (status=created).
- `GET /v3/baas/transfers/{correlationId}` — Fetch a single transfer by its external correlation id. Returns 200 with the transfer, or 404 if unknown / not owned by the partner.
- `GET /v3/baas/transfers` — List/filter transfers (cursor paged; filters: status, transfer_type, rail_type, value_date, related_to, created_after/before). Deferred — partners mostly consume lifecycle via webhooks; returns an empty page for now.
- `POST /v3/baas/transfers/{correlationId}/return` — Originate a return of a received incoming transfer. Body: reason (enum), optional reason_code (raw rail code) and reference. The server derives the return variant and creates a NEW transfer linked via related_transfer_correlation_id — a return is its own transfer, not a status flip. 201 on success, 404 if unknown, 422 if not returnable. Idempotency-Key required.
- `POST /v3/baas/transfers/{correlationId}/cancel` — Cancel a transfer while it is still pre-submission (before the ~18:40 MASAV batch). 200 on success; 409 once the transfer is on the rail (already submitted/terminal).

## Webhook events

- `transfer.submitted` (hmac-sha256, live) — Transfer object with id, amount, currency, rail, status: submitted
- `transfer.reconciled` (hmac-sha256, live) — Transfer object with status: reconciled and updated_at reflecting the clearing time
- `transfer.returned` (hmac-sha256, live) — Embeds both the original transfer and the return transfer objects; use the original id to reconcile records
- `transfer.credit_received` (hmac-sha256, live) — Transfer object with direction: credit, rail, amount
- `transfer.debit_received` (hmac-sha256, live) — Transfer object with direction: debit, rail, amount
- `consent.revoked` (hmac-sha256, beta) — consent_id, customer_id, revocation reason, revoked_at

## Docs

- Docs index: https://backoffice-documentation-bucket.s3.eu-west-1.amazonaws.com/baas-portal-v1/llms.txt
- Product detail: https://backoffice-documentation-bucket.s3.eu-west-1.amazonaws.com/baas-portal-v1/products/embedded-payments/v1.json

**API base URL** — read it from your Build with AI portal page; it is environment-specific.
