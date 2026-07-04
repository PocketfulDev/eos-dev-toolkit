---
name: eos-bank-auth
description: "Use when authenticating against the eOS bank platform — obtaining and using access tokens for operator (banker) and customer API calls before any other eOS request."
---

# Authenticate with the eOS bank platform

Every eOS API call needs a valid access token. There are two calling contexts:

- **Operator / banker** — back-office actions on the `/v3/financial` surface (e.g. opening a term deposit for a customer).
- **Customer** — end-customer actions on the `/v3/accounts` surface (e.g. depositing to their own account).

## Steps

1. **Find your environment's API base URL.** It is environment-specific (sandbox vs production). Read it from the **Build with AI** page of your eOS developer portal — do not hard-code it.
2. **Read the Authentication guide.** Start from the docs index and follow the "Getting Started — Authentication" link:
   `https://backoffice-documentation-bucket.s3.eu-west-1.amazonaws.com/universe-portal-v1/llms.txt`
   It specifies the token endpoint, grant type, token lifetime, and the exact header to send.
3. **Acquire a token**, then send it as `Authorization: Bearer <token>` on every protected call. Tokens are short-lived — refresh before expiry rather than per request.
4. **Pick the right surface for the context** — operator calls go to `/v3/financial/...`, customer calls to `/v3/accounts/...`. Using the wrong surface returns an authorization error.

## Guardrails

- Never store tokens in client-side storage or commit them. Keep credentials in environment variables / a secrets manager.
- On `401`/`403`, re-check the token freshness and that the surface matches the caller context before retrying — do not loop on auth failures.

For endpoint-level detail, consult the product skills in this plugin (e.g. `eos-bank-deposits`) and the docs index above.
