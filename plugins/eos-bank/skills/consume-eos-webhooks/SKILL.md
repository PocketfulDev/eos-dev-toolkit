---
name: eos-bank-webhooks
description: "Use when receiving and verifying eOS bank platform webhook events (deposit.*, loan.* and similar) — building the endpoint, checking signatures, and handling delivery semantics."
---

# Consume eOS bank platform webhooks

eOS delivers signed event notifications (for example `deposit.opened`, `deposit.matured`, `deposit.coupon_paid`) to an HTTPS endpoint you register.

## Steps

1. **Expose an HTTPS POST endpoint** that returns `2xx` quickly and does the real work asynchronously — the platform retries on non-2xx.
2. **Verify the signature before trusting the payload.** eOS bank webhooks are signed (JWS, `rs256-jws`). Read the signing scheme, the header carrying the signature, and the key source from the docs index:
   `https://backoffice-documentation-bucket.s3.eu-west-1.amazonaws.com/universe-portal-v1/llms.txt`
   Reject any request whose signature does not verify.
3. **Make handlers idempotent** — key on the event id; the same event may be delivered more than once.
4. **Subscribe to only the events you need** and confirm the exact `event` names and payload shapes from the relevant product skill (e.g. `eos-bank-deposits` lists its `deposit.*` events and sample payloads).

## Guardrails

- Never act on an unverified webhook — signature verification is mandatory.
- Do not block the response on downstream processing; acknowledge fast, process off the request path.
- Your environment's base URLs come from the **Build with AI** portal page — do not hard-code them.
