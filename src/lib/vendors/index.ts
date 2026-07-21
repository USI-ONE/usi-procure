import type { VendorConnector } from "./types";
import { mockConnectors } from "./mock";

/**
 * The active vendor registry. Today it's all mock connectors. As each real
 * integration lands, swap that vendor's mock entry for its live connector here —
 * nothing else in the app needs to change.
 *
 * MVP vendors (USI has confirmed reseller accounts):
 *   TD SYNNEX · Ingram Micro · D&H · Amazon Business
 */
export const connectors: VendorConnector[] = [...mockConnectors];

export function getConnectors(): VendorConnector[] {
  return connectors;
}

export * from "./types";
