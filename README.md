# eos-dev-toolkit

Claude Code plugins that give your coding agent ready-made skills for integrating with the eOS platform.

## Plugins

- **eos-bank** — building on the eOS bank platform (accounts, deposits, loans).
- **eos-baas** — eOS Banking-as-a-Service partner integrations (embedded accounts + payments).

## Install

```
/plugin marketplace add PocketfulDev/eos-dev-toolkit
/plugin install eos-bank@eos-dev-toolkit    # or: eos-baas@eos-dev-toolkit
```

Each plugin ships hand-authored core skills (auth, webhooks, API) plus one auto-generated skill per eOS product. All skills reference the public eOS documentation index; your environment's API base URL is shown on the **Build with AI** page of your eOS developer portal.

## Product skills are generated

`plugins/eos-*/skills/products/**` is generated from the eOS docs pipeline and refreshed by `scripts/sync-product-skills.mjs` (run in CI via `.github/workflows/sync-product-skills.yml`). Do not hand-edit those files.

The CI workflow's auto-PR step requires repo/org setting Settings -> Actions -> General -> "Allow GitHub Actions to create and approve pull requests" to be ON, otherwise PR creation 403s.
