# Architecture (Proposed)

> **Stack: LOCKED** — Next.js on Vercel, Postgres via Neon (matches USI/GMW). TypeScript throughout.
>
> **MVP vendor set: LOCKED** — TD SYNNEX, Ingram Micro, D&H, Amazon Business (all API-backed;
> USI has confirmed reseller accounts). Secondary/scrape vendors come in Phase 2.

## High-level shape

```
                 ┌─────────────────────────────┐
   User ───────► │  Web UI (Next.js)           │
   enters SKU    │  - search box               │
                 │  - results table (sort/filter)
                 └──────────────┬──────────────┘
                                │ /api/search?sku=...
                                ▼
                 ┌─────────────────────────────┐
                 │  Search orchestrator        │
                 │  - fan out to connectors    │
                 │  - normalize + aggregate    │
                 │  - timestamp each offer     │
                 └──────────────┬──────────────┘
                                │
        ┌───────────┬───────────┼───────────┬───────────┐
        ▼           ▼           ▼           ▼           ▼
   TD SYNNEX   Ingram Micro    D&H       eBay        ...more
   connector    connector   connector  connector    connectors
   (API)         (API)        (API)      (API)
        │
        ▼
   ┌─────────────────────────────┐
   │  Postgres (Neon)            │  ← MVP: cache recent results
   │  - offers (price history)   │     Future: full price-history DB,
   │  - skus, vendors            │     watchlists, alerts
   └─────────────────────────────┘
```

## Connector interface

Every vendor implements one interface so the orchestrator treats them uniformly:

```ts
interface VendorConnector {
  id: string;              // "td-synnex"
  name: string;            // "TD SYNNEX"
  search(sku: string): Promise<Offer[]>;
}

interface Offer {
  vendorId: string;
  vendorName: string;
  price: number | null;        // our buy price if available, else list
  currency: string;
  inStock: boolean | null;
  availableQty: number | null;
  paymentTerms: "net" | "credit_card" | "both" | "unknown";
  productUrl: string;
  collectedAt: string;         // ISO timestamp
  raw?: unknown;               // vendor payload for debugging
}
```

- API connectors call the vendor API and map the response to `Offer`.
- Scrape connectors drive a headless browser / parse HTML behind the same interface.
- A connector that fails (down, no result, blocked) returns `[]` and logs — one vendor failing must
  not fail the whole search.

## MVP scope decisions to make

- **Which vendors ship in MVP?** Suggest starting with the vendors we already have API access to
  (likely TD SYNNEX, Ingram, D&H) + eBay (public API) to prove the pattern end-to-end before tackling
  scrape-only vendors.
- **Sync vs. async search.** APIs are fast enough to query live per search. Scrape targets may need a
  background job + polling. MVP can be live-only over API vendors.
- **Caching.** Cache offers for N minutes to avoid hammering vendor APIs on repeat searches; the
  timestamp requirement doubles as cache metadata.

## Security / secrets

- Vendor API credentials are per-USI-account secrets → environment variables / Vercel secrets, never
  in the repo.
- Some vendor prices are our **negotiated** prices — treat result data as internal/confidential.

## Open architectural questions

1. Hosting: Vercel (matches GMW) vs. something that better supports long-running scrape jobs?
2. Auth: who can use the tool? Internal-only → simple SSO / allowlist.
3. Do we need a queue/worker for scrape vendors, or is a serverless cron enough?
4. Price-history granularity for the future analytics phase — store every search, or snapshot daily?
