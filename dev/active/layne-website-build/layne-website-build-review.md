# Plan Review v2 — Layne Hughes Real Estate (Simplified Build)

Reviewer: Senior Technical Plan Reviewer
Date: 2026-04-29
Subject: 3-week, ~78-task simplified plan superseding the previous 8-week scope
Predecessor: `dev/active/real-estate-agent-website/real-estate-agent-website-review.md`

---

## Verdict

**Ship it.** This rewrite addresses every critical issue from the v1 review and lands the cuts cleanly. The scope (3 weeks, 6 routes, 3 external services) is right-sized for a sole-agent brochure site. The remaining issues below are small — none are show-stoppers, and most can be resolved during Phase 0 without re-planning. Approval to proceed once the items in "Remaining Issues" are acknowledged.

The previous review's main fixes all landed:

- RateMyAgent now gated behind a mandatory verification step in Phase 0 (T01–T04) with three documented strategies. The `SourceBadge` and multi-source `ReviewSummaryBar` are gone. ✓
- Google Sheets CRM removed; Resend-only lead delivery. ✓
- Cal.com, sticky mobile CTA, UptimeRobot, health-check dashboard, Leaflet/Nominatim all cut. ✓
- ISR strategy is coherent: `revalidate: false` + Sanity webhook for Sanity content; 6hr TTL only for the source that can't webhook. ✓
- AU references scrubbed; suburb list canonical and consistent across all three docs. ✓
- `clearanceRate` replaced with `salesVolume` + `yearOnYearChange` (REINZ-actual fields). ✓
- Cloudflare Pages chosen as primary host with Vercel Pro fallback documented; Vercel commercial-use issue acknowledged. ✓
- `not-found.tsx` for expired listing slugs added (T34). ✓
- Privacy policy explicitly marked as Layne-supplied content (T73, Risk table). ✓
- JSON-LD switched to `Product` + `Offer` for listings, `RealEstateAgent` for home. ✓
- Image cap (6 photos / 1280px webp via Sanity pipeline) acknowledged. ✓
- Resend DNS work surfaced as a real Phase 0 dependency requiring Layne's domain access. ✓

That's a full pass on the v1 critical issues list. The remaining concerns are second-order.

---

## Remaining Issues

### 1. Resend domain verification is blocked on a domain that doesn't exist yet
The plan and tasks both treat `laynesaywellhughes.co.nz` as a placeholder, while T22–T24 schedule Resend domain verification in Phase 0 against that same placeholder. If the real domain is still TBC at Phase 0 (likely, given it's listed as an Open Item), there are three failure modes:

- Verifying SPF/DKIM/DMARC against a placeholder domain Layne doesn't own = wasted setup
- Verifying against the placeholder if it *is* registered but later swapped = full DNS re-do at launch
- Skipping Phase 0 verification = Resend isn't testable end-to-end until Phase 3, which violates Phase 2 acceptance criteria ("Form submission emails Layne")

**Fix:** Add a hard gate at T22 — "Confirm real domain with Layne before opening Resend account; do not verify against placeholder." If the domain is genuinely TBC, use Resend's `onboarding@resend.dev` sender for Phase 1/2 dev testing and defer domain verification to Phase 3 (T74-adjacent). Add a corresponding task in Phase 3 for production DNS setup. This is the only timeline-affecting risk in the plan.

### 2. `SANITY_API_TOKEN` is described as both a read token and webhook auth — it shouldn't be either
Plan line 200 comments `SANITY_API_TOKEN` as "read token — for /api/revalidate webhook auth". Two issues:

- The Sanity webhook fires *outbound* to your `/api/revalidate` endpoint. The webhook signs its payload using the Sanity webhook secret (configured per-webhook in Sanity dashboard), not the API token. Authenticating the inbound webhook should use `REVALIDATE_SECRET` (already in env) verified against the `sanity-webhook-signature` header.
- A read token isn't needed at all if the dataset is public. If the dataset is private (likely correct for unpublished drafts/scheduled listings), then the token is needed for *fetching content*, not for webhook auth.

**Fix:** Update the env var comment to reflect actual purpose ("read token for fetching from private dataset") and confirm in T56 that webhook auth uses `REVALIDATE_SECRET` via `next-sanity`'s `parseBody` helper or manual HMAC verification of the `sanity-webhook-signature` header. Don't conflate the two secrets.

### 3. RateMyAgent client-side fallback has a CORS gap not addressed
The plan offers a useful three-tier fallback (server ISR / client useEffect / Sanity), but the middle tier (client `useEffect` fetch directly to `https://www.ratemyagent.co.nz/.../reviews.json`) will hit CORS preflight in the browser. The endpoint is designed for RateMyAgent's own embedded widget on third-party sites — which means it likely *does* set permissive CORS — but this needs to be verified in the same Phase 0 check, not assumed.

**Fix:** Extend the T01/T02 verification to include a third test from a browser DevTools console on a different origin (e.g. paste `fetch('https://...reviews.json').then(r=>r.json())` into the console on `example.com`). If CORS blocks it, the client-side fallback is also dead and the only remaining path is Sanity testimonials. The decision matrix in context.md (lines 108–112) should grow a row for this case.

### 4. On-demand revalidation paths missing from the webhook handler
T56 says "call `revalidatePath` for listings, market, home, about" — but the `[slug]` listing detail pages aren't a single static path. When a listing is edited in Sanity, you need to revalidate `/listings`, `/listings/[that-specific-slug]`, AND `/` (home shows 3 teasers). Better: use `revalidateTag` with tags scoped per content type, set during `fetch()` calls in `lib/listings.ts` etc.

**Fix:** Use `revalidateTag('listings')`, `revalidateTag('market')`, `revalidateTag('bio')` and set matching `next: { tags: [...] }` on the GROQ fetches. The webhook payload from Sanity includes `_type`, so the route can revalidate only the affected tag. Acceptance criterion in T58 ("publish a listing change → site updates within 10 seconds") needs to verify the *detail page* updates, not just the index.

### 5. `next/image` + Sanity CDN needs an explicit loader, not just `images.domains`
T18 says "Configure `next/image` with `cdn.sanity.io` domain". That's the bare minimum and won't get you Sanity's image transformations (the whole point of using their CDN). Without a custom `loader`, `next/image` will request the original image and resize it itself — costing Sanity bandwidth on every variant and wasting Next.js's optimization budget.

**Fix:** Use `@sanity/image-url`'s `urlFor` builder inside a custom `next/image` loader that maps `width` and `quality` props to Sanity's `?w=&q=&fm=webp` URL params. This is a 15-line file but it's load-bearing for the "10GB Sanity bandwidth cap" risk in the risk table. Worth promoting from "implicit in T18" to its own subtask.

---

## Minor Concerns

### A. T05 (`create-next-app` over Vite scaffold) may not be clean
`create-next-app` won't overwrite an existing `package.json` cleanly if there are conflicting deps (React 19 is fine, but Vite-specific entries linger). The actual procedure is usually: blow away `package.json`, `package-lock.json`, `node_modules`, `index.html`, `vite.config.ts`, `tsconfig.json`, `src/` first, *then* run `create-next-app`. T06 lists deletions but they happen *after* T05. Reorder: delete Vite artifacts first, then scaffold.

### B. Phase 2 timeline (3–4 days) is tight if RateMyAgent verification produces "blocked" outcome
If T01–T04 lands on "blocked", you avoid `lib/reviews.ts` work but still need to populate Sanity testimonials before Phase 2 ships. The plan assumes Layne provides testimonial copy — but that's not in the Required Resources table. If she doesn't have written testimonials handy, you're either stalled or shipping with an empty reviews section.

**Fix:** Add "Layne to provide 3–5 testimonials (text + author name) if RateMyAgent is blocked" to the Open Items list and Required Resources table. Surface this dependency at T04, not at T54.

### C. Harcourts gold hex is "approx `#C9A84C` — verify"
Harcourts' brand guidelines are not public. Inspecting `harcourts.co.nz` CSS (T09) gets you their *website* gold, which may differ from the brand-book Pantone. Realistically this doesn't matter for an unofficial personal site, but if Layne ever shares the page with her franchise principal, off-brand colour is the kind of thing that gets nitpicked.

**Fix:** Either ask Layne for her franchise's brand sheet, or accept "website-derived hex" as good-enough and document the decision.

### D. Mobile-first breakpoint check at 375px / 1440px misses iPad
T44 checks 375px (iPhone) and 1440px (laptop). Real estate browsing on iPad is common (vendors, older buyers). Add a 768px breakpoint check.

### E. Lighthouse target ≥90 Performance is achievable but ≥95 SEO is contingent on JSON-LD validating
The plan promises Lighthouse SEO ≥95 and adds JSON-LD in Phase 3. Lighthouse doesn't actually score JSON-LD validity (Google's Rich Results Test does). To actually hit 95+ SEO in Lighthouse, the metadata exports, sitemap, robots, alt text, and link contrast all matter more than the schema. Worth sanity-checking against the Lighthouse SEO audit list and adding "all images have alt" / "all links have discernible text" as explicit checks in T71-adjacent tasks.

### F. Sitemap regeneration on listing publish
`app/sitemap.ts` is dynamic (good) but if it's wrapped in default fetch caching, the sitemap won't reflect a new listing until next build. Tag the GROQ fetch inside `sitemap.ts` with the same `listings` tag used in #4 above so the webhook also revalidates the sitemap.

### G. No fallback for Sanity outage
The risk table covers RateMyAgent being blocked but assumes Sanity is always up. Sanity has had outages (rare, but real). Listings, market, and bio are all `revalidate: false` — meaning if Sanity is down at build/revalidate time the *previous* cache should serve, which is correct behaviour. Worth one sentence in the risk table making this explicit so it isn't surprising.

---

## What This Plan Gets Right

- **Verification-first for RateMyAgent** is the single biggest improvement over v1. Phase 0 now blocks on actually running curl. The decision matrix (server / client / Sanity) is clear and each branch produces working code without architectural rework. This is exactly the right shape for an external dependency you don't control.
- **On-demand revalidation as the default** for everything Sanity-backed, with TTL only where webhooks aren't available. This is the right default for manually-curated content and avoids the v1 incoherence around hourly TTL.
- **Cloudflare Pages with documented Vercel fallback** kills the v1 "free hobby tier for commercial use" trap. The "do not fight the adapter" guidance in line 50 is the kind of senior-eng pragmatism that prevents two-week debugging sessions.
- **Conditional listing tabs with "Recently Sold" as the empty-state default** turns a UX failure mode into a credibility builder. Cheap, correct, easy to forget.
- **`SuburbStat` shape matches what REINZ actually publishes** (median price, days on market, sales volume, YoY %). No more `clearanceRate: null` placeholders.
- **`updatedAt` exposed on `SuburbStat`** so users see staleness — small but mature touch.
- **Component file structure mirrors the routes** with no premature abstraction. No `lib/data-source-registry.ts`, no `SourceAdapter` interface, no health-check dashboard. Two functions, two sources, done.
- **Resend DNS work surfaced as a real Phase 0 dependency** with Layne's domain access flagged in the Required Resources table. (Modulo issue #1 above re: which domain.)
- **Privacy policy as Layne-supplied content**, with NZ OPC template referenced. No more "developer writes legal copy" trap.
- **Required Resources table is honest about what's blocked on Layne** (photos, bio, credentials, DNS, privacy text, real domain). These are the actual project-management risks; surfacing them in the plan is correct.
- **Timeline is realistic.** 3 weeks for a 6-route brochure site with Sanity + Resend is the right ballpark. Phase 0 (3–4 days) is generous and accommodates the RateMyAgent verification branch points.
- **Schema.org `Product` + `Offer`** for listings instead of the non-existent `RealEstateListing`. This will actually produce rich results in Google.
- **`@cloudflare/next-on-pages` decision point is end-of-Phase-0**, not mid-Phase-2. If it fails, the switch to Vercel Pro is a same-day pivot, not a re-plan.
- **No sticky mobile bar, no Cal.com iframe, no UptimeRobot.** The aggressive simplification holds.

---

## Bottom Line

The v1 review's critical list is fully addressed. The five "Remaining Issues" above are tactical — fix them in Phase 0 setup notes and proceed. None require re-architecting.

If I had to pick the single most important item to action before T01: **decide what to do about the placeholder domain (#1)**. Resend domain verification is the only thing in this plan with a hard external dependency that can stall Phase 2 acceptance, and it's the only item where "we'll figure it out at launch" creates real rework.

Approved to build pending issue #1 resolution.

---

## Relevant Files

- `/Users/stuartjames/Documents/Programming/React/layne-website/dev/active/layne-website-build/layne-website-build-plan.md`
- `/Users/stuartjames/Documents/Programming/React/layne-website/dev/active/layne-website-build/layne-website-build-context.md`
- `/Users/stuartjames/Documents/Programming/React/layne-website/dev/active/layne-website-build/layne-website-build-tasks.md`
- `/Users/stuartjames/Documents/Programming/React/layne-website/dev/active/real-estate-agent-website/real-estate-agent-website-review.md` (predecessor review)
