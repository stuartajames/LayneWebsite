# Real Estate Agent Website — Comprehensive Plan

Last Updated: 2026-04-29 (rev 2 — all services updated to free tier)

---

## Executive Summary

Build a personal brand website for Wellington NZ real estate agent Layne Hughes (Harcourts agency) that surfaces her listings, RateMyAgent reviews, and Wellington northern suburb market stats — all managed via Sanity CMS — into a fast, SEO-optimised, Harcourts-aligned site that converts visitors into leads.

---

## Agent Team Input

### 🎨 Agent 1 — UI/UX Specialist (Jordan)

**Core Principle:** Real estate is trust-first. Every design decision must reduce friction on the path to contacting Layne.

#### User Journeys
1. **Vendor** — Comes via Google search for "real estate agent [suburb]". Wants proof of results, reviews, local expertise. CTA: "Get a free appraisal."
2. **Buyer** — Comes from listing portal overflow. Wants to browse Layne's current stock and feel confident in her. CTA: "View listings / Book inspection."
3. **Referral** — Sent by past client. Wants social proof fast. CTA: "Contact Layne."

#### Page Architecture
```
/ (Home)
├── /listings            — live property cards, filter by status
├── /listings/[slug]     — individual property detail
├── /about               — bio, credentials, area expertise
├── /reviews             — aggregated review feed + star summary
├── /market-insights     — local suburb data, sold prices, trends
└── /contact             — lead capture form + calendar booking
```

#### Design Principles
- **Hero:** Full-bleed hero with Layne's photo + localised headline ("[X] years selling [suburb]"). NOT a stock photo city skyline.
- **Social proof above the fold:** Star rating aggregate and review count visible without scrolling.
- **Listings grid:** Card-based, filterable by For Sale / Recently Sold / Leased. Sold prices build credibility.
- **Review cards:** Pull from multiple sources with source badge (Google, RateMyAgent). Show reviewer name, date, excerpt, star rating.
- **Market insights strip:** Median price, days-on-market, clearance rate for the agent's core suburbs. Data must feel live, not stale.
- **Sticky CTA bar on mobile:** "Call Layne" + "Book Appraisal" always visible.
- **Accessibility:** WCAG AA minimum. High contrast, keyboard navigable, alt text on all property images.

#### Key Components
| Component | Priority | Notes |
|---|---|---|
| HeroSection | P0 | Localised copy, prominent CTA |
| ReviewSummaryBar | P0 | Aggregate score + count, multi-source |
| ListingGrid | P0 | Filterable, card-based |
| ReviewFeed | P1 | Paginated, source badges |
| MarketInsightsStrip | P1 | Key suburb stats |
| PropertyDetail | P1 | Full listing with image gallery |
| ContactForm | P0 | Lead capture with validation |
| CalendarEmbed | P2 | Cal.com free tier embed |

---

### ⚙️ Agent 2 — React / Next.js Architecture (Alex)

**Core Principle:** The data comes from sources Layne doesn't fully control. The architecture must handle stale/missing data gracefully and never block page render.

#### Stack Recommendation (all free tier)

| Layer | Choice | Free Tier / Cost |
|---|---|---|
| Framework | **Next.js 15 (App Router)** | Free (open source) |
| Hosting | **Vercel** | Free hobby tier — unlimited deployments, custom domain |
| Language | TypeScript | Free |
| Styling | Tailwind CSS v4 | Free |
| Data fetching | React Server Components + `fetch` with `next.revalidate` | Free |
| State | Zustand | Free |
| Forms | React Hook Form + Zod | Free |
| Images | `next/image` | Free |
| Maps | **Leaflet.js + OpenStreetMap** | Completely free, no API key |
| Email | **Resend** | Free — 3,000 emails/month, 100/day |
| CMS | **Sanity.io** | Free — 3 users, 10GB bandwidth, unlimited content |
| Lead store | **Google Sheets API** | Completely free — simple CRM via Sheets |
| Calendar | **Cal.com** | Free tier — unlimited event types |
| Uptime monitoring | **UptimeRobot** | Free — 50 monitors, 5-min intervals |
| Analytics | **Vercel Analytics** | Free — 2,500 events/month |

#### Data Source Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Next.js App Router                  │
│                                                       │
│  RSC (server-side)          Client Components         │
│  ┌──────────────┐           ┌───────────────────┐    │
│  │ Listings RSC │           │ Filter/Sort UI    │    │
│  │ Reviews RSC  │           │ Contact Form      │    │
│  │ Market RSC   │           │ Image Gallery     │    │
│  └──────┬───────┘           └───────────────────┘    │
│         │ ISR / revalidate                            │
└─────────┼───────────────────────────────────────────-┘
          │
    ┌─────┴──────────────────────────────────────┐
    │           Data Fetching Layer               │
    │                                             │
    │  lib/listings.ts   → Agency REAXML feed      │
    │                    → Sanity CMS (fallback)  │
    │  lib/reviews.ts    → RateMyAgent widget API │
    │                    → Google Places API      │
    │  lib/market.ts     → Domain API (free tier) │
    │                    → Sanity CMS (fallback)  │
    │  lib/cms.ts        → Sanity (free tier)     │
    │  lib/leads.ts      → Google Sheets API      │
    └─────────────────────────────────────────────┘
```

#### ISR Revalidation Strategy

| Data Source | TTL | Reason |
|---|---|---|
| Active listings | 60 min | Listings change but not constantly |
| Sold/leased | 24 hr | Historical, rarely changes |
| Reviews | 6 hr | New reviews are not real-time |
| Market data | 24 hr | Usually updated daily by providers |
| Agent bio/CMS | On-demand | Triggered by CMS webhook |

#### Route Structure (App Router)
```
app/
├── layout.tsx              — root layout, nav, footer
├── page.tsx                — home (RSC, ISR 60min)
├── listings/
│   ├── page.tsx            — listing grid (RSC, ISR 60min)
│   └── [slug]/page.tsx     — property detail (RSC, ISR 60min)
├── reviews/page.tsx        — review feed (RSC, ISR 6hr)
├── market-insights/page.tsx — suburb data (RSC, ISR 24hr)
├── about/page.tsx          — bio (RSC, on-demand revalidation)
├── contact/page.tsx        — contact form (client component)
└── api/
    ├── contact/route.ts    — POST handler for lead form
    └── revalidate/route.ts — webhook endpoint for CMS
```

#### Data Source Integration Notes (confirmed, NZ market)

**Listings — Sanity CMS, developer-managed:**
- Vault RE confirmed as agency platform but no integration needed.
- Developer adds/updates listings in Sanity Studio. On-demand revalidation via `/api/revalidate` after changes.
- `lib/listings.ts` fetches via GROQ from Sanity CDN. No external API calls.

**RateMyAgent NZ — confirmed, no API key:**
- Profile URL: `https://www.ratemyagent.co.nz/real-estate-agent/layne-hughes-at845/`
- Widget JSON endpoint: `https://www.ratemyagent.co.nz/real-estate-agent/layne-hughes-at845/reviews.json`
- Returns reviews array + aggregate rating. No key, no auth.
- ISR revalidate: 21600s (6 hours).
- Fallback: manually curated testimonials in Sanity if endpoint breaks.

**Google Places API — not in scope for v1:**
- No Google Business Profile exists. Removed from plan.
- Future: if Layne creates one, add `lib/reviews/google.ts` without UI changes.

**Wellington market data — REINZ reports → Sanity:**
- NZ market. Domain API (AU-only) not applicable.
- Source: REINZ monthly suburb stats (free PDF at reinz.co.nz).
- Developer enters median price, days on market, and quarterly trend into Sanity `SuburbStat` documents.
- Suburbs (confirmed, 12): Broadmeadows, Churton Park, Glenside, Grenada North, Grenada Village, Johnsonville, Khandallah, Newlands, Ngaio, Raroa, Tawa, Wadestown.
- Update cadence: quarterly, triggered by developer.

**Lead storage — Google Sheets:**
- `/api/contact` route appends row to Google Sheet via Sheets API v4.
- Notification email to Layne via Resend free tier.
- Complies with NZ Privacy Act 2020 — data deletable on request.

**Calendar booking — Cal.com embed:**
- Inline `<Cal />` component on contact page. No backend code.

**Maps — Leaflet + OpenStreetMap:**
- `react-leaflet` with OSM tiles. No API key.
- Nominatim geocoding for Wellington addresses. Server-side only (ISR-safe, respects 1 req/s limit).

#### Typed Interfaces
```typescript
interface Listing {
  id: string
  slug: string
  address: { street: string; suburb: string; city: string; postcode: string }  // NZ: city not state
  status: 'for-sale' | 'sold' | 'leased' | 'for-rent'
  price: number | null
  priceDisplay: string  // "Offers Over $850,000"
  bedrooms: number; bathrooms: number; carSpaces: number
  images: string[]
  description: string
  inspections: { date: string; time: string }[]
  listedAt: string
  soldAt?: string
}

interface Review {
  id: string
  source: 'ratemyagent'  // google removed from v1 — no Business Profile
  author: string
  rating: number  // 1-5
  body: string
  date: string
  verified: boolean
}

interface SuburbStat {
  suburb: string
  medianSalePrice: number
  medianDaysOnMarket: number
  clearanceRate: number | null
  quarterlyGrowth: number
  updatedAt: string
}
```

---

### 😈 Agent 3 — Devil's Advocate (Sam)

**Core Principle:** Identify assumptions that will bite us in production.

#### Challenge 1: API Access Is Not Guaranteed

> "We'll pull data from the agency website, review sites, and local data."

**Reality:** Most Australian real estate agencies use white-label platforms (Rex, VaultRE, Agentbox) that do NOT expose public APIs. Web scraping their site violates their ToS and will break whenever they update the DOM. RateMyAgent's API requires manual approval and has rate limits. CoreLogic/PropTrack data requires a commercial agreement costing thousands per month.

**Mitigation:**
- Design the `lib/` data layer with explicit fallback states. Every data fetch returns `data | null`, never throws.
- Build a manual data entry path (CMS) for listings and market stats from day one — don't assume APIs will arrive before launch.
- Confirm which platforms the agency uses before committing to the integration approach.
- Use Domain API (more accessible) before attempting CoreLogic.

#### Challenge 2: ISR Is Not "Live"

> "Data must feel live, not stale."

**Reality:** With ISR at 60 minutes, a listing that goes under offer at 9:01am will still show as "For Sale" until 10:01am. In real estate this matters — a buyer who calls about a sold property is a frustrated buyer.

**Mitigation:**
- Add a prominent `Last updated: X minutes ago` timestamp on all listing cards and market data.
- Provide a "Refresh" button that calls `router.refresh()` (forces a cache revalidation request).
- For the listings detail page, add a fallback "Contact us to confirm availability" disclaimer.
- Consider on-demand revalidation triggered by agency platform webhook if available.

#### Challenge 3: Next.js Might Be Overkill Right Now

> The project is currently a bare Vite + React scaffold.

**Reality:** Migrating to Next.js is a real migration, not a continuation. It changes the mental model (App Router, RSC, routing), the hosting requirements (needs a Node server or Vercel), and the build pipeline.

**Mitigation:**
- If Layne needs the site live fast and data integrations are uncertain, consider shipping v1 as a Vite SPA with mock/hardcoded data, then migrate to Next.js for v2 once API access is confirmed.
- Alternatively, commit to Next.js from day one (recommended) but acknowledge the migration cost explicitly in the timeline.
- Use Vercel for hosting — it removes deployment complexity for Next.js entirely.

#### Challenge 4: GDPR / Privacy for Lead Data

> Contact form submissions go somewhere.

**Reality:** Real estate agents in Australia are subject to the Privacy Act. Lead form data (name, email, phone) must be stored securely, not emailed as plaintext, and covered by a privacy policy.

**Mitigation:**
- Use **Google Sheets API** as the lead store (completely free). Each form submission appends a row. Layne already knows how to read Sheets — zero training cost.
- Add a privacy policy page and consent checkbox on the contact form.
- Use HTTPS everywhere (Vercel handles this).

#### Challenge 5: Content Maintenance

> Review aggregation, market data, and listings are all dynamic.

**Reality:** If any of the data sources changes their API, breaks, or removes access, the site will show empty sections with no warning. Layne will not know until a client tells her.

**Mitigation:**
- Build a simple health-check dashboard (admin-only route) that shows the last successful fetch timestamp for each data source.
- Set up uptime monitoring via **UptimeRobot** (free, 50 monitors, 5-min intervals) on the data fetch paths.
- All empty data states need graceful UI — not blank white space.

---

## Current State Analysis

| Dimension | Current State |
|---|---|
| Framework | Vite + React 19 + TypeScript (bare scaffold) |
| Routing | None |
| Styling | Vanilla CSS (index.css / App.css only) |
| Data layer | None |
| Pages | Single SPA shell |
| Hosting | Not deployed |
| APIs connected | None |

---

## Proposed Future State

A Next.js 15 App Router site deployed to Vercel with:
- Live/cached listing data from agency platform
- Aggregated reviews from Google + RateMyAgent
- Suburb market statistics
- SEO-optimised pages with structured data (JSON-LD)
- Lead capture integrated with CRM
- Layne-editable content via headless CMS

---

## Implementation Phases

### Phase 0 — Foundation (Week 1–2)
Migrate Vite project to Next.js 15. Set up Tailwind CSS, TypeScript config, Vercel deployment. Define all typed interfaces. Build design system (colours, typography, spacing) in Tailwind config.

### Phase 1 — Static Shell (Week 2–3)
Build all pages with hardcoded/mock data. No real API calls yet. Focus on layout, responsiveness, and component library. Validate design with Layne.

### Phase 2 — Data Integrations (Week 3–6)
Connect real data sources one by one. Start with whichever has the clearest API access (likely Google Places for reviews). Build the `lib/` abstraction layer. Implement ISR per data source.

### Phase 3 — Lead Capture & CRM (Week 5–6)
Wire up contact form to CRM/email. Add privacy policy. Test form submissions end-to-end.

### Phase 4 — SEO & Performance (Week 6–7)
Add metadata API (Next.js), JSON-LD structured data for listings, sitemap, robots.txt. Lighthouse audit. Image optimisation.

### Phase 5 — Launch & Monitoring (Week 7–8)
Custom domain on Vercel. Set up uptime monitoring. Hand off CMS access to Layne. Document data source dependencies.

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| RateMyAgent widget JSON endpoint breaks | Low | Medium | Fall back to Sanity-curated testimonials |
| Developer forgets to update listings in Sanity | Medium | High | Set calendar reminder; add "last updated" timestamp to listing grid |
| Suburb stats go stale (not updated quarterly) | Medium | Low | Timestamp on market stats strip; REINZ update is 1hr of work quarterly |
| Next.js migration takes longer than expected | Medium | Medium | Budget 3 days explicitly before Phase 1 |
| NZ Privacy Act 2020 non-compliance | Low | High | Privacy policy + Google Sheets lead log (deletable on request) |
| Harcourts brand mismatch | Low | Medium | Confirm exact hex from harcourts.co.nz before finalising theme |
| Cal.com embed breaks on mobile | Low | Low | Test on 375px; fallback to direct contact link |

---

## Success Metrics

| Metric | Target |
|---|---|
| Lighthouse Performance | ≥ 90 |
| Lighthouse SEO | ≥ 95 |
| Core Web Vitals | All green |
| Lead form conversion rate | ≥ 3% of visitors |
| Contact form → CRM pipeline | 100% (no dropped leads) |
| Data freshness (listings) | ≤ 60 min lag |
| Uptime | ≥ 99.5% |

---

## Required Resources & Dependencies (all free, confirmed)

| Resource | Service | Cost | Status |
|---|---|---|---|
| Sanity.io project | sanity.io | Free tier | Set up in Phase 0 |
| Vercel account | vercel.com | Free hobby tier | Set up in Phase 0 |
| Google Cloud project + service account | Google Cloud Console | Free | For Sheets API only — no billing needed |
| Google Sheets lead log | Google Drive | Free | Create Sheet, share with service account |
| Resend account | resend.com | Free — 3,000/month | Set up in Phase 3 |
| Cal.com account | cal.com | Free | Set up in Phase 1 |
| UptimeRobot account | uptimerobot.com | Free — 50 monitors | Set up in Phase 5 |
| RateMyAgent NZ agent ID | Confirmed | Free | `layne-hughes-at845` ✓ |
| REINZ monthly stats PDF | reinz.co.nz | Free | Developer reads quarterly → enters into Sanity |
| Harcourts gold hex colour | harcourts.co.nz stylesheet | Free | Confirm before Tailwind config |
| Professional photos of Layne | From Layne | — | Required before Phase 1 |
| Agent bio + suburb list | From Layne | — | Required before Phase 1 |
| Custom domain | TBC — placeholder `laynesaywellhughes.co.nz` | ~$20/yr NZ | Connect to Vercel in Phase 5 once real domain provided |

---

## Timeline Estimate

| Phase | Duration | Effort |
|---|---|---|
| Phase 0 — Foundation | 1 week | M |
| Phase 1 — Static Shell | 1.5 weeks | L |
| Phase 2 — Data Integrations | 3 weeks | XL |
| Phase 3 — Lead Capture | 1 week | M |
| Phase 4 — SEO & Performance | 1 week | M |
| Phase 5 — Launch | 0.5 weeks | S |
| **Total** | **~8 weeks** | |
