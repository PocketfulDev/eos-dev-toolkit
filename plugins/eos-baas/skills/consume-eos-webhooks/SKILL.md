---
name: eos-baas-webhooks
description: "Use when receiving and verifying eOS BaaS webhook events (transfer.*, consent.*) — building the endpoint, verifying Standard-Webhooks HMAC-SHA256 signatures, and handling delivery semantics."
---

# Consume eOS BaaS webhooks

eOS delivers signed partner events (for example `transfer.submitted`, `transfer.reconciled`, `transfer.returned`, `consent.revoked`) to an HTTPS endpoint you register.

## Steps

1. **Expose an HTTPS POST endpoint** that returns `2xx` quickly; process asynchronously. The platform retries on non-2xx.
2. **Verify the signature before trusting the payload.** eOS BaaS webhooks follow the **Standard-Webhooks** spec with **HMAC-SHA256**. Read the signing headers and secret source from the docs index and verify every request:
   `https://backoffice-documentation-bucket.s3.eu-west-1.amazonaws.com/baas-portal-v1/llms.txt`
   Reject on verification failure.
3. **Make handlers idempotent** — key on the event id; redelivery happens.
4. **Confirm exact event names + payloads** from the `eos-baas-embedded-payments` product skill before wiring handlers.

## Guardrails

- Never act on an unverified webhook.
- Acknowledge fast; do downstream work off the request path.
- Base URLs come from the **Build with AI** portal page — do not hard-code them.
