# RateMyAgent Reviews Integration — Context

Last Updated: 2026-04-29

---

## API Details

- **Spec:** `https://developers.ratemyagent.co.nz/swagger/OpenAPISpecification/swagger.json`
- **UI:** `https://developers.ratemyagent.co.nz/index.html`
- **Terms:** `https://go.ratemyagent.com.au/api-licence-terms`
- **Auth:** OAuth2 client credentials, scope `read:agent-data`
- **Layne's profile:** `https://www.ratemyagent.co.nz/real-estate-agent/layne-hughes-at845/`
- **Agent code:** `layne-hughes-at845` — confirmed

## Endpoints

```
GET /agent/{agentCode}/profile
  → AgentDetailModel { OverallStars, ReviewCount, RmaAgentProfileUrl, Name, AgencyName }

GET /agent/{agentCode}/sales/reviews
  → SalesReviewModelResults {
      Results: SalesReviewModel[],
      Total: int64,
      Take: int32,
      Skip: int32
    }

SalesReviewModel {
  ReferenceId    → Review.id
  ReviewerName   → Review.author
  StarRating     → Review.rating  (double)
  Description    → Review.body
  ReviewedOn     → Review.date    (ISO date-time)
  IsRecommended  → Review.isRecommended
  ReviewUrl      → Review.reviewUrl
}
```

## Files to Create

| File | Purpose |
|---|---|
| `lib/rmaToken.ts` | OAuth2 client credentials token cache |
| `lib/reviews.ts` | Fetch aggregate + reviews from RMA API |
| `app/api/reviews/route.ts` | Client-side "Load more" endpoint |
| `components/reviews/ReviewSummaryBar.tsx` | Aggregate stars + count |
| `components/reviews/ReviewCard.tsx` | Single review |
| `components/reviews/ReviewFeed.tsx` | Paginated list with Load more |

## Files to Refactor

| File | Change |
|---|---|
| `types/index.ts` | `Review.source` → `'ratemyagent' \| 'sanity-testimonial'`; add `ReviewAggregate` interface; add `isRecommended?`, `reviewUrl?` to `Review` |
| `sanity/schemas/testimonial.ts` | Label update only: "Testimonial (reviews fallback)" |
| `sanity.config.ts` | Studio nav label: "Testimonials (fallback)" |
| `.env.local` | Add `RATEMYAGENT_CLIENT_ID`, `RATEMYAGENT_CLIENT_SECRET`, `RATEMYAGENT_TOKEN_URL`, `LAYNE_AGENT_CODE` |

## Environment Variables (add to .env.local and Cloudflare/Vercel)

```bash
RATEMYAGENT_CLIENT_ID=          # from RMA API key delivery
RATEMYAGENT_CLIENT_SECRET=      # from RMA API key delivery
RATEMYAGENT_TOKEN_URL=          # OAuth2 token endpoint — confirm from RMA
LAYNE_AGENT_CODE=at845          # verify on first API call — may be full slug
```

## Token Caching Pattern

Module-level cache in `lib/rmaToken.ts`. Checks expiry with 60s buffer before each use. Works correctly across Next.js ISR — module state persists within the same worker process.

```typescript
let cachedToken: { value: string; expiresAt: number } | null = null
```

## Fallback Chain

```
1. lib/reviews.ts → RateMyAgent API (primary)
2. Sanity GROQ → testimonial documents (if API unavailable / null returned)
3. Empty state UI (if both fail)
```

The `ReviewFeed` component must accept both `Review[]` (from either source) and gracefully handle an empty array.

## ISR Strategy

- `/reviews` page: `revalidate: 21600` (6hr) — RateMyAgent data, no webhook possible
- Home page (review summary bar): same 6hr TTL
- `/api/reviews` route handler: `cache: 'no-store'` — always fresh for "Load more"

## Pagination

`GET /agent/{agentCode}/sales/reviews?skip=0&take=6`

- Initial page load: `skip=0, take=6` in RSC (server-rendered)
- "Load more" button: calls `/api/reviews?skip=6&take=6` client-side
- `total` from API response used to show/hide "Load more" button

## Open Items

- [ ] Apply for RateMyAgent API access at developers.ratemyagent.co.nz
- [ ] Confirm exact OAuth2 token endpoint URL on credential delivery
- ✅ `agentCode` confirmed: `layne-hughes-at845`
- [ ] Confirm RateMyAgent API base URL (not in spec — may be `https://api.ratemyagent.co.nz` or `https://developers.ratemyagent.co.nz`)
