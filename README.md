# usi-procure

**Purchasing Intelligence Tool** — a centralized web tool that searches USI's distributor/reseller
network for a given SKU and returns a consolidated view of pricing, availability, and purchasing terms.

USI is an MSP reseller; today the purchasing team compares pricing and stock across vendor sites by
hand — copy a SKU, search each site, compare manually. This tool automates that comparison.

> Status: **MVP scaffold running on mock data.** The full pipeline (search UI → orchestrator →
> vendor connectors → results table) works end-to-end; each vendor currently uses a mock connector.
> Real vendor APIs drop in behind the same interface once credentials are provisioned. See
> [`docs/`](docs/).

## 🔗 Wireframe (for review)

**Live:** https://usi-procure-wireframes.vercel.app — public, three tabs:
**Wireframe** (tool mockup), **Requirements** (scope from the scoping meeting), and
**Proposed Architecture**. Static HTML in [`wireframes/`](wireframes/), same design system as the
GMW project. Deploy with `vercel --prod` from `wireframes/`.

## Running locally

```bash
npm install
npm run dev        # http://localhost:3000
```

Stack: Next.js (App Router, TypeScript) + Tailwind, Postgres via Neon (persistence phase),
deploy on Vercel.

### How vendors plug in

Every vendor implements `VendorConnector` (`src/lib/vendors/types.ts`): `search(sku) => Offer[]`.
The orchestrator (`src/lib/orchestrator.ts`) fans out to all registered connectors in parallel and
isolates failures. To wire a real vendor, replace its entry in `src/lib/vendors/index.ts` with a live
connector — nothing else changes.

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
