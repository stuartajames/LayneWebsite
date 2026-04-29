# Plan Review — Real Estate Agent Website

Reviewer: Senior Technical Plan Reviewer
Date: 2026-04-29
Subject: 8-week, ~80-task plan for a single Wellington real estate agent's personal website
Verdict: **Massively over-scoped.** This is roughly 3-4x the work this site actually requires. The plan reads like a pitch for a small SaaS, not a one-page-with-a-listings-feed brochure site for a sole operator. Cut hard before any code is written.

---

## Critical Issues (must fix before building)

### 1. The RateMyAgent "widget JSON endpoint" is the load-bearing assumption — and nobody verified it works
ADR-008 commits the entire reviews feature to `https://www.ratemyagent.co.nz/real-estate-agent/layne-hughes-at845/reviews.json`, described as "undocumented", "what their own embed uses", and "stable enough." Three problems:

- **Nobody fetched it.** The plan asserts the endpoint exists and returns a usable JSON shape with `reviews[]` and `aggregate`. There is no evidence in the context that this was confirmed with a single curl. Phase 2 will hit a 403 / Cloudflare / HTML-instead-of-JSON wall and the team will be re-planning mid-sprint.
- **Server-side fetching of an undocumented widget endpoint from Vercel IPs is exactly the traffic pattern that gets blocked.** Widgets are designed to run from a browser carrying a `Referer`. Server-side fetches from a known cloud netblock with no `Referer` are the easiest thing on earth to block, and they will block it the moment you generate measurable traffic.
- **CORS / authentication / signing.** Even if it works today, "no key, no auth" widget endpoints are routinely retrofitted with HMAC signing or JS-side token derivation. The fallback ("manually curated testimonials in Sanity") is fine — but if that's the realistic steady state, why is there a `lib/reviews/ratemyagent.ts` module, ISR strategy, source badges, and a multi-source `ReviewSummaryBar` at all?

**Fix before any work:** Run `curl -i -A "Mozilla/5.0" https://www.ratemyagent.co.nz/real-estate-agent/layne-hughes-at845/reviews.json` from a residential IP and from a Vercel function. If it doesn't return clean JSON in both, kill the integration outright and ship Sanity testimonials only. Delete `SourceBadge`, the multi-source language, and `lib/reviews/ratemyagent.ts`. Save ~3 days.

### 2. Google Sheets as a "CRM" is solving a problem that doesn't exist
The plan adds a Google Cloud project, a service account, a base64-encoded JSON key, env-var management, and a Sheets API v4 integration *just to log contact form submissions*. For a sole agent who will receive maybe 10–30 leads a month.

The Resend notification email is already going to her inbox. That **is** the CRM. Adding Sheets:
- Doubles the failure surface of the contact form (now two external calls).
- Requires service-account key rotation hygiene she will never do.
- Introduces a Google Cloud dependency that the plan claims is "free, no billing needed" — which is only true until somebody enables the wrong API or the project gets flagged for service-account abuse and quietly suspended.
- Creates a privacy obligation (NZ Privacy Act 2020 — leads stored in a third-party system she controls) that the plan acknowledges but doesn't actually solve (no deletion endpoint, no retention policy, no "delete on request" mechanism).

**Fix:** Delete the Sheets integration. Send the lead via Resend to Layne with a structured plain-text body. If she wants a record, she can star the email. If she wants an actual CRM later, she should buy HubSpot Free or a NZD$30/mo tool — not duct-tape one out of Google APIs. Delete env vars `GOOGLE_SHEETS_SPREADSHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_SERVICE_ACCOUNT_KEY`, task P0-D, and tasks P3-1, P3-2. Save ~1 day.

### 3. Context file has a stale "Australian" framing that contradicts the plan
The context file (lines 7–11) still says "Target market: Australian real estate (AU privacy laws, AU data providers)" while every other document — and ADR-013 in the same file — confirms NZ. ADR-001 references NZ, but Sam (Devil's Advocate) sections in the plan still talk about Australian Privacy Act, Domain API, CoreLogic, Rex/VaultRE/Agentbox. This is going to cause real confusion when someone reads the plan in 3 weeks. **Fix:** scrub all AU references; rewrite Sam's "Challenge 1" section so it reflects the NZ + Sanity-only decision, not the original AU API hypothesis.

### 4. Tasks file P0-4 contradicts the confirmed suburb list
P0-4 lists "Johnsonville, Churton Park, Tawa, Newlands, Paparangi, Woodridge, Grenada North — confirm full list" but the confirmed list (P0-B, plan, context) has 12 different suburbs and includes neither Paparangi nor Woodridge. This is a copy-paste leftover that will get implemented if not caught. **Fix:** delete the parenthetical in P0-4 entirely; the canonical list lives in P0-B.

### 5. ISR revalidation strategy is incoherent for a manually-edited site
The plan specifies ISR 60 minutes for listings, then in the same document says the developer manages listings in Sanity with on-demand revalidation via webhook. Pick one. If on-demand revalidation works, ISR TTL should be 1 day or `force-cache` — there is no reason to revalidate hourly when the data only changes when the developer hits "publish." The 60-minute TTL is a hangover from the original "live REAXML feed" design that was abandoned. **Fix:** set listings, market, and bio to `revalidate: false` and rely entirely on the Sanity webhook hitting `/api/revalidate`. This also fixes Sam's Challenge 2 ("Data must feel live") because data updates within seconds of publish, not 60 minutes.

---

## UX Concerns (will hurt real users)

### 6. The hero promises localised proof Layne probably can't deliver
"`[X] years selling [suburb]`" assumes a single suburb claim. Layne covers 12 suburbs across northern Wellington. A vendor in Khandallah doesn't care that Layne sold 3 houses in Tawa. The hero needs to either (a) say "northern Wellington" generically or (b) be dynamically suburb-aware via referrer/UTM/page context, which is more engineering than a hero deserves. **Fix:** drop the bracketed templating; write one good headline.

### 7. The "filter by For Sale / Sold / Leased" tabs assume she has stock in each
Sole agents routinely have 0–3 active listings and 0 active rentals. An empty "Leased" tab on a personal site looks like the agent is junior. **Fix:** render tabs only when each bucket has ≥ 1 listing, and default the page to show "Recently sold" if "For Sale" is empty (sold listings build trust; empty grids destroy it).

### 8. `MarketInsightsStrip` shows `clearanceRate` but NZ doesn't really do auctions like AU
`clearanceRate` is an Australian auction concept. NZ has auctions but the suburb-level clearance rate isn't a number REINZ publishes for Wellington northern suburbs in any reliable way. The interface keeps the field as `number | null` which means it will be `null` forever. **Fix:** drop `clearanceRate` from the `SuburbStat` interface; replace with something REINZ actually publishes (e.g. `salesVolume` or `yearOnYearChange`).

### 9. Map / Leaflet is in the backlog but `/about` says "area map"
P1-10 says the About page contains an "area map" but Leaflet is in the post-launch backlog. Either build the map in v1 or drop the wording. A sole agent's About page genuinely doesn't need an interactive map — a static SVG or an annotated screenshot of the 12 suburbs is fine and ships in 30 minutes. **Fix:** replace with a static suburb illustration; remove Leaflet and Nominatim from the plan entirely (they're listed as confirmed dependencies even though they're backlog). This also kills the Nominatim 1-req/s rate-limit complexity.

### 10. The sticky mobile CTA bar duplicates the contact form
"Call Layne" + "Book Appraisal" sticky on mobile sounds great in a planning doc but in practice it overlaps content, fights iOS Safari's bottom UI, and is the #1 thing real users find annoying. For a sole agent with a clear contact page, a regular header CTA is enough. **Fix:** drop the sticky bar. Keep one prominent "Contact" link in the header.

### 11. Cal.com adds a third-party iframe and tracking domain on the contact page
Embedded Cal.com loads scripts from `cal.com`, sets cookies, and slows the contact page (the page where conversion matters most). It also requires Layne to maintain a Cal.com account she didn't ask for. The plan already has a contact form. **Fix:** drop Cal.com. The contact form captures intent; Layne replies with her own calendar link in the email.

### 12. No 404 / no listing-not-found design
Listings come and go. When a sold listing's slug stops existing in Sanity, a Google-cached deep link will 404. Plan has no `not-found.tsx` for the listings route. **Fix:** add a friendly "This property is no longer available — see current listings" page. Tiny task, big UX delta.

### 13. No print or copy-link affordance on listings
Vendors print property pages. Buyers copy URLs into texts. Neither is mentioned. Trivial to add, and easy to forget if it's not in the task list. **Fix:** add a "Share / copy link" button on `ListingDetail`.

### 14. Privacy policy is a P3 task with no template/source
"Add privacy policy page" in P3-5 is a one-bullet task. A real NZ Privacy Act 2020 compliant policy is a legal document, not a 30-minute placeholder. The plan needs to either (a) commit to using a template service (e.g. Termageddon, or a free Office of the Privacy Commissioner template) or (b) explicitly mark it as "Layne to provide" content. Otherwise the developer ends up writing legal copy. **Fix:** make P3-5 explicit: "Layne provides privacy policy text; developer renders it."

---

## Cost / Complexity Risks (looks free, isn't)

### 15. Vercel free tier has a commercial-use restriction
Vercel's Hobby tier is **for non-commercial use only**. A real estate agent's lead-generating personal site is commercial use. Vercel actively enforces this — they email projects detected as commercial and require an upgrade to Pro (USD$20/mo per member). The plan claims "Free hobby tier" as a confirmed cost. **Fix:** budget USD$20/month for Vercel Pro from launch, OR host on Cloudflare Pages (free, no commercial restriction) and adapt the deploy. This is a real recurring cost the plan currently hides.

### 16. Sanity free tier has hard caps that listings can hit
Sanity's free tier: 10GB bandwidth/month, 100k API CDN requests/month, 5GB asset storage, **3 users**. Property listings with 10 photos at 2MB each = 20MB per listing. 30 listings = 600MB stored, fine. But:
- Image bandwidth on a public site adds up fast. A few hundred unique visitors browsing image galleries can blow past 10GB in a busy month.
- Sanity counts dataset reads against the API quota; combined with ISR misses on Vercel cold starts, you can hit 100k requests faster than expected.
- The plan also uses Sanity's CDN (`cdn.sanity.io`) for image delivery which doesn't go through `next/image`'s optimisation by default unless configured.

**Fix:** (a) configure `next/image` with the Sanity loader properly, (b) cap listing photos at 6 images at 1280px webp, (c) acknowledge that paid tier (USD$15/mo Growth) may be required by month 6.

### 17. Resend free tier: 100 emails/day is fine, but transactional email deliverability is not free in practice
The plan sends a notification to Layne AND a confirmation to the lead via Resend. From an unverified domain or `onboarding@resend.dev` you'll hit gmail's spam folder. Real deliverability requires:
- Domain verification on Resend (DNS TXT/MX/SPF/DKIM records — Layne controls her domain registrar, not the developer)
- DMARC alignment
- A reply-to address that goes somewhere

This is half a day of DNS work and coordination that the plan estimates as `S` (a few hours). **Fix:** budget a full day for email setup and explicitly list "Layne provides DNS access for `laynesaywellhughes.co.nz`" as a Phase 0 dependency.

### 18. Cal.com free tier was changed in 2024
Cal.com's "free forever" individual tier still exists but the embed branding ("Powered by Cal.com") on free tier is now non-removable. For a Harcourts-aligned brand experience, that's a visible third-party badge on the contact page. **Fix:** see #11 — drop Cal.com.

### 19. UptimeRobot free is rate-limited and emails only
UptimeRobot's free tier sends alerts via email. Layne already gets emails. If `/api/contact` goes down she gets the alert in the same inbox as the leads — i.e. she won't notice. This is theatre, not monitoring. **Fix:** drop UptimeRobot from v1. Vercel itself emails on deployment failures; that's enough for a personal site. Add real monitoring only if traffic actually warrants it.

### 20. Vercel Analytics free is 2,500 events/month — for a marketing site, that's tight
Each pageview is an event. 2,500 events = ~80 pageviews/day average. A successful local-SEO real estate site for a Wellington agent will exceed this within 2–3 months and start dropping data silently. **Fix:** use Plausible self-hosted or Cloudflare Web Analytics (genuinely free, unlimited). Or accept that paid Vercel Analytics ($10/mo) is on the roadmap.

### 21. 8 weeks for a brochure site is 3-4x what's required
The plan's timeline:
- Phase 0: 1 week (migration + Sanity setup + Vercel deploy)
- Phase 1: 1.5 weeks (8 components, all mock data)
- Phase 2: 3 weeks (data integration — for what? One Sanity GROQ query and one widget endpoint?)
- Phase 3: 1 week (one form)
- Phase 4: 1 week (metadata + sitemap)
- Phase 5: 0.5 weeks (deploy + monitors)

A competent Next.js dev should have this site live in **2–3 weeks**, total. Phase 2 alone is overestimated by ~10x: there are two real data sources (Sanity GROQ, RateMyAgent JSON) and the plan budgets 3 weeks. The lib/ "abstraction layer" (Sam's mitigations, fallback states, health-check dashboard, source registry) is overhead that solves problems this site doesn't have.

**Fix:** rescope to 3 weeks: 1 week scaffold + design, 1 week pages + Sanity, 1 week form + SEO + launch. Drop the "data abstraction layer" framing — it's two functions that fetch from two sources.

### 22. Health-check dashboard is yak-shaving
Sam's Challenge 5 mitigation: "Build a simple health-check dashboard (admin-only route) that shows the last successful fetch timestamp for each data source." For two data sources. Where one is Sanity (which doesn't fail) and the other is the RateMyAgent endpoint (which has a Sanity fallback). This is engineering for a problem that doesn't exist on a sole-agent site. **Fix:** delete. If RateMyAgent breaks, the site silently falls back to Sanity testimonials. That's the design.

### 23. JSON-LD for `RealEstateListing` is a real spec but most agents don't have the data fields populated
P4-2 schedules JSON-LD for `RealEstateListing`. Schema.org doesn't actually have `RealEstateListing` — it has `Residence`, `Accommodation`, `SingleFamilyResidence`, etc. There is a `RealEstateListing` type proposed but support in Google's rich results is patchy. **Fix:** use `Product` + `Offer` schema for listings (this is what most NZ portals do), and `RealEstateAgent` for the home page. Don't promise rich results that may not appear.

---

## Suggested Simplifications

Concrete edit list, in priority order:

| # | Change | File | Saves |
|---|---|---|---|
| 1 | Delete RateMyAgent integration; ship Sanity testimonials only as v1 | plan ADR-008, P2-9, types `Review.source` | 3 days |
| 2 | Delete Google Sheets CRM; lead notification via Resend only | plan, context env vars, P0-D, P3-1, P3-2 | 1 day |
| 3 | Delete Cal.com embed | plan, context ADR-009, P1 backlog item | 0.5 day |
| 4 | Delete UptimeRobot setup | plan, P5-3 | 0.25 day |
| 5 | Delete sticky mobile CTA bar | plan, P1-13 | 0.25 day |
| 6 | Delete Leaflet/Nominatim entirely from v1 plan; static SVG for `/about` | plan, ADR-006, env vars | 1 day |
| 7 | Delete health-check dashboard concept | plan Sam Challenge 5 | 0.5 day |
| 8 | Switch ISR to on-demand-only via Sanity webhook (no TTL) | plan ISR table, route configs | clarity |
| 9 | Rescope timeline from 8 weeks to 3 weeks | timeline table | 5 weeks |
| 10 | Switch hosting from Vercel Hobby to Cloudflare Pages, OR budget $20/mo Vercel Pro | plan resources table | $20/mo or platform-switch effort |
| 11 | Switch analytics to Cloudflare Web Analytics | plan, P5-2 | freedom from event cap |
| 12 | Drop `clearanceRate` from `SuburbStat` | plan typed interfaces, P2-3 | data-modelling cleanup |
| 13 | Scrub AU references from context.md | context.md project identity, ADR-001 | clarity |
| 14 | Fix P0-4 stale suburb list | tasks.md | correctness |
| 15 | Add `not-found.tsx` for listings | tasks.md (new task in P1) | 0.25 day to add — saves real lost leads |
| 16 | Make privacy policy explicitly "content from Layne" | tasks.md P3-5 | scope clarity |
| 17 | Reduce listing image cap to 6 photos / 1280px webp | plan/Sanity schema | bandwidth |
| 18 | Switch JSON-LD to `Product`+`Offer` for listings, `RealEstateAgent` for home | tasks.md P4-2, P4-3 | actually-indexed structured data |

**Net effect:** 8 weeks → 3 weeks, USD$0–20/month → USD$0/month, third-party dependencies cut from 9 to 3 (Next.js, Sanity, Resend), and the site actually ships before the listings get stale.

---

## What the Plan Gets Right

Credit where due:

- **Sanity-as-source-of-truth (ADR-010, ADR-011)** is the correct call for a sole agent. No agency API integration is the right answer — the trade-off (developer enters listings) is honest and correct.
- **Killing the AU integrations early** (REAXML, Domain, CoreLogic) before writing code saved this project from the most expensive mistake on the table. The Devil's Advocate exercise worked.
- **Privacy Act compliance is recognised** — even if the implementation isn't fully thought through, the awareness is there.
- **Tailwind v4 + Next.js 15 App Router + RSC** is a sensible, modern, and appropriately boring stack. No unnecessary tech-radar choices.
- **The page architecture (6 routes)** is the right size — not bloated with /blog, /tools, /calculators, /neighbourhood-guides etc.
- **The "fallback-first" mindset** in the data layer is correct in spirit, even if the implementation is over-engineered.
- **NZ market localisation** (Wellington suburbs, REINZ data, NZ Privacy Act) is accurately scoped.
- **Image optimisation, accessibility, and Lighthouse targets** are explicit and reasonable.
- **The Harcourts brand alignment without claiming to be official** is the legally-correct framing.

---

## Bottom Line

This plan was written as if the site needs to scale and integrate with the Australian PropTech ecosystem. It doesn't. It's a marketing site for one person. Every "free" service added is another account to maintain, another env var to rotate, another integration to debug at midnight when a lead doesn't come through.

Cut to: Next.js 15 on Cloudflare Pages, Sanity for content (including testimonials), Resend for the contact form, done. Three weeks, zero recurring cost (other than the domain), one external API in the entire codebase, and Layne can read every lead in her inbox.

Build the simple version. If it actually grows, the upgrade paths (RateMyAgent integration, Cal.com embed, real CRM, paid analytics) are all additive.
