# eOS Banking-as-a-Service — agent instructions

You are integrating as an **eOS BaaS partner** (embedded accounts + payments on the sponsor bank's license). Follow these when building or modifying eOS integration code.

## Start here

- **Docs index (fetch first, follow links):** https://backoffice-documentation-bucket.s3.eu-west-1.amazonaws.com/baas-portal-v1/llms.txt
- **API base URL:** environment-specific — read it from the **Build with AI** page of your eOS developer portal. Never hard-code it.
- All doc pages are raw markdown or machine-readable API specs (OpenAPI/GraphQL), fetchable without authentication.

## Skills in this plugin

- `eos-baas-auth` — OAuth 2.0 client-credentials + request signing.
- `eos-baas-webhooks` — verify Standard-Webhooks HMAC-SHA256 signed events.
- `eos-baas-api` — call the Partner Payments API (originate/track transfers).
- `eos-baas-<product>` — one generated skill per eOS BaaS product (endpoints, flows, webhook events).

## Rules

- Resolve the API base URL from the portal; keep the client secret + signing keys in a secrets manager.
- Sign every protected call; verify every webhook signature.
- Prefer the OpenAPI specs from the docs index over guessed request shapes; respect per-partner rate limits.
