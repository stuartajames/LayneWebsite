# RateMyAgent Listings — Plan

Last Updated: 2026-04-29 (rev 2 — Swagger confirmed)

---

## Executive Summary

Wire up property listings from the RateMyAgent Developer API as the primary source, with Sanity as fallback. The Swagger spec confirms a `GET /agent/{agentCode}/sales/listings` endpoint exists, supports status filtering, and returns both active and sold listings. Sanity is only needed for listings Layne has not entered into RMA, or as a full fallback when API credentials are absent.

---

## Confirmed API Details (from `dev/RateMyAgentSwagger.json`)

### Endpoint
```
GET /agent/{agentCode}/sales/listings
Authorization: Bearer {token}
Scope required: read:agent-data   ← same scope as reviews, no extra permissions needed
```

### Query Parameters
| Param | Type | Notes |
|---|---|---|
| `statuses` | `string[]` | Filter by listing status — fetch all by omitting, or filter to `["Current","Sold"]` etc. Exact status string values not enumerated in spec — confirm from first API response |
| `skip` | int32 | Pagination offset |
| `take` | int32 | Page size |

### Response: `ListingModelResults`
```typescript
{
  Results: ListingModel[]
  Total: number   // int64
  Take: number
  Skip: number
}
```

### `ListingModel` — Full Field Mapping

| RMA field | Type | Maps to our `Listing` field | Notes |
|---|---|---|---|
| `CampaignCode` | string | `id` | Closest thing to a unique ID in the model |
| *(generated)* | — | `slug` | Generate from `StreetAddress` + `Suburb` |
| `StreetAddress` | string | `address.street` | |
| `Suburb` | string | `address.suburb` | |
| `State` | string | `address.city` | Will be "Wellington" for NZ — or hardcode |
| `Postcode` | string | `address.postcode` | |
| `Status` | string | `status` | Map to our enum — see Status Mapping below |
| `Price` | **string** | `priceDisplay` | RMA sends price as a formatted string, not a number |
| `Bedrooms` | int32 | `bedrooms` | |
| `Bathrooms` | int32 | `bathrooms` | |
| `Carparks` | int32 | `carSpaces` | |
| `Images[]` | `ListingImageModel[]` | `images[]` | Sort by `Order`, take first 6, use `Url` |
| `Description` | string | `description` | May be null |
| `ResultDate` | date-time | `soldAt` | Only present for sold listings |
| `AuctionDate` | date-time | `inspections` | Use as single inspection date if present |
| `ListingUrl` | string | — | External RMA link, not stored in Listing |
| `PropertyCoverImage` | string | — | First image already in `Images[]` |

### Status Mapping

RMA `Status` is a free string — exact values unknown until first API call. Likely mapping:

| RMA Status (estimated) | Our `status` |
|---|---|
| `"Current"` or `"Active"` | `'for-sale'` |
| `"Sold"` | `'sold'` |
| `"Leased"` | `'leased'` |
| `"ForRent"` or `"Rental"` | `'for-rent'` |

Log unknown status values in dev and map to `'sold'` as safe default.

### Important: `Price` is a String

Unlike what was assumed in the original plan, `Price` is a **formatted string** (e.g. `"Sold $985,000"`, `"Offers over $795,000"`, `"Contact agent"`). This means:
- Use `Price` directly as `priceDisplay`
- Attempt to extract a numeric value with a regex for `price: number | null`
- If no number found, set `price: null`

```typescript
function parsePrice(raw: string | null): { price: number | null; priceDisplay: string } {
  if (!raw) return { price: null, priceDisplay: 'Price on application' }
  const match = raw.match(/[\d,]+/)
  const price = match ? parseInt(match[0].replace(/,/g, ''), 10) : null
  return { price, priceDisplay: raw }
}
```

### `listedAt` — Not Available from RMA

`ListingModel` has no listed date. Use:
- `ResultDate` date portion for sold listings as `listedAt` fallback
- ISO today string (`new Date().toISOString().split('T')[0]`) for active listings with no date

---

## Revised Architecture

The original assumption that RMA only has sold listings is **incorrect** — the `statuses` filter supports active listings too. Revised split:

```
getListings(): Promise<Listing[]>
  ├── getRmaListings()  → ALL statuses from RMA (active + sold)
  │     Falls back to [] on error or missing credentials
  │
  └── getSanityListings() → only fetched when RMA returns []
        (full fallback — don't mix sources to avoid duplicates)

Final sort: for-sale first, then sold desc by soldAt
```

**Why not merge both sources:** If RMA is available it is the authoritative source. Merging creates deduplication complexity with no benefit — Sanity should only be used when RMA is unavailable.

---

## Implementation Phases

### Phase 0 — Confirm status string values (XS)
1. Make one authenticated API call to `GET /agent/layne-hughes-at845/sales/listings?take=5`
2. Log the `Status` values that come back — update the status mapping table above
3. Confirm `CampaignCode` is non-null and unique

### Phase 1 — `lib/listings.ts` (M)
1. Write `getRmaListings(): Promise<Listing[]>`
   - Reuse `getRmaToken()` — same scope `read:agent-data`, no change
   - Fetch all listings: no `statuses` filter (get everything), paginate if `Total > take`
   - Map `ListingModel` → `Listing` using confirmed field names
   - Use `parsePrice()` helper for the string price field
   - Sort images by `Order`, cap at 6, extract `Url`
   - Generate slug: `${StreetAddress}-${Suburb}`.toLowerCase().replace(/[^a-z0-9]+/g, '-')
   - Return `[]` on any error or when `RATEMYAGENT_CLIENT_ID` absent
   - `next: { revalidate: 21600 }` (6hr)

2. Write `getSanityListings(): Promise<Listing[]>`
   - GROQ: `*[_type == "listing"] | order(status asc, listedAt desc)`
   - Tag: `next: { tags: ['listings'] }`
   - Used only as full fallback

3. Write `getListings(): Promise<Listing[]>`
   - Try `getRmaListings()` first
   - If result is `[]`, fall back to `getSanityListings()`
   - Sort: for-sale/for-rent first, then sold/leased by `soldAt` desc

### Phase 2 — Wire pages (S)
4. `app/listings/page.tsx` — replace `MOCK_LISTINGS` with `await getListings()`
5. `app/listings/[slug]/page.tsx` — replace `MOCK_LISTINGS`, update `generateStaticParams`

### Phase 3 — Verify (S)
6. `npm run build` — TypeScript clean, static params generate
7. Fallback test: remove credentials → confirm Sanity data renders, no errors

---

## Risk Assessment

| Risk | Likelihood | Mitigation |
|---|---|---|
| `Status` string values differ from estimates | Medium | Log on first API call (Phase 0), update mapping before shipping |
| `CampaignCode` null for some listings | Low | Fall back to slug as ID; log warning |
| RMA pagination needed (>100 listings) | Low | Layne has ~76 reviews suggesting ~50–100 sales; implement pagination loop in `getRmaListings` just in case |
| RMA image URLs CORS-blocked | Low | Images are fetched server-side in RSC — CORS not a concern; `next/image` proxy handles browser delivery |
| `Price` string unparseable | Low | `price: null` → renders as "Price on application" — already handled in UI |

---

## Env Vars

No new vars beyond what reviews integration already uses:
```bash
RATEMYAGENT_CLIENT_ID=
RATEMYAGENT_CLIENT_SECRET=
RATEMYAGENT_TOKEN_URL=        # confirm on credential delivery
LAYNE_AGENT_CODE=layne-hughes-at845
```
