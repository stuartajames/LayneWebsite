# Real Estate Agent Website — Task Checklist

Last Updated: 2026-04-29 (rev 2 — open questions answered, NZ/Harcourts/Sanity-only approach confirmed)
Status: **Planning complete. Phase 0 pre-work answered. Two new pre-work items remain (P0-A, P0-B, P0-C). Ready to begin migration.**

---

## Phase 0 — Foundation

### Pre-work — COMPLETE ✅
- ✅ **P0-1** Agency: **Vault RE** — no integration needed. Listings via Sanity CMS.
- ✅ **P0-2** Google Business Profile: **none** — Google Places API removed from v1.
- ✅ **P0-3** RateMyAgent NZ: `https://www.ratemyagent.co.nz/real-estate-agent/layne-hughes-at845/` — agent ID: `layne-hughes-at845`
- ✅ **P0-4** Market: **Wellington NZ, northern suburbs** (Johnsonville, Churton Park, Tawa, Newlands, Paparangi, Woodridge, Grenada North — confirm full list)
- ✅ **P0-5** Domain API: **not applicable** — AU only. NZ market data via REINZ reports → Sanity.
- ✅ **P0-6** RateMyAgent API: **not needed** — using widget JSON endpoint (no key required).

### New pre-work — all resolved ✅
- ✅ **P0-A** Harcourts gold: approx `#C9A84C` — confirm exact hex from `harcourts.co.nz` stylesheet before Tailwind config
- ✅ **P0-B** Wellington northern suburbs confirmed: Broadmeadows, Churton Park, Glenside, Grenada North, Grenada Village, Johnsonville, Khandallah, Newlands, Ngaio, Raroa, Tawa, Wadestown (12 suburbs → 12 `SuburbStat` Sanity documents)
- ✅ **P0-C** Domain confirmed: `laynesaywellhughes.co.nz` — register + connect to Vercel in Phase 5
- [ ] **P0-D** Set up Google Sheets lead log + Google Cloud service account `S` ← only remaining setup task

### Migration
- [ ] **P0-7** Migrate project from Vite to Next.js 15 (App Router) `M`
  - Remove vite.config.ts, update package.json
  - Set up app/ directory with root layout.tsx
  - Configure next.config.ts with image domains
  - Update tsconfig for Next.js
- [ ] **P0-8** Install and configure Tailwind CSS v4 `S`
- [ ] **P0-9** Set up Sanity.io project + schema for Agent, Listing (fallback), SuburbStat `M`
- [ ] **P0-10** Configure all environment variables in `.env.local` and Vercel `S`
- [ ] **P0-11** Deploy blank Next.js app to Vercel, connect custom domain `S`

### Design System
- [ ] **P0-12** Define Tailwind theme: brand colours, typography scale, spacing `S`
- [ ] **P0-13** Create shared component primitives: Button, Card, Badge, StarRating `M`

**Acceptance criteria:** `npm run build` passes, app deploys to Vercel, Tailwind theme applied.

---

## Phase 1 — Static Shell (mock data)

- [ ] **P1-1** Build `Header` with nav links + mobile hamburger menu `M`
- [ ] **P1-2** Build `Footer` `S`
- [ ] **P1-3** Build `HeroSection` with agent photo + localised headline + CTA `M`
- [ ] **P1-4** Build `ReviewSummaryBar` (aggregate score display) `S`
- [ ] **P1-5** Build `ListingCard` + `ListingGrid` with filter tabs (For Sale / Sold / Leased) `L`
- [ ] **P1-6** Build `ListingDetail` page with image gallery `M`
- [ ] **P1-7** Build `ReviewCard` + `ReviewFeed` (paginated) `M`
- [ ] **P1-8** Build `MarketInsightsStrip` `S`
- [ ] **P1-9** Build `/contact` page with `ContactForm` (react-hook-form + zod) `M`
- [ ] **P1-10** Build `/about` page with bio, credential badges, area map `M`
- [ ] **P1-11** Build `/market-insights` page `M`
- [ ] **P1-12** Ensure all pages are responsive (mobile-first, test at 375px and 1440px) `M`
- [ ] **P1-13** Add sticky mobile CTA bar ("Call Layne" + "Book Appraisal") `S`
- [ ] **P1-14** Design review with Layne — get sign-off before Phase 2 `S`

**Acceptance criteria:** All pages render with mock data, fully responsive, Layne sign-off obtained.

---

## Phase 2 — Data Integrations

### TypeScript interfaces
- [ ] **P2-1** Define interfaces in `types/index.ts` `S`
  - `Listing`: `address.city` (not `state`) for NZ
  - `Review`: `source: 'ratemyagent'` only (Google removed from v1)
  - `SuburbStat`: Wellington suburbs

### Sanity schemas + content
- [ ] **P2-2** Create Sanity schema: `listing` document `M`
- [ ] **P2-3** Create Sanity schema: `suburbStat` document `S`
- [ ] **P2-4** Create Sanity schema: `agentProfile` document `S`
- [ ] **P2-5** Enter initial listings into Sanity Studio `M` ← developer content task
- [ ] **P2-6** Enter Wellington suburb stats from latest REINZ monthly report `S` ← developer content task
  - 12 suburbs: Broadmeadows, Churton Park, Glenside, Grenada North, Grenada Village, Johnsonville, Khandallah, Newlands, Ngaio, Raroa, Tawa, Wadestown

### Data fetching layer
- [ ] **P2-7** Implement `lib/listings.ts` — GROQ fetch from Sanity, ISR 3600s `M`
- [ ] **P2-8** Implement `lib/market.ts` — GROQ fetch from Sanity, ISR 86400s `S`
- [ ] **P2-9** Implement `lib/reviews/ratemyagent.ts` — widget JSON endpoint, ISR 21600s `M`
  - Endpoint: `https://www.ratemyagent.co.nz/real-estate-agent/layne-hughes-at845/reviews.json`
  - No API key. Fallback: GROQ fetch of `testimonial` documents from Sanity.
- [ ] **P2-10** Implement `/api/revalidate` route handler (on-demand ISR via webhook secret) `S`

### Wire up to components
- [ ] **P2-11** Wire `ListingGrid` + `ListingDetail` to `lib/listings.ts` `M`
- [ ] **P2-12** Wire `MarketInsightsStrip` to `lib/market.ts` `S`
- [ ] **P2-13** Wire `ReviewFeed` + `ReviewSummaryBar` to `lib/reviews/ratemyagent.ts` `S`

### Fallback & error states
- [ ] **P2-14** Implement graceful empty/error UI for all data components (no blank whitespace) `M`
- [ ] **P2-15** Add "Last updated: X ago" timestamp to ListingGrid and MarketInsightsStrip `S`

**Acceptance criteria:** All sections show real Sanity data and live RateMyAgent reviews. ISR confirmed working. No blank sections on data failure.

---

## Phase 3 — Lead Capture & CRM

- [ ] **P3-1** Implement `/api/contact` route handler — validate with Zod, append row to Google Sheet via Sheets API v4 `M`
- [ ] **P3-2** Set up Google Cloud service account + share Sheet with service account email `S`
- [ ] **P3-3** Send lead notification email to Layne via Resend (free tier) `S`
- [ ] **P3-4** Send confirmation email to the lead via Resend `S`
- [ ] **P3-5** Add privacy policy page (`/privacy`) `S`
- [ ] **P3-6** Add GDPR-style consent checkbox to contact form `S`
- [ ] **P3-7** Test contact form end-to-end — submission appears in CRM `S`

**Acceptance criteria:** Form submission creates CRM record, both Layne and the lead receive emails, consent checkbox is present.

---

## Phase 4 — SEO & Performance

- [ ] **P4-1** Add `metadata` export to every page (title, description, OG tags) `M`
- [ ] **P4-2** Add JSON-LD structured data to `ListingDetail` pages (RealEstateListing schema) `M`
- [ ] **P4-3** Add JSON-LD for LocalBusiness / RealEstateAgent on home page `S`
- [ ] **P4-4** Generate `sitemap.xml` via `app/sitemap.ts` `S`
- [ ] **P4-5** Add `robots.txt` `S`
- [ ] **P4-6** Run Lighthouse audit — target ≥ 90 Performance, ≥ 95 SEO `M`
- [ ] **P4-7** Fix any Core Web Vitals issues (LCP, CLS, INP) `M`
- [ ] **P4-8** Verify all listing images use `next/image` with proper `alt` text `S`
- [ ] **P4-9** WCAG AA audit — keyboard navigation, colour contrast `M`

**Acceptance criteria:** Lighthouse scores ≥ 90 performance, ≥ 95 SEO. Zero CLS issues on listing grid.

---

## Phase 5 — Launch & Monitoring

- [ ] **P5-1** Final content pass — Layne to review all copy, photos, credentials `S`
- [ ] **P5-2** Enable Vercel Analytics (free tier — 2,500 events/month) `S`
- [ ] **P5-3** Set up UptimeRobot free monitors (site + `/api/contact` + data health endpoint) `S`
- [ ] **P5-4** Configure confirmed domain as custom domain in Vercel + verify SSL `S` ← domain to be provided; use `laynesaywellhughes.co.nz` as placeholder in code
- [ ] **P5-5** Submit sitemap to Google Search Console `S`
- [ ] **P5-6** Document all API keys and renewal dates for Layne / agency `S`
- [ ] **P5-7** Hand off Sanity Studio access to Layne with brief guide `S`

**Acceptance criteria:** Site live at custom domain, all monitoring active, Layne can log in to CMS.

---

## Backlog (Post-launch)

- [ ] Calendar embed (Cal.com free tier) on contact page `S`
- [ ] Property map view (react-leaflet + OpenStreetMap) on listing grid `M`
- [ ] Email newsletter / market report signup `M`
- [ ] Blog / market commentary (Sanity) `L`
- [ ] Testimonial video embed `S`
- [ ] "Recently sold" automated suburb report PDF generation `XL`
