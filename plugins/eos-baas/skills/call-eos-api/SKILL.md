---
name: eos-baas-api
description: "Use when making REST calls to the eOS BaaS Partner API — resolving the base URL, sending signed authenticated requests, and following the OpenAPI spec to originate and track payments/transfers."
---

# Call the eOS BaaS Partner API

## Steps

1. **Resolve the base URL** from the **Build with AI** page of your eOS developer portal (environment-specific — never hard-code it). BaaS endpoints sit under `/v3/baas/...`.
2. **Start from the docs index** and load the Partner API OpenAPI spec:
   `https://backoffice-documentation-bucket.s3.eu-west-1.amazonaws.com/baas-portal-v1/llms.txt`
   Generate typed requests from the spec rather than guessing shapes.
3. **Authenticate and sign** every protected call (see `eos-baas-auth`): Bearer token + `X-Partner-*` signature.
4. **Originate and track transfers** per the Partner Payments API — submit a transfer, then track it via status and the `transfer.*` webhooks (see `eos-baas-webhooks`). Handle returns and cancellation as documented.
5. **Parse errors as RFC 9457 problem-details.**

## Guardrails

- The OpenAPI spec is the source of truth for request/response schemas — prefer it over hand-written shapes.
- Respect per-partner rate limits; back off on `429` using the response's retry hint.
- Use the `eos-baas-embedded-payments` product skill for the endpoint list and flows, then the OpenAPI spec for exact schemas.
