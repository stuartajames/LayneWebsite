# Layne Hughes Real Estate — Simplified Build Plan

Last Updated: 2026-04-29 (rev 2 — v2 review tactical fixes applied)
Supersedes: `dev/active/real-estate-agent-website/` (over-scoped original plan)
Review source: `dev/active/real-estate-agent-website/real-estate-agent-website-review.md`

---

## Executive Summary

A 3-week build for a Wellington NZ real estate agent's personal brand site. Harcourts-aligned styling. Three live data sources: Sanity CMS (listings, suburb stats, bio), RateMyAgent NZ (reviews), and Resend (lead email). Everything else cut.

**Stack:** Next.js 15 App Router · Tailwind CSS v4 · Sanity.io free · Resend free · Cloudflare Pages (free, commercial OK) or Vercel Pro ($20/mo)

---

## What Was Cut (and Why)

| Removed | Reason |
|---|---|
| Google Sheets CRM | Resend email to Layne *is* the CRM for 10–30 leads/month |
| Cal.com embed | Adds tracking scripts to the conversion page; Layne replies with her own calendar link |
| Leaflet / Nominatim / maps | A static suburb illustration on /about ships in 30 min and costs nothing |
| Sticky mobile CTA bar | Fights iOS Safari UI; a header CTA is sufficient |
| UptimeRobot | Theatre — alerts go to same inbox as leads |
| Health-check dashboard | Two data sources, both with fallbacks; not worth the engineering |
| Multi-source `ReviewSummaryBar` branding | RateMyAgent is the only review source; no "SourceBadge" needed |
| Hourly ISR TTL on listings | Listings are manually published — on-demand revalidation via Sanity webhook is instant and simpler |

**RateMyAgent integration is kept for day 1** but gated behind a mandatory verification step (see Phase 0).

---

## Architecture

### Stack

| Layer | Choice | Cost |
|---|---|---|
| Framework | Next.js 15 App Router | Free |
| Hosting | **Cloudflare Pages** (recommended) | Free — no commercial restriction |
| — alternative | Vercel Pro | USD$20/mo — zero Next.js compatibility risk |
| Styling | Tailwind CSS v4 | Free |
| CMS | Sanity.io free tier | Free — 10GB bandwidth, 100k API req/mo |
| Reviews | RateMyAgent `.co.nz` widget JSON | Free — no key |
| Email / leads | Resend free tier | Free — 3,000 emails/mo |
| Analytics | Cloudflare Web Analytics | Free — unlimited, no event cap |
| Domain | `laynesaywellhughes.co.nz` (placeholder) | ~$20/yr NZ |

> **Cloudflare Pages vs Vercel:** Cloudflare Pages is genuinely free for commercial sites and supports Next.js via `@cloudflare/next-on-pages`. If any Next.js feature causes compatibility issues during build, fall back to Vercel Pro — do not fight the adapter.

### Data Flow

```
Sanity CMS (listings, suburb stats, bio)
    └── lib/listings.ts  → revalidate: false + /api/revalidate webhook
    └── lib/market.ts    → revalidate: false + /api/revalidate webhook
    └── lib/bio.ts       → revalidate: false + /api/revalidate webhook

RateMyAgent .co.nz widget JSON
    └── lib/reviews.ts   → revalidate: 21600 (6hr ISR — can't webhook)
    └── Fallback: Sanity `testimonial` documents if endpoint fails

Contact form (client component)
    └── /api/contact route → Resend → Layne's inbox (structured email)
    └── No secondary storage
    └── Dev sender: onboarding@resend.dev until domain verified in Phase 3
```

### Route Structure

```
app/
├── layout.tsx                  — root layout, header, footer
├── page.tsx                    — home (on-demand ISR)
├── listings/
│   ├── page.tsx                — listing grid (on-demand ISR)
│   └── [slug]/
│       ├── page.tsx            — property detail (on-demand ISR)
│       └── not-found.tsx       — expired slug recovery page
├── reviews/page.tsx            — review feed (6hr ISR)
├── market-insights/page.tsx    — suburb stats (on-demand ISR)
├── about/page.tsx              — bio (on-demand ISR)
├── contact/page.tsx            — contact form (client component)
├── privacy/page.tsx            — NZ Privacy Act 2020 policy (static)
└── api/
    ├── contact/route.ts        — POST: validate → Resend email
    └── revalidate/route.ts     — POST: Sanity webhook → on-demand revalidation
```

### Revalidation Strategy

| Data | Strategy | Why |
|---|---|---|
| Listings | `revalidate: false` + Sanity webhook | Developer publishes → site updates within seconds |
| Suburb stats | `revalidate: false` + Sanity webhook | Quarterly updates only |
| Bio / about | `revalidate: false` + Sanity webhook | Rarely changes |
| Reviews | `revalidate: 21600` (6hr TTL) | Can't webhook RateMyAgent; 6hr is fine |

### Components

```
components/
├── layout/
│   ├── Header.tsx           — nav + single "Contact" CTA (no sticky bar)
│   └── Footer.tsx
├── listings/
│   ├── ListingGrid.tsx      — tabs only rendered when bucket has ≥1 listing
│   │                          defaults to "Recently Sold" if For Sale is empty
│   ├── ListingCard.tsx      — card with status pill
│   └── ListingDetail.tsx    — gallery (max 6 photos), share/copy-link button
├── reviews/
│   ├── ReviewSummaryBar.tsx — aggregate score from RateMyAgent only
│   ├── ReviewFeed.tsx       — paginated
│   └── ReviewCard.tsx       — no source badge (single source)
├── market/
│   └── MarketInsightsStrip.tsx — median price, days on market, sales volume
│                                  NO clearanceRate (not a NZ REINZ metric)
├── home/
│   └── HeroSection.tsx      — fixed "northern Wellington" headline, no suburb templating
└── shared/
    ├── ContactForm.tsx      — react-hook-form + Zod, Resend only
    └── StarRating.tsx
```

---

## Typed Interfaces

```typescript
// types/index.ts

interface Listing {
  id: string
  slug: string
  address: { street: string; suburb: string; city: string; postcode: string }
  status: 'for-sale' | 'sold' | 'leased' | 'for-rent'
  price: number | null
  priceDisplay: string
  bedrooms: number
  bathrooms: number
  carSpaces: number
  images: string[]           // max 6, served via Sanity CDN with next/image loader
  description: string
  inspections: { date: string; time: string }[]
  listedAt: string
  soldAt?: string
}

interface Review {
  id: string
  source: 'ratemyagent'      // single source — no SourceBadge component needed
  author: string
  rating: number             // 1–5
  body: string
  date: string
}

interface SuburbStat {
  suburb: string
  medianSalePrice: number
  medianDaysOnMarket: number
  salesVolume: number        // replaces clearanceRate — actually in REINZ reports
  yearOnYearChange: number   // percentage
  updatedAt: string          // shown to user so stale data is visible
}

interface AgentProfile {
  name: string
  bio: string
  photo: string
  yearsExperience: number
  phone: string
  email: string
  credentials: string[]
}
```

---

## SEO

- `metadata` export on every page (title, description, OG image)
- `app/sitemap.ts` — generates from Sanity listing slugs
- `app/robots.ts`
- JSON-LD on home: `RealEstateAgent` schema
- JSON-LD on listing detail: `Product` + `Offer` schema (not `RealEstateListing` — not in Schema.org spec)
- `metadataBase`: `https://laynesaywellhughes.co.nz` (placeholder — swap when real domain confirmed)

---

## Environment Variables

```bash
# RateMyAgent NZ (no API key — ID only)
LAYNE_RATEMYAGENT_ID=layne-hughes-at845

# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=              # read token for fetching from private Sanity dataset (NOT for webhook auth)

# Resend (lead email)
RESEND_API_KEY=
LAYNE_EMAIL=                   # lead notification recipient

# Site URL (swap for real domain when confirmed)
NEXT_PUBLIC_SITE_URL=https://laynesaywellhughes.co.nz

# Revalidation webhook secret
REVALIDATE_SECRET=             # openssl rand -hex 32
```

---

## RateMyAgent Integration — Verification Required First

**Before writing `lib/reviews.ts`**, run all three tests (tasks T01–T03):

```bash
# Test 1 — residential IP
curl -i \
  -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" \
  -H "Referer: https://www.ratemyagent.co.nz" \
  https://www.ratemyagent.co.nz/real-estate-agent/layne-hughes-at845/reviews.json

# Test 2 — server/cloud IP (run from a VPS or Cloudflare Worker)
# Same curl command from a non-residential IP

# Test 3 — browser CORS (paste in DevTools console on example.com)
# fetch('https://www.ratemyagent.co.nz/real-estate-agent/layne-hughes-at845/reviews.json')
#   .then(r => r.json()).then(console.log)
```

| T01 residential | T02 server | T03 CORS | Strategy |
|---|---|---|---|
| ✅ 200 JSON | ✅ 200 JSON | — | Server-side ISR in `lib/reviews.ts` |
| ✅ 200 JSON | ❌ blocked | ✅ no CORS error | Client-side `useEffect` in `ReviewFeed` |
| ✅ 200 JSON | ❌ blocked | ❌ CORS blocked | Sanity testimonials only |
| ❌ blocked | ❌ blocked | ❌ blocked | Sanity testimonials only |

**If strategy is Sanity testimonials:** request 3–5 written testimonials (text + author name) from Layne immediately at T04 — do not wait until Phase 2. No other code or UI changes needed.

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| RateMyAgent endpoint blocked server-side | Medium | Medium | T02 server test confirms; client-side useEffect fallback if residential-only |
| RateMyAgent client-side fetch blocked by CORS | Medium | Medium | T03 browser test confirms; if blocked, Sanity testimonials only — zero UI changes |
| Sanity image bandwidth hits 10GB free cap | Low (initially) | Medium | Custom `next/image` loader (T18) + cap photos at 6 per listing, 1280px webp |
| Resend email lands in spam | Medium | High | Use `onboarding@resend.dev` for dev; domain DNS verification (SPF/DKIM/DMARC) in Phase 3 |
| Cloudflare Pages Next.js adapter issues | Low-Medium | High | Fallback to Vercel Pro ($20/mo) — no code changes needed; decision point end of Phase 0 |
| Listings tabs show empty state | Medium | Medium | Only render tab when bucket ≥1; default to Sold |
| Privacy policy copy not provided | Medium | Medium | Explicitly Layne's responsibility — NZ OPC template at privacy.org.nz |
| Sanity outage | Very low | Low | `revalidate: false` serves previous cache — acceptable for a brochure site |
| Testimonial content missing if RateMyAgent blocked | Medium | Medium | Surface at T04 — request from Layne immediately if blocked path confirmed |

---

## Required Resources

| Resource | From | Status |
|---|---|---|
| Sanity.io account + project | Developer | Set up in Phase 0 |
| Resend account + domain verification | Developer + Layne DNS access | Phase 0 setup, DNS in Phase 2 |
| Cloudflare Pages account | Developer | Phase 0 |
| Layne's professional photos | Layne | Required before Phase 1 |
| Layne's bio copy + credentials | Layne | Required before Phase 1 |
| Privacy policy text | Layne (use OPC template) | Required before launch |
| Real domain (when confirmed) | Layne | Replace placeholder in Phase 3 |
| REINZ monthly stats PDF | reinz.co.nz (free) | Developer enters into Sanity — quarterly |

---

## Implementation Phases

### Phase 0 — Setup (3–4 days)
Migrate Vite → Next.js 15. Configure Tailwind with Harcourts palette. Set up Sanity project + schemas. Deploy blank site to Cloudflare Pages. Verify RateMyAgent endpoint. Configure Resend domain.

### Phase 1 — Pages with mock data (4–5 days)
Build all 6 routes + components with hardcoded data. Full responsive layout. Design sign-off from Layne.

### Phase 2 — Wire up data sources (3–4 days)
Connect Sanity GROQ for listings, suburb stats, bio. Connect RateMyAgent reviews (or Sanity testimonials if blocked). Wire contact form to Resend. Set up Sanity webhook → `/api/revalidate`.

### Phase 3 — SEO, polish, launch (2–3 days)
Metadata, JSON-LD, sitemap, robots. Lighthouse audit (target ≥90/95). Privacy policy page. Enter real content into Sanity. Connect domain. Done.

---

## Timeline

| Phase | Days | Cumulative |
|---|---|---|
| Phase 0 — Setup | 3–4 | Week 1 |
| Phase 1 — Static shell | 4–5 | Week 1–2 |
| Phase 2 — Data + form | 3–4 | Week 2 |
| Phase 3 — SEO + launch | 2–3 | Week 3 |
| **Total** | **~3 weeks** | |

---

## Success Metrics

| Metric | Target |
|---|---|
| Lighthouse Performance | ≥ 90 |
| Lighthouse SEO | ≥ 95 |
| Core Web Vitals | All green |
| Contact form → Layne's inbox | 100% delivery |
| Listing photo load time | < 1s (LCP) |
| Zero empty section whiteouts | All states handled |
