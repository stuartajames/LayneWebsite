# RMA Listings — Context

Last Updated: 2026-04-29 (rev 2 — Swagger confirmed)

---

## Key Files

| File | Role |
|---|---|
| `app/listings/page.tsx` | Listings index — replace `MOCK_LISTINGS` with `getListings()` |
| `app/listings/[slug]/page.tsx` | Listing detail + `generateStaticParams` — same replacement |
| `lib/listings.ts` | **New file** — `getRmaListings()`, `getSanityListings()`, `getListings()` |
| `lib/reviews.ts` | Reference: identical OAuth2 pattern to follow |
| `lib/rmaToken.ts` | Shared token cache — import `getRmaToken()`, do not reimplement |
| `lib/mockData.ts` | Remove from page imports once live data wired |
| `types/index.ts` | `Listing` interface — no changes needed |
| `dev/RateMyAgentSwagger.json` | Full API spec — `ListingModel` at line 3640, endpoint at line 698 |

---

## Confirmed Swagger Facts

- **Endpoint:** `GET /agent/{agentCode}/sales/listings`
- **Scope:** `read:agent-data` — same as reviews, no extra permissions
- **Response shape:** `ListingModelResults` → `{ Results: ListingModel[], Total, Take, Skip }`
- **Pagination params:** `skip` (int32), `take` (int32), `statuses` (string[])
- **Auth:** Bearer token header — same `getRmaToken()` flow

### `ListingModel` confirmed fields
```
CampaignCode   → id
StreetAddress  → address.street
Suburb         → address.suburb
State          → address.city
Postcode       → address.postcode
Status         → status  (free string — exact values TBC on first API call)
Price          → priceDisplay (STRING, not number — parse numeric value out)
Bedrooms       → bedrooms
Bathrooms      → bathrooms
Carparks       → carSpaces
Images[]       → images[] (sort by .Order, take first 6, use .Url)
Description    → description
ResultDate     → soldAt (date-time → date string)
AuctionDate    → inspections (single entry if present)
```

### Fields NOT in `ListingModel`
- No `listedAt` — use `ResultDate` for sold, today for active
- No `ListingId` — use `CampaignCode` as id (confirm non-null)
- No `inspections` array — derive from `AuctionDate` only

---

## Architecture Decision

**RMA is primary source for ALL listing statuses** (active + sold). Sanity is a full fallback only — not merged with RMA data. This avoids deduplication complexity.

```
getListings()
  → getRmaListings()  : if [] → getSanityListings()
```

---

## Price Handling

`Price` is a formatted string (e.g. `"Sold $985,000"`), not a number. Use a regex to extract numeric value:

```typescript
const match = raw.match(/[\d,]+/)
const price = match ? parseInt(match[0].replace(/,/g, ''), 10) : null
```

---

## Status Values (unconfirmed — update after Phase 0)

The `Status` field in `ListingModel` is a free string with no enum in the spec. Estimated mapping:

| RMA value | Our type |
|---|---|
| `"Current"` or `"Active"` | `'for-sale'` |
| `"Sold"` | `'sold'` |
| `"Leased"` | `'leased'` |
| `"ForRent"` | `'for-rent'` |

**Confirm by logging the first API response in Phase 0 before finalising the mapping.**
