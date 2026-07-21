import type { Offer, PaymentTerms, VendorConnector } from "./types";

/**
 * Mock connector factory. Produces deterministic, SKU-derived fake offers so the
 * full pipeline (UI → orchestrator → connector) works end-to-end before real
 * vendor API credentials are provisioned. Each real vendor replaces its mock with
 * a live implementation of the same `VendorConnector` interface.
 */

/** Small deterministic string hash so the same SKU yields the same mock numbers. */
function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

interface MockConfig {
  id: string;
  name: string;
  /** Base multiplier so vendors differ from each other predictably. */
  priceBias: number;
  paymentTerms: PaymentTerms;
  urlTemplate: (sku: string) => string;
  /** ~fraction of SKUs this vendor "stocks" (0..1). */
  stockRate: number;
}

function makeMock(cfg: MockConfig): VendorConnector {
  return {
    id: cfg.id,
    name: cfg.name,
    live: false,
    async search(sku: string): Promise<Offer[]> {
      const seed = hash(`${cfg.id}:${sku}`);
      // Simulate network latency (80–400ms) so the UI's loading state is real.
      const latency = 80 + (seed % 320);
      await new Promise((r) => setTimeout(r, latency));

      // Some vendors simply don't carry a given SKU.
      const carries = (seed % 100) / 100 < 0.85;
      if (!carries) return [];

      const base = 90 + (seed % 900); // $90–$990 base
      const price = Math.round(base * cfg.priceBias * 100) / 100;
      const inStock = (seed % 100) / 100 < cfg.stockRate;
      const availableQty = inStock ? 1 + (seed % 50) : 0;

      return [
        {
          vendorId: cfg.id,
          vendorName: cfg.name,
          price,
          currency: "USD",
          inStock,
          availableQty,
          paymentTerms: cfg.paymentTerms,
          productUrl: cfg.urlTemplate(sku),
          collectedAt: new Date().toISOString(),
          raw: { mock: true, seed },
        },
      ];
    },
  };
}

export const mockConnectors: VendorConnector[] = [
  makeMock({
    id: "td-synnex",
    name: "TD SYNNEX",
    priceBias: 0.98,
    paymentTerms: "net",
    stockRate: 0.75,
    urlTemplate: (sku) =>
      `https://ec.synnex.com/ecx/search.html?q=${encodeURIComponent(sku)}`,
  }),
  makeMock({
    id: "ingram-micro",
    name: "Ingram Micro",
    priceBias: 1.0,
    paymentTerms: "net",
    stockRate: 0.8,
    urlTemplate: (sku) =>
      `https://usa.ingrammicro.com/Site/Search?searchKeyword=${encodeURIComponent(sku)}`,
  }),
  makeMock({
    id: "dh",
    name: "D&H",
    priceBias: 1.02,
    paymentTerms: "net",
    stockRate: 0.65,
    urlTemplate: (sku) =>
      `https://www.dandh.com/v4/view?pageReq=search&q=${encodeURIComponent(sku)}`,
  }),
  makeMock({
    id: "amazon-business",
    name: "Amazon Business",
    priceBias: 1.05,
    paymentTerms: "both",
    stockRate: 0.9,
    urlTemplate: (sku) =>
      `https://www.amazon.com/s?k=${encodeURIComponent(sku)}`,
  }),
];
