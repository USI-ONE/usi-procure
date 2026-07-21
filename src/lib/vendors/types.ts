/**
 * Core vendor abstraction. Every vendor — API-backed or scraped — implements
 * `VendorConnector`, so the orchestrator treats them all uniformly. Adding a
 * vendor means adding one connector; the rest of the app doesn't change.
 */

export type PaymentTerms = "net" | "credit_card" | "both" | "unknown";

/** A single price/availability result for a SKU from one vendor. */
export interface Offer {
  vendorId: string;
  vendorName: string;
  /** Our buy price if the vendor exposes it, else list price. null if unknown. */
  price: number | null;
  currency: string;
  inStock: boolean | null;
  availableQty: number | null;
  paymentTerms: PaymentTerms;
  /** Deep link to the vendor's product page for this SKU. */
  productUrl: string;
  /** ISO timestamp of when this offer was collected. */
  collectedAt: string;
  /** Raw vendor payload, kept for debugging. Not rendered. */
  raw?: unknown;
}

/** Outcome of querying a single vendor: either offers or a failure reason. */
export interface VendorResult {
  vendorId: string;
  vendorName: string;
  offers: Offer[];
  /** Present when the vendor query failed; the search as a whole still succeeds. */
  error?: string;
  /** Milliseconds the connector took to respond. */
  elapsedMs: number;
}

export interface VendorConnector {
  /** Stable machine id, e.g. "td-synnex". */
  id: string;
  /** Human name, e.g. "TD SYNNEX". */
  name: string;
  /** True once real credentials/integration are wired; false for mock stubs. */
  live: boolean;
  /** Query the vendor for a manufacturer SKU. Must not throw — return [] on no result. */
  search(sku: string): Promise<Offer[]>;
}
