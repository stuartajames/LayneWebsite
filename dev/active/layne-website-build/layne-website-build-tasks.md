# Layne Hughes Real Estate — Build Tasks

Last Updated: 2026-04-29
Status: **Ready to build. All planning decisions confirmed.**
Timeline: ~3 weeks

---

## Phase 0 — Setup (Days 1–4)

### 0.1 Verify RateMyAgent endpoint FIRST — before any other work
- [ ] **T01** Run curl test from residential IP (see context.md verification checklist) `S`
- [ ] **T02** Run curl test from a server/VPS/cloud IP `S`
- [ ] **T03** Record result in context.md: server-side OK / client-side only / blocked `S`
- [ ] **T04** Based on result: confirm `lib/reviews.ts` fetch strategy (server ISR / client useEffect / Sanity testimonials) `S`

**Do not proceed to T05 until T01–T04 are done.**

### 0.2 Project migration
- [ ] **T05** Run `npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"` in project root `S`
- [ ] **T06** Delete Vite files: `vite.config.ts`, `index.html`, `src/App.tsx`, `src/App.css`, `src/main.tsx` `S`
- [ ] **T07** Update `tsconfig.json` for Next.js (create-next-app does this — verify) `S`
- [ ] **T08** Verify `npm run build` passes on blank Next.js scaffold `S`

### 0.3 Harcourts theme
- [ ] **T09** Inspect `harcourts.co.nz` stylesheet — record exact gold hex, dark hex `S`
- [ ] **T10** Configure Tailwind `tailwind.config.ts` with `brand-gold`, `brand-dark`, `brand-bg` colours `S`

### 0.4 Sanity setup
- [ ] **T11** Create Sanity project at sanity.io (free tier) `S`
- [ ] **T12** Install `sanity`, `@sanity/image-url`, `next-sanity` `S`
- [ ] **T13** Write `sanity.config.ts` and `lib/sanity.ts` client `S`
- [ ] **T14** Write schema: `listing.ts` `M`
- [ ] **T15** Write schema: `suburbStat.ts` (12 Wellington northern suburbs) `S`
- [ ] **T16** Write schema: `agentProfile.ts` (singleton) `S`
- [ ] **T17** Write schema: `testimonial.ts` (fallback if RateMyAgent blocked) `S`
- [ ] **T18** Configure `next/image` with `cdn.sanity.io` domain in `next.config.ts` `S`

### 0.5 Hosting
- [ ] **T19** Create Cloudflare Pages project, connect GitHub repo `S`
- [ ] **T20** Deploy blank Next.js app — verify build succeeds with `@cloudflare/next-on-pages` `M`
- [ ] **T21** If Cloudflare Pages build fails on any feature: switch to Vercel Pro immediately, do not debug adapter `S`

### 0.6 Resend setup
- [ ] **T22** Create Resend account, add domain `laynesaywellhughes.co.nz` `S`
- [ ] **T23** Add DNS records to domain registrar (SPF, DKIM x3, DMARC) — requires Layne's DNS access `M`
- [ ] **T24** Verify domain in Resend dashboard `S`

**Acceptance criteria:** Next.js builds and deploys, Sanity Studio opens, Tailwind brand colours applied to a test element, Resend domain verified.

---

## Phase 1 — Static Shell (Days 5–9)

### 1.1 Layout
- [ ] **T25** Build `Header` — logo, nav links (Listings, Reviews, Market, About, Contact), "Contact Layne" button `M`
- [ ] **T26** Build `Footer` — phone, email, RateMyAgent profile link, Harcourts credit `S`

### 1.2 Shared components
- [ ] **T27** Build `StarRating` — renders 1–5 stars from a number prop `S`
- [ ] **T28** Build `ContactForm` — react-hook-form + Zod, fields: name, email, phone, enquiry type (appraisal/viewing/general), message `M`
  - Client component
  - Submit to `/api/contact`
  - Show success/error state

### 1.3 Home page
- [ ] **T29** Build `HeroSection` — Layne photo (placeholder), fixed headline, primary CTA "Contact Layne" `M`
- [ ] **T30** Build home page `/` — Hero + ReviewSummaryBar placeholder + 3 listing teasers + MarketInsightsStrip teaser `M`

### 1.4 Listings
- [ ] **T31** Build `ListingCard` — address, status pill (colour-coded), price display, bed/bath/car icons `M`
- [ ] **T32** Build `ListingGrid` — conditional tabs (render only when bucket ≥1 listing), default tab is "Recently Sold" if For Sale empty, mock data `M`
- [ ] **T33** Build `ListingDetail` — image gallery (max 6 photos, `next/image`), property details, inspections list, "Contact about this property" form link, share/copy-link button `L`
- [ ] **T34** Build `listings/[slug]/not-found.tsx` — "This property is no longer available" with link back to listings `S`

### 1.5 Reviews
- [ ] **T35** Build `ReviewSummaryBar` — aggregate star score + review count, "RateMyAgent" label `S`
- [ ] **T36** Build `ReviewCard` — author, date, StarRating, body text `S`
- [ ] **T37** Build `ReviewFeed` — paginated (show 6, "Load more" button), mock data `M`
- [ ] **T38** Build `/reviews` page `S`

### 1.6 Market insights
- [ ] **T39** Build `MarketInsightsStrip` — suburb name, median price, days on market, sales volume, YoY %, "Updated: [date]" `M`
- [ ] **T40** Build `/market-insights` page — grid of all 12 suburbs `M`

### 1.7 Remaining pages
- [ ] **T41** Build `/about` — Layne photo, bio, credentials list, static northern suburbs map (SVG illustration or annotated image, NOT Leaflet) `M`
- [ ] **T42** Build `/contact` — ContactForm + Layne's direct phone/email `S`
- [ ] **T43** Build `/privacy` — static page, content placeholder ("Privacy policy to be provided by Layne") `S`

### 1.8 Design review
- [ ] **T44** Mobile responsive check at 375px and 1440px for all pages `M`
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
- [ ] **T56** Write `/api/revalidate/route.ts` — POST handler, verify `REVALIDATE_SECRET`, call `revalidatePath` for listings, market, home, about `S`
- [ ] **T57** Configure Sanity webhook → `[site]/api/revalidate` in Sanity project settings `S`
- [ ] **T58** Test: publish a listing change in Sanity → verify site updates within 10 seconds `S`

### 2.5 Contact form backend
- [ ] **T59** Write `/api/contact/route.ts` — POST, Zod validation, send structured email to Layne via Resend `M`
- [ ] **T60** Test form submission end-to-end — email arrives in Layne's inbox `S`

### 2.6 Content entry
- [ ] **T61** Enter all current listings into Sanity Studio `M`
- [ ] **T62** Enter 12 suburb stats from latest REINZ monthly report into Sanity Studio `M`
- [ ] **T63** Enter Layne's bio, credentials, photo into Sanity Studio (requires Layne's content) `S`

**Acceptance criteria:** All pages show real data. Form submission emails Layne. Sanity publish triggers site revalidation within 10 seconds.

---

## Phase 3 — SEO + Launch (Days 15–17)

### 3.1 SEO
- [ ] **T64** Add `metadata` export to every page (title, description, OG title, OG image) `M`
- [ ] **T65** Add `RealEstateAgent` JSON-LD to `/` (home page) `S`
- [ ] **T66** Add `Product` + `Offer` JSON-LD to `/listings/[slug]` `S`
- [ ] **T67** Write `app/sitemap.ts` — generates from Sanity listing slugs + static routes `S`
- [ ] **T68** Write `app/robots.ts` `S`

### 3.2 Performance
- [ ] **T69** Run Lighthouse audit — target Performance ≥90, SEO ≥95 `M`
- [ ] **T70** Fix any LCP, CLS, or INP issues `M`
- [ ] **T71** Verify all listing images use `next/image` with `alt` text `S`
- [ ] **T72** WCAG AA spot check — keyboard nav, colour contrast on brand colours `S`

### 3.3 Privacy + legal
- [ ] **T73** Replace privacy page placeholder with Layne-provided policy text `S` ← Layne's content

### 3.4 Launch
- [ ] **T74** Connect confirmed real domain in Cloudflare Pages (or Vercel) settings `S` ← domain TBC
- [ ] **T75** Update `NEXT_PUBLIC_SITE_URL` and `metadataBase` to real domain `S`
- [ ] **T76** Verify SSL certificate active `S`
- [ ] **T77** Submit sitemap to Google Search Console `S`
- [ ] **T78** Enable Cloudflare Web Analytics (free, zero config) `S`

**Acceptance criteria:** Lighthouse ≥90/95. All pages indexed. Email confirmed delivered. Site live at real domain.

---

## Ongoing (post-launch, developer-maintained)

- [ ] Update suburb stats in Sanity when REINZ publishes monthly report (quarterly update)
- [ ] Add new listings to Sanity when Layne has a new property
- [ ] Mark listings as Sold/Leased in Sanity when status changes
- [ ] Swap domain placeholder once real domain confirmed (`NEXT_PUBLIC_SITE_URL` + Cloudflare/Vercel custom domain)
