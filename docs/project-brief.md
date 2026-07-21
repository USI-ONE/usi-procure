# Project Brief: Purchasing Intelligence Tool

## The Challenge

Our purchasing team spends significant time manually comparing pricing and availability across
multiple distributor and reseller websites. Today, the workflow requires copying a SKU, searching
each vendor individually, and manually comparing pricing, inventory, and purchasing terms. This
process is repetitive, time consuming, and makes it difficult to consistently identify the best
buying option.

## Objective

Build a centralized purchasing intelligence tool that automatically searches our distributor network
for a given SKU and returns a consolidated view of pricing, availability, and purchasing information.
The goal is to reduce procurement time, improve buying decisions, and create a foundation for more
advanced purchasing analytics over time.

## The Ask

Develop a web-based tool that accepts a manufacturer SKU (and eventually additional search methods)
and automatically queries our preferred purchasing sources.

For each vendor, the tool should surface:

- Current price
- Stock availability
- Vendor name
- Payment terms (Account / Net Terms vs. Credit Card)
- Direct link to the product page
- Timestamp of when the pricing was collected

**Primary vendors:** TD SYNNEX · Ingram Micro · D&H · Amazon Business

**Secondary vendors:** ASI · Newegg · B&H Photo · Bestlink · eBay

The platform should be designed with future expansion in mind, allowing additional vendors and data
sources to be added over time.

## Deliverables

### MVP

- Single SKU search
- Automated pricing comparison across supported vendors
- Consolidated results table
- Inventory visibility where available
- Sort and filter by price, availability, or vendor
- Links back to each vendor listing

### Future Enhancements

- Historical price database for every SKU searched
- Price trend visualization
- Predictive purchasing insights based on historical pricing
- Price-drop and inventory alerts
- Saved watchlists for frequently purchased products
- Quote generation support
- Purchasing recommendations based on total landed cost, payment terms, and inventory availability
