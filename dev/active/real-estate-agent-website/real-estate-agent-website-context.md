# Real Estate Agent Website — Context & Decisions

Last Updated: 2026-04-29 (session 1 — planning only, no code written)

---

## Project Identity

- **Client:** Real estate agent "Layne"
- **Goal:** Personal brand website that aggregates listings, reviews, and local market data
- **Target market:** Australian real estate (AU privacy laws, AU data providers)

---

## Current Codebase State

| File             | Notes                                            |
| ---------------- | ------------------------------------------------ |
| `package.json`   | Vite + React 19 + TypeScript. No Next.js yet.    |
| `src/App.tsx`    | Default Vite scaffold — replace entirely         |
| `src/main.tsx`   | Entry point — will change with Next.js migration |
| `vite.config.ts` | Will be replaced by `next.config.ts`             |
| `tsconfig.json`  | Needs Next.js-specific adjustments               |

**Migration required:** Vite → Next.js 15 (App Router)

---

## Key Architectural Decisions

### ADR-001: Next.js 15 over Vite SPA

**Decision:** Migrate to Next.js 15 App Router.
**Reason:** ISR per-data-source is the cleanest solution to the multi-source stale data problem. SSR also improves SEO, which is critical for "real estate agent [suburb]" search queries.
**Trade-off:** Migration cost ~3 days. Accept this.

### ADR-002: ISR over full SSR or CSR

**Decision:** Use ISR with per-route `revalidate` values.
**Reason:** Real estate data changes on the order of hours, not seconds. ISR gives fast page loads without the complexity of real-time websockets.
**Trade-off:** Data can be up to TTL minutes stale. Mitigate with "last updated" UI.

### ADR-003: CMS fallback for all data sources

**Decision:** Every data source has a CMS fallback (manual entry path).
**Reason:** API access to agency platforms and review sites is not guaranteed at project start. Ship v1 with real data even if some integrations aren't ready.

### ADR-004: Tailwind CSS v4

**Decision:** Use Tailwind CSS v4 for styling.
**Reason:** Utility-first accelerates iteration; v4 no longer requires PostCSS config; aligns with Next.js 15 defaults.

### ADR-010: Listings managed in Sanity CMS — no Vault integration

**Decision:** All listing data entered manually into Sanity by the developer. No connection to Vault RE.
**Reason:** Layne confirmed Vault integration is not needed. Manual entry is simpler, more reliable, and free.
**Trade-off:** Developer effort to add/update listings. Acceptable — Layne is a sole agent, not a high-volume team.

### ADR-011: Sanity as single source of truth for all content

**Decision:** Sanity holds listings, suburb stats, bio, and testimonials fallback. RateMyAgent widget provides live reviews.
**Reason:** With no agency API and no Google Business Profile, Sanity + RateMyAgent covers 100% of content needs. No other integrations required for v1.
**Trade-off:** Developer must update Sanity when listings change. Acceptable per Layne's preference.

### ADR-012: Harcourts-aligned Tailwind theme

**Decision:** Use Harcourts gold and dark charcoal as brand colours. Personal site, not official Harcourts site.
**Reason:** Layne is a Harcourts agent. Visual alignment builds trust with clients who recognise the brand.
**How to apply:** Confirm exact hex from `harcourts.co.nz` stylesheet before finalising Tailwind config. Approximate: gold `#C9A84C`, dark `#1A1A1A`.

### ADR-013: NZ Privacy Act 2020, not AU Privacy Act

**Decision:** Privacy policy and data handling must comply with NZ Privacy Act 2020 (not Australian).
**Reason:** Layne is based in Wellington, NZ — confirmed by RateMyAgent `.co.nz` URL and Wellington suburbs.
**How to apply:** Privacy policy page must reference NZ Privacy Act 2020. Lead data stored in Google Sheets must be accessible/deletable on request.

### ADR-006: Leaflet + OpenStreetMap over Google Maps / Mapbox

**Decision:** Use `react-leaflet` with OpenStreetMap tiles for property maps.
**Reason:** Completely free with no API key. Google Maps requires billing enabled and charges after $200/month credit. Mapbox has a free tier but requires a token and has a 50k load limit.
**Trade-off:** OSM tiles are less polished than Google/Mapbox visually. Acceptable for a personal agent site.

### ADR-007: Google Sheets as lead CRM over HubSpot / Airtable

**Decision:** Store contact form leads in a Google Sheet via Sheets API v4.
**Reason:** Completely free, no account sign-up friction for Layne, she likely already uses Sheets. Resend sends a notification email too, so she has dual visibility.
**Trade-off:** No built-in pipeline/deal stages. Acceptable for v1; upgrade path to HubSpot is a webhook addition.

### ADR-008: RateMyAgent widget JSON endpoint over official API

**Decision:** Fetch reviews from the undocumented embed widget JSON endpoint (`/real-estate-agent/[id]/reviews.json`).
**Reason:** Official API requires a manual approval process and may be paid. The widget endpoint is what their own embed uses — stable enough.
**Trade-off:** Undocumented; could break if RateMyAgent changes their embed. Fallback: manually curated testimonials in Sanity.

### ADR-009: Cal.com over Calendly for booking

**Decision:** Use Cal.com free tier for inspection/appraisal bookings.
**Reason:** Cal.com free tier is unlimited event types and bookings. Calendly free tier is limited to 1 event type. Cal.com is also open source.
**Trade-off:** Cal.com brand is less recognized, but embed experience is comparable.

### ADR-005: Sanity as CMS

**Decision:** Sanity.io free tier for agent bio, fallback listing data, and suburb descriptions.
**Reason:** Generous free tier, excellent Next.js integration, Layne can self-edit via Studio UI.

---

## Data Source Reference (confirmed, free only)

| Source                      | Purpose                              | How                                                           | Cost         | Status                                         |
| --------------------------- | ------------------------------------ | ------------------------------------------------------------- | ------------ | ---------------------------------------------- |
| **Sanity CMS**              | Listings (manual), bio, suburb stats | GROQ API                                                      | Free tier    | Set up Phase 0 — primary source                |
| **RateMyAgent** `.co.nz`    | Agent reviews + rating               | Widget JSON endpoint — no key. Agent ID: `layne-hughes-at845` | Free         | Ready — ID confirmed                           |
| ~~Google Places API~~       | ~~Google reviews~~                   | ~~REST~~                                                      | ~~Free~~     | **Removed — no Google Business Profile in v1** |
| ~~Domain API~~              | ~~Suburb stats~~                     | ~~REST~~                                                      | ~~Free~~     | **Removed — AU only, NZ market**               |
| ~~Agency REAXML feed~~      | ~~Live listings~~                    | ~~XML feed~~                                                  | ~~Free~~     | **Removed — Vault not integrated**             |
| **REINZ monthly reports**   | Wellington suburb stats              | Manual — developer reads PDF, enters into Sanity              | Free         | Quarterly update cadence                       |
| **Google Sheets API**       | Lead/CRM storage                     | REST via service account                                      | Free         | Create Sheet + service account                 |
| **Leaflet + OpenStreetMap** | Property maps                        | react-leaflet, OSM tiles                                      | Free, no key | Install in Phase 1                             |
| **Nominatim**               | Address geocoding                    | REST, 1 req/s limit — server-side only                        | Free, no key | ISR-safe                                       |

---

## Component Inventory (Planned)

```
components/
├── layout/
│   ├── Header.tsx          — nav + sticky CTA bar (mobile)
│   └── Footer.tsx
├── listings/
│   ├── ListingGrid.tsx     — filterable card grid (client component)
│   ├── ListingCard.tsx     — individual card
│   └── ListingDetail.tsx   — full property page
├── reviews/
│   ├── ReviewSummaryBar.tsx — aggregate score, multi-source
│   ├── ReviewFeed.tsx      — paginated review list
│   └── ReviewCard.tsx      — individual review with source badge
├── market/
│   └── MarketInsightsStrip.tsx — key suburb stats
├── home/
│   └── HeroSection.tsx
└── shared/
    ├── ContactForm.tsx     — lead capture (react-hook-form + zod)
    ├── StarRating.tsx
    └── SourceBadge.tsx     — Google / RateMyAgent badge
```

---

## Environment Variables Required

```bash
# RateMyAgent NZ — no API key, just the agent ID from profile URL
LAYNE_RATEMYAGENT_ID=layne-hughes-at845

# Sanity CMS (free tier)
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=               # read-write token for Route Handler revalidation

# Resend email (free — 3,000/month)
RESEND_API_KEY=
LAYNE_EMAIL=                    # where lead notifications are sent

# Google Sheets lead log (free — service account auth)
GOOGLE_SHEETS_SPREADSHEET_ID=
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_SERVICE_ACCOUNT_KEY=    # base64-encoded JSON key

# Cal.com calendar embed (free — just the username/slug, no secret needed)
NEXT_PUBLIC_CAL_LINK=           # e.g. "layne-hughes/appraisal"

# Revalidation webhook secret (generate with: openssl rand -hex 32)
REVALIDATE_SECRET=
```

**Removed variables:** `AGENCY_REAXML_FEED_URL`, `GOOGLE_PLACES_API_KEY`, `LAYNE_GOOGLE_PLACE_ID`, `DOMAIN_API_KEY`, `LAYNE_SUBURBS` — none of these integrations are in scope.

---

## Hosting

- **Platform:** Vercel (free tier for personal sites)
- **Custom domain:** To be provided by Layne
- **SSL:** Automatic via Vercel

---

## Session 1 Handoff Notes (2026-04-29)

### What happened this session

- Ran a multi-agent planning exercise (UI/UX: Jordan, Architecture: Alex, Devil's Advocate: Sam)
- Created all three plan files; no implementation begun
- Current repo is a **bare Vite + React 19 + TypeScript scaffold** — `src/` contains only `App.tsx`, `main.tsx`, `App.css`, `index.css`, and an `assets/` folder

### Immediate next steps for next session

1. ~~Answer the open questions~~ — **all answered, unblocked**
2. Confirm Harcourts gold hex from `harcourts.co.nz` stylesheet before setting Tailwind theme
3. Begin Phase 0 migration: `npx create-next-app@latest` in the project root, then set up Tailwind + Sanity
4. Create Sanity schemas: `Listing`, `SuburbStat`, `AgentProfile`
5. First data integration: RateMyAgent widget JSON (`/real-estate-agent/layne-hughes-at845/reviews.json`)

### No uncommitted changes — nothing partially done

The Vite scaffold files (`src/App.tsx` etc.) are untouched. Safe to start Phase 0 fresh.

### Key devil's advocate warnings to keep front of mind

- **Do not assume API access** to Rex/VaultRE/Agentbox exists — design `lib/` with `data | null` returns and build Sanity fallback first
- **Do not build on Vite** — commit to Next.js 15 from day one; the ISR + RSC model is load-bearing for the data strategy
- **Privacy Act** — CRM integration (not inbox email) must be in scope before launch

---

## Confirmed Answers (2026-04-29)

| Question                | Answer                                                                          | Impact                                                        |
| ----------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Agency CRM/platform     | **Vault RE** — no integration needed                                            | Listings entered manually in Sanity by developer              |
| Google Business Profile | **None** — skip for v1                                                          | Remove Google Places API from scope entirely                  |
| RateMyAgent             | **Yes** — `https://www.ratemyagent.co.nz/real-estate-agent/layne-hughes-at845/` | Agent ID: `layne-hughes-at845`, NZ domain                     |
| Primary market          | **Wellington, NZ — northern suburbs**                                           | Site is NZ, not AU. All data sources must be NZ-relevant      |
| Brand guidelines        | **No strict rules — align with Harcourts**                                      | Use Harcourts gold + charcoal palette (see brand note below)  |
| Market data budget      | **None**                                                                        | Manual suburb stats in Sanity CMS, updated by developer       |
| CMS ownership           | **Developer updates**                                                           | Simplify Sanity schema — no need for Layne-friendly Studio UX |

### Harcourts Brand Note

Harcourts’ primary palette is **gold and dark charcoal/navy**. The personal site is not an official Harcourts site, but should feel consistent:

- Primary: Harcourts gold — approximately `#C9A84C` (confirm from harcourts.co.nz stylesheet)
- Dark: deep charcoal `#1A1A1A` or navy `#0D1B2A`
- Background: white / light warm grey
- Avoid blues/greens that clash with the Harcourts identity

### Market: Wellington, NZ — Data Sources

This is **New Zealand**, not Australia. Domain API, CoreLogic AU, and PropTrack are irrelevant.

Free NZ alternatives for suburb stats:

- **REINZ** (Real Estate Institute of NZ) — publishes monthly suburb-level median price PDFs. No public API. Developer scrapes/transcribes key stats into Sanity quarterly.
- **stats.govt.nz** — Statistics NZ, free open data (census demographics, area profiles).
- **TradeMe Property** — NZ’s main portal. No free stats API, but property count/pricing visible publicly.
- **Decision: manual Sanity entry** — developer maintains a `SuburbStat` document per suburb, updated quarterly from REINZ monthly reports. Zero API cost, zero integration risk.

## Wellington Northern Suburbs (confirmed)

12 suburbs for `SuburbStat` documents in Sanity:

1. Broadmeadows
2. Churton Park
3. Glenside
4. Grenada North
5. Grenada Village
6. Johnsonville
7. Khandallah
8. Newlands
9. Ngaio
10. Raroa
11. Tawa
12. Wadestown

## Domain / URL (confirmed)

**Placeholder: `laynesaywellhughes.co.nz`** — real domain TBC, will be provided later.

- Use placeholder in `NEXT_PUBLIC_SITE_URL`, `metadataBase`, and sitemap during development
- Swap for real domain in Vercel env vars + custom domain settings once confirmed — no code changes needed
