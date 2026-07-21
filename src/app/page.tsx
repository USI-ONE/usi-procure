"use client";

import { useMemo, useState } from "react";

type PaymentTerms = "net" | "credit_card" | "both" | "unknown";

interface Offer {
  vendorId: string;
  vendorName: string;
  price: number | null;
  currency: string;
  inStock: boolean | null;
  availableQty: number | null;
  paymentTerms: PaymentTerms;
  productUrl: string;
  collectedAt: string;
}

interface VendorResult {
  vendorId: string;
  vendorName: string;
  offers: Offer[];
  error?: string;
  elapsedMs: number;
}

interface SearchResponse {
  sku: string;
  results: VendorResult[];
  searchedAt: string;
}

type SortKey = "price" | "availability" | "vendor";

const TERMS_LABEL: Record<PaymentTerms, string> = {
  net: "Net terms",
  credit_card: "Credit card",
  both: "Net / CC",
  unknown: "—",
};

export default function Home() {
  const [sku, setSku] = useState("");
  const [data, setData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sortKey, setSortKey] = useState<SortKey>("price");
  const [inStockOnly, setInStockOnly] = useState(false);

  async function runSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = sku.trim();
    if (!q) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/search?sku=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error((await res.json()).error ?? res.statusText);
      setData(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  // Flatten to one row per offer, then filter + sort for display.
  const offers = useMemo(() => {
    if (!data) return [];
    const rows = data.results.flatMap((r) => r.offers);
    const filtered = inStockOnly ? rows.filter((o) => o.inStock) : rows;
    return [...filtered].sort((a, b) => {
      if (sortKey === "vendor") return a.vendorName.localeCompare(b.vendorName);
      if (sortKey === "availability")
        return (b.availableQty ?? 0) - (a.availableQty ?? 0);
      // price ascending, nulls last
      return (a.price ?? Infinity) - (b.price ?? Infinity);
    });
  }, [data, sortKey, inStockOnly]);

  const emptyVendors = data?.results.filter((r) => r.offers.length === 0);

  // "Best" = cheapest in-stock offer (already price-sorted when sortKey=price,
  // but compute independently so it holds under any sort).
  const best = useMemo(
    () =>
      [...offers]
        .filter((o) => o.inStock && o.price != null)
        .sort((a, b) => (a.price ?? 0) - (b.price ?? 0))[0],
    [offers],
  );

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          USI Purchasing Intelligence
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Search a manufacturer SKU across USI&rsquo;s distributor network.
          <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-800">
            Mock data — live vendor APIs pending credentials
          </span>
        </p>
      </header>

      <form onSubmit={runSearch} className="flex gap-2">
        <input
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          placeholder="Enter manufacturer SKU (e.g. 5CG2140XYZ)"
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      {error && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {data && (
        <section className="mt-8">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-gray-500">
              Results for{" "}
              <span className="font-medium text-gray-900">{data.sku}</span> ·
              collected {new Date(data.searchedAt).toLocaleTimeString()}
            </div>
            <div className="flex items-center gap-3 text-sm">
              <label className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                />
                In stock only
              </label>
              <label className="flex items-center gap-1.5">
                Sort
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value as SortKey)}
                  className="rounded border border-gray-300 px-1.5 py-1"
                >
                  <option value="price">Price</option>
                  <option value="availability">Availability</option>
                  <option value="vendor">Vendor</option>
                </select>
              </label>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Vendor</th>
                  <th className="px-4 py-2.5 font-medium">Price</th>
                  <th className="px-4 py-2.5 font-medium">Availability</th>
                  <th className="px-4 py-2.5 font-medium">Terms</th>
                  <th className="px-4 py-2.5 font-medium">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {offers.map((o) => {
                  const isBest = best && o.vendorId === best.vendorId;
                  return (
                    <tr key={o.vendorId} className={isBest ? "bg-green-50" : ""}>
                      <td className="px-4 py-2.5 font-medium">
                        {o.vendorName}
                        {isBest && (
                          <span className="ml-2 rounded bg-green-600 px-1.5 py-0.5 text-xs text-white">
                            best
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        {o.price != null
                          ? o.price.toLocaleString("en-US", {
                              style: "currency",
                              currency: o.currency,
                            })
                          : "—"}
                      </td>
                      <td className="px-4 py-2.5">
                        {o.inStock ? (
                          <span className="text-green-700">
                            In stock
                            {o.availableQty ? ` (${o.availableQty})` : ""}
                          </span>
                        ) : (
                          <span className="text-gray-400">Out of stock</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        {TERMS_LABEL[o.paymentTerms]}
                      </td>
                      <td className="px-4 py-2.5">
                        <a
                          href={o.productUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View →
                        </a>
                      </td>
                    </tr>
                  );
                })}
                {offers.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-gray-400"
                    >
                      No offers match the current filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {emptyVendors && emptyVendors.length > 0 && (
            <p className="mt-3 text-xs text-gray-400">
              No result from:{" "}
              {emptyVendors
                .map((v) => v.vendorName + (v.error ? " (error)" : ""))
                .join(", ")}
            </p>
          )}
        </section>
      )}
    </main>
  );
}
