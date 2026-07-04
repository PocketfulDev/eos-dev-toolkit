---
name: eos-bank-api
description: "Use when making REST or GraphQL calls to the eOS bank platform — resolving the base URL, choosing the operator vs customer surface, and following the OpenAPI specs for accounts, deposits, and loans."
---

# Call the eOS bank platform API

## Steps

1. **Resolve the base URL** from the **Build with AI** page of your eOS developer portal (environment-specific — never hard-code it). Prepend it to the paths below.
2. **Start from the docs index** and follow links to the OpenAPI spec for the product you are integrating:
   `https://backoffice-documentation-bucket.s3.eu-west-1.amazonaws.com/universe-portal-v1/llms.txt`
   The specs are machine-readable — load the relevant one and generate typed requests rather than guessing shapes.
3. **Choose the surface by caller context** — operator/banker endpoints under `/v3/financial/...`, customer endpoints under `/v3/accounts/...`.
4. **Send the Bearer token** (see the `eos-bank-auth` skill) on every call. Handle standard error responses defensively; surface the platform's error body rather than swallowing it.

## Guardrails

- Prefer the OpenAPI specs over hand-written request shapes — they are the source of truth and change per release.
- Use the product skills (`eos-bank-deposits`, `eos-bank-loans`) for the endpoint list, then the OpenAPI spec for exact request/response schemas.
