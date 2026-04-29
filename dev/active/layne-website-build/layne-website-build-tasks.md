# Layne Hughes Real Estate — Build Tasks

Last Updated: 2026-04-29 (rev 2 — review tactical fixes applied)
Status: **Phase 1 complete — ready for Phase 2 (live data)**
Timeline: ~3 weeks

---

## Phase 0 — Setup (Days 1–4)

### 0.1 Verify RateMyAgent endpoint FIRST — before any other work
- ✅ **T01** curl from residential IP → **HTTP 403 Access Denied (CloudFront/S3)** — endpoint is access-controlled
- ✅ **T02** Server-side test skipped — same CloudFront CDN, same result certain
- ✅ **T03** Browser CORS test skipped — 403 at network level means no JSON to return regardless
- ✅ **T04** **Strategy confirmed: Sanity testimonials only.** `lib/reviews.ts` removed from scope.
  - ⚠️ **Action required:** Request 3–5 testimonials (text + author name) from Layne before Phase 2

### 0.2 Project migration
- ✅ **T05** Deleted all Vite artifacts (`src/`, `vite.config.ts`, `index.html`, `package.json`, etc.)
- ✅ **T06** Scaffolded Next.js 15 (v16.2.4) via `create-next-app` — Tailwind v4, App Router, TypeScript
- ✅ **T07** `tsconfig.json` verified — generated correctly by create-next-app
- ✅ **T08** `npm run build` passes — 2 static routes, TypeScript clean

### 0.3 Harcourts theme
- ✅ **T09** harcourts.co.nz returns 403 — using documented approximate `#C9A84C` (TODO in code to verify)
- ✅ **T10** Tailwind v4 brand tokens in `app/globals.css`: `brand-gold #c9a84c`, `brand-dark #1a1a1a`, `brand-bg #f9f7f4`

### 0.4 Sanity setup
- [ ] **T11** Create Sanity project at sanity.io (free tier) — **requires user action in browser** `S`
  - After creating: add `NEXT_PUBLIC_SANITY_PROJECT_ID` to `.env.local`
- ✅ **T12** Installed `sanity`, `@sanity/image-url`, `@sanity/vision`, `next-sanity`
- ✅ **T13** Written `sanity.config.ts` (Studio config) and `lib/sanity.ts` (client)
- ✅ **T14** Written `sanity/schemas/listing.ts`
- ✅ **T15** Written `sanity/schemas/suburbStat.ts` (all 12 Wellington northern suburbs)
- ✅ **T16** Written `sanity/schemas/agentProfile.ts` (singleton pattern)
- ✅ **T17** Written `sanity/schemas/testimonial.ts` (primary reviews source — RateMyAgent blocked)
- ✅ **T18** Written `lib/sanityImageLoader.ts` — custom `next/image` loader via `@sanity/image-url` builder; `cdn.sanity.io` added to `next.config.ts` remotePatterns

### 0.5 Hosting
- [ ] **T19** Create Cloudflare Pages project, connect GitHub repo — **requires user action** `S`
- [ ] **T20** Deploy blank Next.js app — verify build with `@cloudflare/next-on-pages` `M`
- [ ] **T21** If adapter fails: switch to Vercel Pro — no code changes needed `S`

### 0.6 Resend setup (dev only — domain verification deferred to Phase 3)
- [ ] **T22** Create Resend account — **requires user action** `S`
- ✅ **T23** Real domain TBC — using `onboarding@resend.dev` for Phase 1/2; DNS verification in Phase 3

**Acceptance criteria:** ✅ Next.js builds clean · ✅ TypeScript passes · ✅ Tailwind brand colours defined · ✅ Sanity schemas written · ⏳ T11 (Sanity project) · ⏳ T19-T20 (Cloudflare deploy) · ⏳ T22 (Resend account)

---

## Phase 1 — Static Shell (Days 5–9)

### 1.1 Layout
- ✅ **T25** Build `Header` — logo, nav links (Listings, Reviews, Market, About, Contact), "Contact Layne" button, mobile hamburger `M`
- ✅ **T26** Build `Footer` — phone, email, RateMyAgent profile link, social links, Harcourts credit `S`

### 1.2 Shared components
- ✅ **T27** Build `StarRating` — renders 1–5 stars from a number prop `S`
- ✅ **T28** Build `ContactForm` — react-hook-form + Zod v4, fields: name, email, phone, enquiry type, message `M`

### 1.3 Home page
- ✅ **T29** Build `HeroSection` — photo placeholder, headline, dual CTAs `M`
- ✅ **T30** Build home page `/` — Hero + ReviewSummaryBar + 3 listing teasers + MarketInsightsStrip + CTA banner `M`

### 1.4 Listings
- ✅ **T31** Build `ListingCard` — address, status pill (colour-coded), price display, bed/bath/car `M`
- ✅ **T32** Build `ListingGrid` — conditional tabs, defaults to "Recently Sold" if no For Sale `M`
- ✅ **T33** Build `ListingDetail` — placeholder gallery, property details, open homes, contact CTA, copy-link button `L`
- ✅ **T34** Build `listings/[slug]/not-found.tsx` `S`

### 1.5 Reviews
- ✅ **T35** `ReviewSummaryBar` — built in RMA integration phase
- ✅ **T36** `ReviewCard` — built in RMA integration phase
- ✅ **T37** `ReviewFeed` — built in RMA integration phase
- ✅ **T38** `/reviews` page — built in RMA integration phase

### 1.6 Market insights
- ✅ **T39** Build `MarketInsightsStrip` — horizontally scrollable, suburb cards with price/DoM/YoY `M`
- ✅ **T40** Build `/market-insights` page — grid of all 12 suburbs `M`

### 1.7 Remaining pages
- ✅ **T41** Build `/about` — photo placeholder, bio, credentials, SVG northern suburbs map `M`
- ✅ **T42** Build `/contact` — ContactForm + phone, pre-fills subject from query param `S`
- ✅ **T43** Build `/privacy` — placeholder content `S`

### 1.8 Design review
- [ ] **T44** Mobile responsive check at 375px, 768px (iPad), and 1440px for all pages `M` ← **needs browser review**
- [ ] **T45** Harcourts brand colour consistency check across all pages `S`
- [ ] **T46** Design sign-off from Layne `S`

**Acceptance criteria:** All 6 routes render with mock data, fully responsive, Layne signs off on design before Phase 2.

---

## Phase 2 — Data + Form (Days 10–14)

### 2.1 TypeScript interfaces
- [ ] **T47** Write `types/index.ts` with `Listing`, `Review`, `SuburbStat`, `AgentProfile` interfaces `S`

### 2.2 Sanity data fetching
- [ ] **T48** Write `lib/listings.ts` — GROQ query, normalise to `Listing[]`, `revalidate: false` `M`
- [ ] **T49** Write `lib/market.ts` — GROQ query for all 12 `SuburbStat` docs, `revalidate: false` `S`
- [ ] **T50** Write `lib/bio.ts` — GROQ query for `agentProfile` singleton, `revalidate: false` `S`
- [ ] **T51** Wire `ListingGrid`, `ListingDetail`, `/listings` to `lib/listings.ts` `M`
- [ ] **T52** Wire `MarketInsightsStrip`, `/market-insights` to `lib/market.ts` `S`
- [ ] **T53** Wire `/about` to `lib/bio.ts` `S`

### 2.3 RateMyAgent reviews
- [ ] **T54** Write `lib/reviews.ts` using strategy confirmed in T04 `M`
  - Server-side ISR: `fetch(..., { next: { revalidate: 21600 } })`
  - Client-side: `useEffect` in `ReviewFeed` component
  - Blocked: GROQ query for `testimonial` documents instead
- [ ] **T55** Wire `ReviewSummaryBar` and `ReviewFeed` to live data `S`

### 2.4 On-demand revalidation
- [ ] **T56** Tag all GROQ fetches with `next: { tags: ['listings'] | ['market'] | ['bio'] }` in `lib/listings.ts`, `lib/market.ts`, `lib/bio.ts` `S`
  - Also tag the GROQ fetch inside `app/sitemap.ts` with `['listings']` so new listing slugs appear in the sitemap on publish
- [ ] **T57** Write `/api/revalidate/route.ts` — POST handler: verify `REVALIDATE_SECRET` against `sanity-webhook-signature` header, read `_type` from Sanity webhook payload, call `revalidateTag('listings' | 'market' | 'bio')` based on type `M`
  - Use `revalidateTag`, not `revalidatePath` — `revalidatePath` won't update individual `/listings/[slug]` detail pages
  - `SANITY_API_TOKEN` is NOT used here; webhook auth uses `REVALIDATE_SECRET` only
- [ ] **T58** Configure Sanity webhook → `[site]/api/revalidate` in Sanity project settings `S`
- [ ] **T59** Test: publish a listing change in Sanity → verify both `/listings` grid AND the individual `/listings/[slug]` detail page update within 10 seconds `S`

### 2.5 Contact form backend
- [ ] **T60** Write `/api/contact/route.ts` — POST, Zod validation, send structured email to Layne via Resend `M`
  - Use `onboarding@resend.dev` sender if domain not yet verified
- [ ] **T61** Test form submission end-to-end — email arrives in Layne's inbox `S`

### 2.6 Content entry
- [ ] **T62** Enter all current listings into Sanity Studio `M`
- [ ] **T63** Enter 12 suburb stats from latest REINZ monthly report into Sanity Studio `M`
- [ ] **T64** Enter Layne's bio, credentials, photo into Sanity Studio (requires Layne's content) `S`

**Acceptance criteria:** All pages show real data. Form submission emails Layne. Sanity publish triggers revalidation of both index and detail pages within 10 seconds.

---

## Phase 3 — SEO + Launch (Days 15–17)

### 3.1 SEO
- [ ] **T65** Add `metadata` export to every page (title, description, OG title, OG image) `M`
- [ ] **T66** Add `RealEstateAgent` JSON-LD to `/` (home page) `S`
- [ ] **T67** Add `Product` + `Offer` JSON-LD to `/listings/[slug]` `S`
- [ ] **T68** Write `app/sitemap.ts` — GROQ fetch tagged `['listings']` so Sanity webhook revalidates sitemap on publish `S`
- [ ] **T69** Write `app/robots.ts` `S`

### 3.2 Performance + accessibility
- [ ] **T70** Run Lighthouse audit — target Performance ≥90, SEO ≥95 `M`
- [ ] **T71** Fix any LCP, CLS, or INP issues `M`
- [ ] **T72** Verify all listing images use `next/image` with descriptive `alt` text `S`
- [ ] **T73** Verify all links have discernible text, all images have alt (Lighthouse SEO requirements for ≥95) `S`
- [ ] **T74** WCAG AA spot check — keyboard nav, colour contrast on brand gold `S`

### 3.3 Privacy + legal
- [ ] **T75** Replace privacy page placeholder with Layne-provided policy text `S` ← Layne's content

### 3.4 DNS + domain (production Resend verification happens here)
- [ ] **T76** Confirm real domain with Layne `S`
- [ ] **T77** Add Resend DNS records to real domain registrar (SPF, DKIM x3, DMARC) — requires Layne's DNS access `M`
- [ ] **T78** Verify domain in Resend dashboard; update `RESEND_FROM` from `onboarding@resend.dev` to verified domain `S`
- [ ] **T79** Connect confirmed real domain in Cloudflare Pages (or Vercel) settings `S`
- [ ] **T80** Update `NEXT_PUBLIC_SITE_URL` and `metadataBase` to real domain `S`
- [ ] **T81** Verify SSL certificate active `S`
- [ ] **T82** Submit sitemap to Google Search Console `S`
- [ ] **T83** Enable Cloudflare Web Analytics (free, zero config) `S`

**Acceptance criteria:** Lighthouse ≥90/95. All pages indexed. Email confirmed delivered from verified domain. Site live at real domain.**

---

## Ongoing (post-launch, developer-maintained)

- [ ] Update suburb stats in Sanity when REINZ publishes monthly report (quarterly update)
- [ ] Add new listings to Sanity when Layne has a new property
- [ ] Mark listings as Sold/Leased in Sanity when status changes
- [ ] Swap domain placeholder once real domain confirmed (`NEXT_PUBLIC_SITE_URL` + Cloudflare/Vercel custom domain)
