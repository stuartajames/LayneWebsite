# RateMyAgent Reviews Integration — Plan

Last Updated: 2026-04-29

---

## Executive Summary

RateMyAgent has a public REST API (`https://developers.ratemyagent.co.nz`) with OAuth2 authentication. This replaces the Sanity testimonials fallback that was adopted when the widget JSON endpoint returned 403. The integration fetches Layne's live reviews and aggregate star rating server-side via Next.js RSC with 6hr ISR. Sanity testimonials become a genuine fallback only if API credentials are unavailable.

---

## API Reference

**Base:** `https://developers.ratemyagent.co.nz` (inferred — confirm from Swagger UI)
**Spec:** `https://developers.ratemyagent.co.nz/swagger/OpenAPISpecification/swagger.json`
**Auth:** OAuth2 client credentials, scope `read:agent-data`
**Terms:** `https://go.ratemyagent.com.au/api-licence-terms`

### Endpoints Used

#### `GET /agent/{agentCode}/profile`
Returns `AgentDetailModel` including:
- `OverallStars` (double) — aggregate rating displayed in `ReviewSummaryBar`
- `ReviewCount` (integer) — total review count
- `Name`, `AgencyName`, `RmaAgentProfileUrl`

#### `GET /agent/{agentCode}/sales/reviews`
Returns paginated `SalesReviewModelResults`:
- `Results[]` — array of `SalesReviewModel`
- `Total` (int64) — total count for pagination
- `Take`, `Skip` — pagination controls

**Query params:** `skip`, `take`, `from` (date-time), `to` (date-time)

#### `SalesReviewModel` fields we use
| API field | Our field | Notes |
|---|---|---|
| `ReferenceId` | `id` | string |
| `ReviewerName` | `author` | string |
| `StarRating` | `rating` | double → round to 1dp |
| `Description` | `body` | string |
| `ReviewedOn` | `date` | ISO date-time → date string |
| `IsRecommended` | `isRecommended` | boolean |
| `ReviewUrl` | `reviewUrl` | link back to RMA profile |

### Agent Code
Layne's profile URL: `https://www.ratemyagent.co.nz/real-estate-agent/layne-hughes-at845/`
**Agent code:** `layne-hughes-at845` — confirmed.

---

## Current State

| File | Current state | Action needed |
|---|---|---|
| `types/index.ts` | `Review.source: 'sanity-testimonial'` | Refactor to `'ratemyagent' \| 'sanity-testimonial'` |
| `lib/reviews.ts` | Does not exist | Create |
| `sanity/schemas/testimonial.ts` | Primary reviews source | Demote to fallback only |
| `sanity.config.ts` | Testimonials in nav as main item | Relabel to "Testimonials (fallback)" |
| `.env.local` | No RMA credentials | Add OAuth2 vars |
| Components | None built yet | Build in Phase 1 of main build plan |

---

## OAuth2 Token Strategy

RateMyAgent uses client credentials flow (machine-to-machine — no user login needed).

```
POST {token_endpoint}
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
&client_id={RATEMYAGENT_CLIENT_ID}
&client_secret={RATEMYAGENT_CLIENT_SECRET}
&scope=read:agent-data
```

Token endpoint URL must be confirmed from the Swagger UI auth section or from RateMyAgent on API key delivery.

**Token lifetime:** Typically 1hr for client credentials tokens. Strategy:
- Cache token in a module-level variable with expiry timestamp
- On each fetch call, check if token is expired; refresh if needed
- This works correctly with Next.js ISR (6hr TTL) — token will be refreshed automatically within the ISR window

```typescript
// lib/rmaToken.ts
let cachedToken: { value: string; expiresAt: number } | null = null

export async function getRmaToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.value
  }
  const res = await fetch(process.env.RATEMYAGENT_TOKEN_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.RATEMYAGENT_CLIENT_ID!,
      client_secret: process.env.RATEMYAGENT_CLIENT_SECRET!,
      scope: 'read:agent-data',
    }),
    cache: 'no-store',
  })
  const data = await res.json()
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  }
  return cachedToken.value
}
```

---

## Refactoring Required

### 1. `types/index.ts` — Update `Review` interface

```typescript
export interface Review {
  id: string
  source: 'ratemyagent' | 'sanity-testimonial'
  author: string
  rating: number
  body: string
  date: string
  isRecommended?: boolean  // RateMyAgent field
  reviewUrl?: string       // link back to RMA listing
}

export interface ReviewAggregate {
  overallStars: number
  reviewCount: number
  profileUrl: string
}
```

### 2. `lib/reviews.ts` — New file (replaces nothing, was empty)

Two exported functions:
- `getReviewAggregate(): Promise<ReviewAggregate | null>` — calls `/agent/{code}/profile`
- `getReviews(skip?, take?): Promise<{ reviews: Review[]; total: number } | null>` — calls `/agent/{code}/sales/reviews`

Both return `null` on error rather than throwing — allows graceful fallback to Sanity testimonials.

### 3. `lib/rmaToken.ts` — New file

Module-level token cache with automatic refresh. Used only by `lib/reviews.ts`.

### 4. `sanity/schemas/testimonial.ts` — Label update only

Change Studio label from "Testimonial" to "Testimonial (reviews fallback)" and add a description explaining it's shown when RateMyAgent API is unavailable. No schema changes.

### 5. `sanity.config.ts` — Navigation label update

Update Sanity Studio structure to show "Testimonials (fallback)" with a note.

### 6. `.env.local` — New variables

```bash
RATEMYAGENT_CLIENT_ID=
RATEMYAGENT_CLIENT_SECRET=
RATEMYAGENT_TOKEN_URL=       # OAuth2 token endpoint — confirm from RMA on key delivery
LAYNE_AGENT_CODE=at845       # verify against API response
```

---

## Data Flow

```
Next.js RSC (reviews page, home page)
  └── lib/reviews.ts (revalidate: 21600 — 6hr ISR)
        ├── lib/rmaToken.ts → OAuth2 token (module-level cache, auto-refresh)
        │
        ├── GET /agent/{agentCode}/profile → ReviewAggregate
        │     → ReviewSummaryBar (overallStars, reviewCount, profileUrl)
        │
        └── GET /agent/{agentCode}/sales/reviews → Review[]
              → ReviewFeed (paginated list)
              → ReviewCard (author, date, stars, body, isRecommended badge)

Fallback (if lib/reviews.ts returns null):
  └── Sanity GROQ → testimonial documents → same components
```

---

## Components to Build

These are Phase 1 components from the main build plan — now with confirmed data shapes:

### `ReviewSummaryBar`
Props: `aggregate: ReviewAggregate | null`
- Shows star graphic, `overallStars` to 1dp, `reviewCount`, link to `profileUrl`
- If `aggregate` is null: hide section (no empty star graphic)

### `ReviewCard`
Props: `review: Review`
- Author name, formatted date, `StarRating` component, body text
- If `isRecommended`: show "Recommended" badge
- If `reviewUrl`: link "View on RateMyAgent"

### `ReviewFeed`
Props: `reviews: Review[]`, `total: number`
- Shows first 6, "Load more" fetches next page via `/api/reviews` route
- Falls back to Sanity testimonials when `reviews` is empty

> **Note:** "Load more" requires a client-side API route (`/api/reviews`) that calls `lib/reviews.ts` with `skip` offset, since RSC can't be re-fetched client-side. This is a small addition to the plan.

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| API access not granted before launch | Medium | Medium | Sanity testimonials shown as fallback — zero user-facing gap |
| Agent code | — | — | Confirmed: `layne-hughes-at845` |
| OAuth2 token endpoint URL not documented in spec | Low | Medium | Confirm URL on API key delivery from RateMyAgent |
| Token expires mid-ISR window | Low | Low | Module-level cache with 60s buffer refreshes proactively |
| RateMyAgent API rate limits | Low | Low | Single agent, 6hr ISR — well within any reasonable limit |
| "Load more" route leaks credentials | Low | High | `/api/reviews` never exposes token to client; server-only |

---

## Required Resources

| Resource | From | Status |
|---|---|---|
| RateMyAgent API credentials | Apply at developers.ratemyagent.co.nz | To apply — may take days |
| OAuth2 token endpoint URL | Confirmed on credential delivery | Unknown until credentials arrive |
| Layne's exact `agentCode` | First successful API call | Unknown until credentials arrive |

---

## Implementation Phases

### Phase A — Apply + prepare (can start immediately)
Apply for API access. Write all code against the spec while waiting. Use mock data.

### Phase B — Refactor + lib (once credentials arrive)
Refactor `types/index.ts`. Write `lib/rmaToken.ts` and `lib/reviews.ts`. Wire up env vars. Verify agent code.

### Phase C — Components + `/api/reviews` route
Build `ReviewSummaryBar`, `ReviewCard`, `ReviewFeed`. Add `/api/reviews` route for client-side "Load more". Wire into `/reviews` page and home page.

### Phase D — Integration test + fallback verification
Test with live credentials. Verify ISR. Verify fallback to Sanity testimonials when credentials removed from env. Verify "Load more" pagination.

---

## Timeline

| Phase | Duration | Blocked on |
|---|---|---|
| Phase A — Apply + prepare | 1 day code, days waiting | RateMyAgent approval |
| Phase B — Refactor + lib | 0.5 day | API credentials |
| Phase C — Components | 1 day | Phase B |
| Phase D — Test | 0.5 day | Phase C |
| **Total build time** | **~2 days** (excluding wait) | |
