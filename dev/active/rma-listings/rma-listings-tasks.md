# RMA Listings — Tasks

Last Updated: 2026-04-29 (rev 2 — Swagger confirmed)
Status: **Ready — Phase 0 unblocked once RMA credentials arrive**

---

## Phase 0 — Confirm Status Values (XS, do first when credentials arrive)

- [ ] **T0.1** Make one test call: `GET /agent/layne-hughes-at845/sales/listings?take=5`
  - Log raw `Status` values from response
  - Confirm `CampaignCode` is non-null and unique across results
  - Update status mapping table in `rma-listings-context.md` with actual values
  - **Acceptance:** Status string values confirmed and documented before T1.1

---

## Phase 1 — `lib/listings.ts`

- [ ] **T1.1** Write `parsePrice(raw: string | null)` helper
  - Input: RMA `Price` string e.g. `"Sold $985,000"` or `null`
  - Returns `{ price: number | null, priceDisplay: string }`
  - Regex extracts first numeric sequence; strips commas; parses to int
  - If no match or null input: `{ price: null, priceDisplay: 'Price on application' }`
  - **Acceptance:** Unit-testable pure function, handles null, handles non-numeric strings

- [ ] **T1.2** Write `generateSlug(street: string, suburb: string): string` helper
  - `${street}-${suburb}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  - Example: `"42 Broderick Road", "Johnsonville"` → `"42-broderick-road-johnsonville"`
  - **Acceptance:** Output is URL-safe and matches the slug format used in mock data

- [ ] **T1.3** Write `mapRmaListing(r: RmaListingModel): Listing`
  - Map all confirmed fields using the table in `rma-listings-context.md`
  - Use status string mapping confirmed in T0.1
  - Sort `Images` by `Order`, take first 6, extract `.Url`
  - Convert `ResultDate` to `YYYY-MM-DD` for `soldAt`
  - `listedAt`: `ResultDate?.split('T')[0]` for sold, today's date for active
  - `inspections`: `AuctionDate` ? `[{ date: ..., time: 'Auction' }]` : `[]`
  - **Acceptance:** All `Listing` fields populated; no TypeScript errors

- [ ] **T1.4** Write `getRmaListings(): Promise<Listing[]>`
  - Return `[]` immediately if `!process.env.RATEMYAGENT_CLIENT_ID`
  - Call `getRmaToken()` from `lib/rmaToken.ts`
  - Fetch `GET /agent/${AGENT_CODE}/sales/listings` with Bearer token
  - `next: { revalidate: 21600 }`
  - Handle pagination: if `Total > take`, fetch remaining pages and concat
  - Map each result with `mapRmaListing()`
  - Return `[]` on any error (catch, don't throw)
  - **Acceptance:** Returns `Listing[]` from RMA; returns `[]` when credentials absent; handles >100 results

- [ ] **T1.5** Write `getSanityListings(): Promise<Listing[]>`
  - GROQ: `*[_type == "listing"] | order(status asc, listedAt desc)`
  - Use client from `lib/sanity.ts`
  - Tag: `next: { tags: ['listings'] }`
  - **Acceptance:** Returns Sanity listings as `Listing[]`

- [ ] **T1.6** Write `getListings(): Promise<Listing[]>`
  - `const rma = await getRmaListings()`
  - `const listings = rma.length > 0 ? rma : await getSanityListings()`
  - Sort: for-sale/for-rent first (`status !== 'sold' && status !== 'leased'`), then by `soldAt` desc
  - **Acceptance:** Returns RMA data when available; falls back to Sanity; correct sort order

---

## Phase 2 — Wire Pages

- [ ] **T2.1** Update `app/listings/page.tsx`
  - Remove `import { MOCK_LISTINGS }`
  - Add `import { getListings } from '@/lib/listings'`
  - Make component async, `const listings = await getListings()`
  - **Acceptance:** `/listings` renders live data

- [ ] **T2.2** Update `app/listings/[slug]/page.tsx`
  - Remove `MOCK_LISTINGS` references
  - `generateStaticParams`: `const listings = await getListings(); return listings.map(l => ({ slug: l.slug }))`
  - `generateMetadata` + page component: find listing from `await getListings()`
  - **Acceptance:** Detail pages render; `generateStaticParams` builds all slugs; unknown slug → 404

---

## Phase 3 — Verify

- [ ] **T3.1** `npm run build` — TypeScript clean, all listing routes in build output

- [ ] **T3.2** Fallback test: comment out `RATEMYAGENT_CLIENT_ID` in `.env.local` → `npm run dev` → `/listings` shows Sanity data, no console errors → restore env var

- [ ] **T3.3** Remove `MOCK_LISTINGS` from `lib/mockData.ts` imports across all pages (keep the file for now — mock data may still be referenced in `generateStaticParams` during build if Sanity is also empty)

---

## Notes

- `getRmaToken()` is already implemented and tested via reviews — do not re-implement
- The `Listing` type in `types/index.ts` has `price: number | null` and `priceDisplay: string` — the string-price from RMA maps cleanly to this split
- Define a local `RmaListingModel` TypeScript interface in `lib/listings.ts` matching the Swagger `ListingModel` shape — do not import from a shared types file since this is API-internal
