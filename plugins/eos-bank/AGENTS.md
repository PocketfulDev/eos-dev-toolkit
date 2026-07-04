# eOS bank platform — agent instructions

You are integrating with the **eOS bank platform**. Follow these when building or modifying eOS integration code.

## Start here

- **Docs index (fetch first, follow links):** https://backoffice-documentation-bucket.s3.eu-west-1.amazonaws.com/universe-portal-v1/llms.txt
- **API base URL:** environment-specific — read it from the **Build with AI** page of your eOS developer portal. Never hard-code it.
- All doc pages are raw markdown or machine-readable API specs (OpenAPI/GraphQL), fetchable without authentication.

## Skills in this plugin

- `eos-bank-auth` — obtain and use access tokens (operator vs customer surfaces).
- `eos-bank-webhooks` — receive and verify signed event notifications.
- `eos-bank-api` — make REST/GraphQL calls against accounts, deposits, and loans.
- `eos-bank-<product>` — one generated skill per eOS product (endpoints, flows, webhook events).

## Rules

- Resolve the API base URL from the portal; keep credentials out of source control.
- Verify webhook signatures before acting on any event.
- Prefer the OpenAPI specs from the docs index over guessed request shapes.
