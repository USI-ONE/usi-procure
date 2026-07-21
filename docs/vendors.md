# Vendor Data Access

The core engineering problem is **how we get price + stock for a SKU from each vendor**. Each vendor
falls into one of three buckets:

- **API** — official reseller/partner API. Cleanest, most reliable, needs a partner account + keys.
- **Scrape** — no usable API; automate the website (headless browser / HTML parsing). Fragile, may
  violate ToS, may require login/session handling.
- **Hybrid/TBD** — API may exist but access/terms unconfirmed.

> ⚠️ The specifics below are a **starting hypothesis** and must be confirmed against each vendor's
> current partner program and our account status. Do not treat as authoritative until verified.
>
> ✅ **Confirmed:** USI has active reseller accounts with **Ingram Micro, D&H, Amazon Business, and
> TD SYNNEX** — these four are the MVP vendor set. Next step per vendor is obtaining/confirming API
> credentials (not just the trading account).

## Primary vendors

| Vendor         | Account | Likely access | Notes |
|----------------|---------|---------------|-------|
| TD SYNNEX      | ✅ USI account | API      | ECExpress / partner API for price & availability, order status. Confirm API credential provisioning. |
| Ingram Micro   | ✅ USI account | API      | Ingram Micro xVantage / Reseller API (price & availability, product catalog). Confirm API key onboarding. |
| D&H            | ✅ USI account | API / EDI | D&H offers API / EDI feeds for price & availability to account holders. Confirm REST availability vs. EDI-only. |
| Amazon Business| ✅ USI account | API / Scrape | Amazon Business APIs are gated; Product Advertising API has strict eligibility. May need scraping of Business pricing while logged in. |

## Secondary vendors

| Vendor      | Likely access | Notes |
|-------------|---------------|-------|
| ASI         | API / TBD     | Distributor portal; confirm reseller API availability. |
| Newegg      | Scrape / API  | Newegg has a Marketplace/Seller API (for *selling*), not buyer pricing. Buyer-side likely scrape. |
| B&H Photo   | Scrape        | No public buyer API known; likely HTML scraping. |
| Bestlink    | TBD           | Smaller distributor — access approach unknown, investigate. |
| eBay        | API           | eBay Browse API (Buy APIs) returns listings, price, availability. Public, well-documented. |

## Open questions per vendor

1. Do we already have active reseller accounts + API credentials for TD SYNNEX, Ingram, D&H?
2. What are the rate limits / caching requirements of each API?
3. For scrape targets, does automated access violate ToS, and is there login/2FA in the way?
4. Is pricing account-specific (our negotiated price) or list price? The tool's value depends on
   surfacing **our** buy price, not MSRP.
5. Payment terms (Net vs. CC) — is this per-vendor-account config, or returned per-response?

## Design implication

Each vendor becomes a **connector** implementing a common interface (e.g. `search(sku) -> Offer[]`),
so vendors can be added/removed independently and API vs. scrape is an implementation detail behind
the interface. See [`architecture.md`](architecture.md).
