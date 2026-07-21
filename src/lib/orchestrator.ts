import { getConnectors } from "./vendors";
import type { VendorResult } from "./vendors/types";

export interface SearchResponse {
  sku: string;
  results: VendorResult[];
  searchedAt: string;
}

/**
 * Fan out a SKU search across every registered vendor connector in parallel.
 * One vendor failing (down, blocked, no result) must never fail the whole search —
 * each connector is isolated and its failure becomes a `VendorResult.error`.
 */
export async function searchSku(skuRaw: string): Promise<SearchResponse> {
  const sku = skuRaw.trim();
  const connectors = getConnectors();

  const results = await Promise.all(
    connectors.map(async (c): Promise<VendorResult> => {
      const started = Date.now();
      try {
        const offers = await c.search(sku);
        return {
          vendorId: c.id,
          vendorName: c.name,
          offers,
          elapsedMs: Date.now() - started,
        };
      } catch (err) {
        return {
          vendorId: c.id,
          vendorName: c.name,
          offers: [],
          error: err instanceof Error ? err.message : String(err),
          elapsedMs: Date.now() - started,
        };
      }
    }),
  );

  return { sku, results, searchedAt: new Date().toISOString() };
}
