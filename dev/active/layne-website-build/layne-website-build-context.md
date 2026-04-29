# Layne Hughes Real Estate — Build Context

Last Updated: 2026-04-29

---

## Project Identity

- **Client:** Layne Hughes, real estate agent
- **Agency:** Harcourts (personal site — not an official Harcourts site)
- **Market:** Wellington, NZ — northern suburbs
- **Goal:** Personal brand site converting vendors and buyers into leads
- **Domain:** `laynesaywellhughes.co.nz` (placeholder — real domain TBC)

---

## Codebase State

| File | Notes |
|---|---|
| `package.json` | Vite + React 19 + TypeScript — **replace entirely with Next.js 15** |
| `src/App.tsx` | Default scaffold — delete |
| `vite.config.ts` | Delete — replaced by `next.config.ts` |
| `tsconfig.json` | Update for Next.js |

Migration command: `npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"`
Run from project root — it will scaffold over the Vite files.

---

## Confirmed Decisions

| Item | Confirmed Value |
|---|---|
| Agency | Vault RE — no integration |
| Google Business Profile | None — skip v1 |
| RateMyAgent NZ | `layne-hughes-at845` — `https://www.ratemyagent.co.nz/real-estate-agent/layne-hughes-at845/` |
| Suburbs (12) | Broadmeadows, Churton Park, Glenside, Grenada North, Grenada Village, Johnsonville, Khandallah, Newlands, Ngaio, Raroa, Tawa, Wadestown |
| Brand palette | Harcourts gold (confirm hex from harcourts.co.nz) + dark charcoal |
| CMS manager | Developer (not Layne) |
| Domain | `laynesaywellhughes.co.nz` placeholder — real domain TBC |
| Privacy law | NZ Privacy Act 2020 |

---

## Harcourts Brand

- **Primary:** Harcourts gold — verify exact hex from `harcourts.co.nz` stylesheet (approx `#C9A84C`)
- **Dark:** Charcoal `#1A1A1A`
- **Background:** White / warm light grey
- **Avoid:** Blues and greens

Tailwind config should define `brand-gold`, `brand-dark` as custom colours.

---

## Key Architectural Decisions

### ADR-001: Next.js 15 App Router
Needed for ISR + RSC + SEO. Vite SPA has no server rendering.

### ADR-002: On-demand ISR for Sanity content; 6hr TTL for RateMyAgent
Sanity content is developer-published — instant revalidation via webhook is strictly better than hourly TTL. RateMyAgent has no webhook — 6hr TTL is acceptable.

Implementation detail: use `revalidateTag` (not `revalidatePath`) in `/api/revalidate`. Tag GROQ fetches with `next: { tags: ['listings'] | ['market'] | ['bio'] }`. The Sanity webhook payload includes `_type` — use it to call the correct tag. `revalidatePath` won't update individual `/listings/[slug]` detail pages. Also tag the `sitemap.ts` GROQ fetch with `['listings']` so new slugs appear in the sitemap on publish.

### ADR-003: Cloudflare Pages as primary host
Genuinely free for commercial sites. No event cap. Cloudflare Web Analytics included.
**Fallback:** Vercel Pro (USD$20/mo) if `@cloudflare/next-on-pages` adapter causes compatibility issues. Decision point: end of Phase 0 build/deploy test.

### ADR-004: Resend only for lead capture (no Sheets CRM)
10–30 leads/month doesn't need a database. Resend notification email to Layne is sufficient. Removing Sheets eliminates a service account, key rotation risk, and a privacy obligation.

### ADR-005: Sanity as single source of truth
Listings, suburb stats, bio, and testimonials (RateMyAgent fallback) all live in Sanity.
Developer enters and maintains content. No Layne-friendly Studio UX required.

### ADR-006: RateMyAgent day-1 with client-side fallback option
The widget JSON endpoint must be verified server-side before building `lib/reviews.ts`. If server-side fetch is blocked, implement as a client-side `useEffect` fetch instead. If completely unreachable, fall back to Sanity testimonials — zero UI changes required.

### ADR-007: No maps in v1
Static suburb illustration (SVG or image) on /about. Leaflet, Nominatim, and react-leaflet are out of scope for v1 entirely.

### ADR-008: Listing tabs conditionally rendered
Only render a "For Sale" / "Sold" / "Leased" tab when that bucket has ≥1 listing. Default visible tab is "Recently Sold" when For Sale is empty (sold stock builds credibility).

### ADR-009: No clearanceRate in SuburbStat
REINZ NZ reports don't publish suburb-level clearance rates for Wellington northern suburbs. Use `salesVolume` (quarterly count) and `yearOnYearChange` (%) instead — both available in REINZ monthly PDFs.

### ADR-010: JSON-LD schema
- Home page: `RealEstateAgent` schema
- Listing detail: `Product` + `Offer` schema (NOT `RealEstateListing` — not in Schema.org spec)

---

## RateMyAgent Verification Checklist

Run before building `lib/reviews.ts`:

```bash
# Test 1 — residential IP
curl -i \
  -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" \
  -H "Referer: https://www.ratemyagent.co.nz" \
  https://www.ratemyagent.co.nz/real-estate-agent/layne-hughes-at845/reviews.json

# Test 2 — server/cloud IP (VPS or Cloudflare Worker)
# Same curl from a non-residential IP

# Test 3 — browser CORS (DevTools console on example.com)
# fetch('https://www.ratemyagent.co.nz/real-estate-agent/layne-hughes-at845/reviews.json')
#   .then(r => r.json()).then(console.log)
```

Expected: `HTTP/2 200`, `Content-Type: application/json`, body contains `reviews` array.

| T01 residential | T02 server | T03 CORS | Strategy |
|---|---|---|---|
| ✅ | ✅ | — | Server-side ISR in `lib/reviews.ts`, `revalidate: 21600` |
| ✅ | ❌ | ✅ | Client-side `useEffect` in `ReviewFeed` — data loads post-hydration |
| ✅ | ❌ | ❌ | Sanity `testimonial` documents only |
| ❌ | ❌ | ❌ | Sanity `testimonial` documents only |

**Record result here after T01–T04:** `[ strategy confirmed: ___ ]`

If Sanity testimonials path: request 3–5 written testimonials from Layne at T04.

---

## Sanity Schema Plan

```
schemas/
├── listing.ts        — Listing document
├── suburbStat.ts     — SuburbStat document (one per suburb, 12 total)
├── agentProfile.ts   — Singleton (bio, photo, credentials)
└── testimonial.ts    — Fallback if RateMyAgent blocked
```

**Image configuration:** Use Sanity's image pipeline with `@sanity/image-url`. Configure `next/image` with Sanity's CDN hostname (`cdn.sanity.io`) in `next.config.ts`. Cap listings at 6 photos at 1280px width max.

---

## Resend Email Setup

**Phase 0/1/2:** Use `onboarding@resend.dev` as the sender. No DNS setup required. Sufficient for dev testing.

**Phase 3 (production):** Switch to a verified sender on the real domain. Domain verification requires DNS access. Do not configure against the placeholder domain — wait until the real domain is confirmed.

Sending domain must be verified for deliverability (SPF, DKIM, DMARC). This requires DNS access on the real domain.

**DNS records needed (Resend provides exact values):**
- TXT record for SPF
- CNAME records for DKIM (3 records)
- TXT record for DMARC

**Layne must provide DNS access before Phase 2.** Budget 2–3 hours for DNS propagation and verification.

Lead email format to Layne:
```
Subject: New enquiry — [Name]
Body:
  Name: [name]
  Email: [email]
  Phone: [phone]
  Message: [message]
  Enquiry type: [appraisal|viewing|general]
  Submitted: [timestamp]
```

---

## Component List (simplified)

```
components/
├── layout/
│   ├── Header.tsx           — nav links + "Contact Layne" button (header only)
│   └── Footer.tsx           — address, phone, RateMyAgent link, Harcourts logo credit
├── listings/
│   ├── ListingGrid.tsx      — conditional tabs, "Recently Sold" default
│   ├── ListingCard.tsx      — status pill, price display, bed/bath/car
│   └── ListingDetail.tsx    — gallery (max 6), share button, "contact about this property"
├── reviews/
│   ├── ReviewSummaryBar.tsx — aggregate stars + count from RateMyAgent
│   ├── ReviewFeed.tsx       — paginated list
│   └── ReviewCard.tsx       — author, date, star rating, body
├── market/
│   └── MarketInsightsStrip.tsx — median price, days on market, sales volume, YoY %
├── home/
│   └── HeroSection.tsx      — Layne photo, fixed headline, primary CTA
└── shared/
    ├── ContactForm.tsx      — react-hook-form + Zod, enquiry type select
    └── StarRating.tsx
```

---

## Environment Variables

```bash
# RateMyAgent NZ (no API key)
LAYNE_RATEMYAGENT_ID=layne-hughes-at845

# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=              # read token for fetching from private dataset — NOT for webhook auth

# Resend
RESEND_API_KEY=
LAYNE_EMAIL=

# Site
NEXT_PUBLIC_SITE_URL=https://laynesaywellhughes.co.nz

# Revalidation webhook
REVALIDATE_SECRET=
```

---

## Open Items

- [ ] Confirm real domain (placeholder `laynesaywellhughes.co.nz` in use)
- [ ] Verify exact Harcourts gold hex from `harcourts.co.nz`
- [ ] Layne to provide professional photos (hero + about)
- [ ] Layne to provide bio copy and credentials
- [ ] Layne to provide privacy policy text (NZ OPC template recommended)
- [ ] Layne to provide DNS access for Resend domain verification
