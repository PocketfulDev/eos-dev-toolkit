---
name: eos-bank-deposits
description: Use when integrating the eOS Deposits product — Term + demand deposits, coupon payouts, and early-withdraw fine calculations.
---

# Deposits

Term deposit origination with coupon scheduling, early-withdrawal calculations, and demand savings. Covers the full lifecycle from opening through interest accrual and customer payout.

**Domain:** core-banking · **Status:** live

## Capabilities

- Term deposit origination
- Coupon payout scheduling
- Early withdrawal fine calculation
- Balance & statistics queries
- Demand savings accounts
- Cash deposit and withdrawal on GL accounts
- Tax withholding on interest
- Operational fee processing

## Endpoints

### Deposits — Operator API

REST endpoints for operator-initiated deposit operations on the /v3/financial surface.

Base path: `/v3/financial`

- `POST /v3/financial/{account_id}/deposit_cash` — Deposit Cash
- `POST /v3/financial/{account_id}/withdraw` — Withdraw
- `POST /v3/financial/{account_id}/withdraw_tax` — Withdraw Tax payment
- `POST /v3/financial/{account_id}/operational_fee` — Create Operational Fee Withdraw
- `POST /v3/financial/{account_id}/deposit_term` — Create Term Deposit
- `POST /v3/financial/{deposit_id}/deposit_term_interest` — Create Term Deposit Interest
- `POST /v3/financial/{deposit_id}/close_term` — Close Term Deposit

### Deposits — Customer API

REST endpoints for customer-initiated deposit operations on the /v3/accounts surface.

Base path: `/v3/accounts`

- `POST /v3/accounts/{account_id}/deposit_cash` — Customer — Deposit cash to account
- `POST /v3/accounts/{account_id}/withdraw_cash` — Customer — Withdraw cash from account
- `POST /v3/accounts/{account_id}/deposit_term` — Customer — Open term deposit by template

## Webhook events

- `deposit.opened` (rs256-jws, planned) — deposit_id, product_type, principal, currency, term_days, opened_at
- `deposit.daily` (rs256-jws, planned) — deposit_id, accrual_date, interest_accrued, running_balance
- `deposit.matured` (rs256-jws, planned) — deposit_id, matured_at, final_balance, total_interest_earned
- `deposit.coupon_paid` (rs256-jws, planned) — deposit_id, coupon_date, coupon_amount, currency
- `deposit.early_withdrawal` (rs256-jws, planned) — deposit_id, withdrawn_at, amount_withdrawn, fine_applied, remaining_balance
- `deposit.closed` (rs256-jws, planned) — deposit_id, closed_at, closure_reason, final_disbursement

## Docs

- Docs index: https://backoffice-documentation-bucket.s3.eu-west-1.amazonaws.com/universe-portal-v1/llms.txt
- Product detail: https://backoffice-documentation-bucket.s3.eu-west-1.amazonaws.com/universe-portal-v1/products/deposits/v1.json

**API base URL** — read it from your Build with AI portal page; it is environment-specific.
