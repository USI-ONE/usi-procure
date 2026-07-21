# usi-procure

**Purchasing Intelligence Tool** — a centralized web tool that searches USI's distributor/reseller
network for a given SKU and returns a consolidated view of pricing, availability, and purchasing terms.

USI is an MSP reseller; today the purchasing team compares pricing and stock across vendor sites by
hand — copy a SKU, search each site, compare manually. This tool automates that comparison.

> Status: **planning / requirements** — no application code yet. See [`docs/`](docs/).

## What it does (MVP)

Enter a manufacturer SKU → the tool queries supported vendors and returns one table with, per vendor:

- Current price
- Stock availability
- Vendor name
- Payment terms (Account / Net terms vs. Credit card)
- Direct link to the product page
- Timestamp of when pricing was collected

Sort and filter by price, availability, or vendor.

## Vendors

**Primary:** TD SYNNEX · Ingram Micro · D&H · Amazon Business
**Secondary:** ASI · Newegg · B&H Photo · Bestlink · eBay

Designed so additional vendors and data sources can be added over time.

## Docs

- [`docs/project-brief.md`](docs/project-brief.md) — the original brief
- [`docs/vendors.md`](docs/vendors.md) — per-vendor data-access notes (API vs. scrape)
- [`docs/architecture.md`](docs/architecture.md) — proposed architecture & open questions
- [`docs/roadmap.md`](docs/roadmap.md) — MVP → future enhancements
