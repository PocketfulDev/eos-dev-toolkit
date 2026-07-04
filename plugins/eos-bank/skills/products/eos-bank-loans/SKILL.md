---
name: eos-bank-loans
description: Use when integrating the eOS Loans product — Loan origination, activation, repayment, refinancing, and nightly accounting — the full loan lifecycle.
---

# Loans

Loans runs a loan's entire life: operator-side origination and activation, borrower-driven guided flows for requests, full repayment and refinancing, and automated nightly EOD processing for interest accrual, arrears classification, scheduled payments, and annual summaries.

**Domain:** core-banking · **Status:** live

## Capabilities

- Loan origination
- Loan activation
- Loan acceleration
- Loan refinancing (operator approval)
- Loan write-off
- Credit report request
- Borrower self-service (request, repayment, refinancing)
- EOD accounting (arrears & interest, scheduled payments, annual summary)

## Endpoints

### Loans — Operator API

REST endpoints for operator-initiated loan administration on the /v3/loans surface.

Base path: `/v3/loans`

- `POST /v3/loans` — Loan Create
- `POST /v3/loans/{loan_id}/activate` — Loan Activate

### Loans — Borrower API

Guided flow endpoints for borrower-initiated loan actions on the /v3/flows surface.

Base path: `/v3/flows`

- `POST /v3/flows/flow2` — Flow Create 2
- `POST /v3/flows/flow/{flow_id}/step2` — Update Flow Step - LCPA

## Webhook events

- `loan.application_submitted` (rs256-jws, planned) — loan_id, applicant_customer_id, requested_amount, currency, submitted_at
- `loan.status_updated` (rs256-jws, planned) — loan_id, previous_status, new_status, updated_at, updated_by
- `loan.activated` (rs256-jws, planned) — loan_id, activated_at, disbursed_amount, currency, repayment_schedule_id
- `loan.repayment_received` (rs256-jws, planned) — loan_id, repayment_id, amount_paid, principal_portion, interest_portion, remaining_balance, paid_at
- `loan.refinanced` (rs256-jws, planned) — original_loan_id, new_loan_id, refinanced_at, new_principal, new_term_months
- `loan.eod_accounting` (rs256-jws, planned) — loan_id, accrual_date, interest_accrued, outstanding_balance, days_overdue
- `loan.closed` (rs256-jws, planned) — loan_id, closed_at, closure_reason, total_interest_paid

## Docs

- Docs index: https://backoffice-documentation-bucket.s3.eu-west-1.amazonaws.com/universe-portal-v1/llms.txt
- Product detail: https://backoffice-documentation-bucket.s3.eu-west-1.amazonaws.com/universe-portal-v1/products/loans/v1.json

**API base URL** — read it from your Build with AI portal page; it is environment-specific.
