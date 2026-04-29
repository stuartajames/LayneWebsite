# RateMyAgent Reviews Integration — Tasks

Last Updated: 2026-04-29
Status: **Phases A–C complete — awaiting API credentials + Cloudflare/Vercel deploy for Phase D**

---

## Phase A — Apply + Prepare (start now, ~1 day code)

### A.1 Apply for API access
- [ ] **RA01** Read API terms at `https://go.ratemyagent.com.au/api-licence-terms` `S`
- [ ] **RA02** Apply for API access at `https://developers.ratemyagent.co.nz` `S` ← **user action**
- [ ] **RA03** On credential delivery: record `CLIENT_ID`, `CLIENT_SECRET`, token endpoint URL, and base API URL in context.md `S`
- ✅ **RA04** Agent code confirmed: `layne-hughes-at845` — no API call needed to verify

### A.2 Refactoring (do now — no credentials needed)
- ✅ **RA05** Update `types/index.ts`: `Review.source` → `'ratemyagent' | 'sanity-testimonial'`; add `isRecommended?`, `reviewUrl?` to `Review`; add new `ReviewAggregate` interface `S`
- ✅ **RA06** Update `sanity/schemas/testimonial.ts`: change title to `'Testimonial (reviews fallback)'`, add description explaining fallback role `S`
- ✅ **RA07** Update `sanity.config.ts`: change Studio nav label for testimonials to `'Testimonials (fallback)'` `S`
- ✅ **RA08** Add placeholder env vars to `.env.local` (empty values) `S`

**Acceptance criteria:** Types compile, build passes, Sanity Studio label updated.

---

## Phase B — Token + Data Layer (after credentials arrive)

- ✅ **RB01** Write `lib/rmaToken.ts` — module-level OAuth2 token cache with auto-refresh `S`
- ✅ **RB02** Write `lib/reviews.ts` `M`
- [ ] **RB03** Populate env vars in `.env.local` with real credentials `S` ← **awaiting API approval**
- [ ] **RB04** Smoke test: run `getReviewAggregate()` and `getReviews()` from a test script or `npm run dev` page `S`
- ✅ **RB05** Agent code confirmed: `layne-hughes-at845`

**Acceptance criteria:** `getReviewAggregate()` returns `{ overallStars, reviewCount, profileUrl }`. `getReviews()` returns array of normalised `Review` objects.

---

## Phase C — Components + API Route

### C.1 Shared component
- ✅ **RC01** Build `components/shared/StarRating.tsx` — renders stars from a `rating: number` prop `S`

### C.2 Review components
- ✅ **RC02** Build `components/reviews/ReviewSummaryBar.tsx` `S`
- ✅ **RC03** Build `components/reviews/ReviewCard.tsx` `S`
- ✅ **RC04** Build `components/reviews/ReviewFeed.tsx` `M`
  - Sanity testimonial fallback handled in page RSC (server-side), not in ReviewFeed

### C.3 Load more API route
- ✅ **RC05** Write `app/api/reviews/route.ts` `S`

### C.4 Wire into pages
- ✅ **RC06** Wire `ReviewSummaryBar` into home page (`app/page.tsx`)
- ✅ **RC07** Build `/reviews` page (`app/reviews/page.tsx`) `M`
- [ ] **RC08** Add `/reviews` link to `Header` nav `S` ← deferred to Phase 1 Header build (T25)

**Acceptance criteria:** `/reviews` shows live RateMyAgent aggregate + paginated reviews. "Load more" works. Empty state shows Sanity testimonials.

---

## Phase D — Integration Test + Fallback Verification

- [ ] **RD01** Test: remove `RATEMYAGENT_CLIENT_ID` from env → verify Sanity testimonials appear, no error thrown `S`
- [ ] **RD02** Test: "Load more" — verify `skip` increments correctly, duplicate reviews don't appear `S`
- [ ] **RD03** Test: ISR — confirm reviews cache revalidates after 6hr (or force via `fetch` with short TTL in dev) `S`
- [ ] **RD04** Add env vars to Cloudflare Pages / Vercel dashboard `S`
- [ ] **RD05** Verify production build fetches live RateMyAgent data `S`

**Acceptance criteria:** Live reviews show in production. Fallback is silent and graceful. No credentials exposed in client bundle.

---

## Ongoing

- Reviews update automatically via 6hr ISR — no manual action needed
- If RateMyAgent revokes API access: Sanity testimonials auto-display as fallback
