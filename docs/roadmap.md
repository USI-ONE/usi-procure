# Roadmap

## Phase 0 — Requirements & access (current)

- [x] Capture brief
- [x] Confirm reseller accounts — Ingram, D&H, Amazon Business, TD SYNNEX ✅
- [x] Decide MVP vendor set — the four above
- [x] Lock stack & hosting decision — Next.js + Neon on Vercel
- [ ] Obtain/confirm **API credentials** for each of the four (account ≠ API key)
- [ ] Confirm each vendor's data-access approach (API vs. EDI) — see [`vendors.md`](vendors.md)

## Phase 1 — MVP

- [ ] Single SKU search
- [ ] Connector interface + 2–4 API-backed vendor connectors
- [ ] Search orchestrator (fan out, normalize, timestamp)
- [ ] Consolidated results table
- [ ] Inventory visibility where available
- [ ] Sort & filter by price / availability / vendor
- [ ] Links back to each vendor listing

## Phase 2 — Coverage & persistence

- [ ] Add remaining primary vendors
- [ ] Add secondary vendors (incl. scrape connectors)
- [ ] Persist every search → historical price database per SKU

## Phase 3 — Intelligence

- [ ] Price trend visualization
- [ ] Price-drop & inventory alerts
- [ ] Saved watchlists for frequently purchased products
- [ ] Predictive purchasing insights from historical pricing

## Phase 4 — Purchasing workflow

- [ ] Quote generation support
- [ ] Purchasing recommendations based on total landed cost, payment terms, and inventory
