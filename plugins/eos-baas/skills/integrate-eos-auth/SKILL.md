---
name: eos-baas-auth
description: "Use when authenticating a BaaS partner integration with eOS — OAuth 2.0 client-credentials, short-lived Bearer tokens, and request signing on protected calls."
---

# Authenticate as an eOS BaaS partner

The eOS Banking-as-a-Service surface uses **OAuth 2.0 client-credentials**. Every protected call needs both a Bearer token and a request signature.

## Steps

1. **Find your environment's API base URL** on the **Build with AI** page of your eOS developer portal (sandbox vs production differ). Never hard-code it.
2. **Read the Authentication guide** from the docs index and follow the "Getting Started — Authentication" link:
   `https://backoffice-documentation-bucket.s3.eu-west-1.amazonaws.com/baas-portal-v1/llms.txt`
   It specifies the token endpoint, the client-credentials grant, and the token lifetime (short-lived JWT — refresh before expiry).
3. **Send `Authorization: Bearer <token>`** on every call.
4. **Sign protected requests.** Partner calls are signed (ES256/RS256) via `X-Partner-*` headers. Read the exact signing input, header names, and key registration from the request-signing reference linked in the docs index. An unsigned or wrongly-signed protected call is rejected.
5. **Handle errors as RFC 9457 problem-details** — parse the `application/problem+json` body rather than only the status code.

## Guardrails

- Keep the client secret and signing keys in a secrets manager — never in source or client-side code.
- Refresh the token proactively; do not retry-loop on `401`.
- Signing is mandatory on protected calls — do not skip it in any environment.
