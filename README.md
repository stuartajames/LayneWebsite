# Layne Hughes — Real Estate Website

Personal brand website for Layne Hughes, Licensed Real Estate Consultant with Harcourts Wellington City. Specialises in Wellington's northern suburbs (Khandallah, Ngaio, Johnsonville, Tawa and surrounding area).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, React Server Components) |
| Styling | Tailwind CSS v4 (CSS-based config, no `tailwind.config.js`) |
| Language | TypeScript |
| CMS | Sanity.io (free tier) |
| Reviews | RateMyAgent Official API (OAuth2) |
| Email | Resend (free tier) |
| Hosting | Cloudflare Pages (primary) / Vercel Pro (fallback) |
| Forms | react-hook-form + Zod v4 |

---

## Running Locally

### Prerequisites

You need **Node.js** installed on your computer. To check if you have it:

1. Open **Terminal** (Mac: press `Cmd + Space`, type "Terminal", press Enter)
2. Type the following and press Enter:
   ```bash
   node --version
   ```
3. If you see a version number like `v20.x.x` you're good. If you get "command not found", download and install Node.js from [nodejs.org](https://nodejs.org) (click the "LTS" button), then restart Terminal and try again.

---

### Step 1 — Open the project folder in Terminal

```bash
cd /path/to/layne-website
```

Replace `/path/to/layne-website` with the actual folder location. The easiest way: open Finder, find the `layne-website` folder, then drag it onto the Terminal window after typing `cd ` (with a space).

---

### Step 2 — Install dependencies

This only needs to be done once (or after pulling new changes):

```bash
npm install
```

You'll see a lot of text scroll past — that's normal. Wait for it to finish.

---

### Step 3 — Set up environment variables

The site needs a configuration file to know which services to connect to.

1. Check if a file called `.env.local` already exists in the project folder
2. If it doesn't exist, create one by copying the example:
   ```bash
   cp .env.local.example .env.local
   ```
3. Open `.env.local` in a text editor and fill in the values you have. **The site will still run without most of these** — it uses built-in mock data for reviews and listings until the real services are connected.

> The minimum needed to run locally with no errors: you can leave everything blank for now. The site will show mock data for reviews and listings, and the contact form will fail silently (no email will be sent).

---

### Step 4 — Start the development server

```bash
npm run dev
```

Wait a few seconds until you see:

```
▲ Next.js 16.x.x
- Local: http://localhost:3000
✓ Ready
```

---

### Step 5 — Open the site

Open your browser and go to:

**[http://localhost:3000](http://localhost:3000)**

That's it. The site is running locally. Any changes you make to the code will automatically refresh the browser.

---

### Stopping the server

Go back to Terminal and press `Ctrl + C`.

---

### Useful local URLs

| URL | What it is |
|---|---|
| http://localhost:3000 | The website |
| http://localhost:3000/studio | Sanity CMS editor (requires `NEXT_PUBLIC_SANITY_PROJECT_ID`) |
| http://localhost:3000/listings | Listings page |
| http://localhost:3000/reviews | Reviews page |

---

### Common problems

**"npm: command not found"** — Node.js is not installed. See Prerequisites above.

**"Cannot find module" or similar errors after `npm run dev`** — Run `npm install` first, then try again.

**Port 3000 already in use** — Something else is running on that port. Next.js will automatically try port 3001, 3002, etc. and tell you which one it picked.

**Changes not showing up** — Make sure you saved the file. The browser refreshes automatically but only for saved files.

**Contact form says "something went wrong"** — `RESEND_API_KEY` is not set in `.env.local`. This is expected in local development until Resend is configured.

---

## Environment Variables

Copy `.env.local` and fill in the values. See `dev/layne-website-build-phase0.md` for setup instructions for each service.

```bash
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=     # from sanity.io dashboard
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=                  # Viewer token from Sanity API settings

# RateMyAgent Official API (apply at developers.ratemyagent.co.nz)
RATEMYAGENT_CLIENT_ID=
RATEMYAGENT_CLIENT_SECRET=
RATEMYAGENT_TOKEN_URL=             # OAuth2 token endpoint — confirm on credential delivery
LAYNE_AGENT_CODE=layne-hughes-at845

# Email (Resend)
RESEND_API_KEY=                    # from resend.com
LAYNE_EMAIL=                       # Layne's email address for contact form delivery

# Site
NEXT_PUBLIC_SITE_URL=https://laynesaywellhughes.co.nz   # placeholder — swap for real domain
REVALIDATE_SECRET=                 # generate: openssl rand -hex 32
```

Without `RATEMYAGENT_CLIENT_ID`, the site uses real mock data from Layne's RateMyAgent profile (12 reviews, 4.9★ aggregate). Without `NEXT_PUBLIC_SANITY_PROJECT_ID`, Sanity fetches fail silently and the site still renders.

---

## Routes

| Route | Type | Description |
|---|---|---|
| `/` | Static (6hr ISR) | Home — hero, review bar, listing teasers, market strip |
| `/listings` | Static | All listings grid with For Sale / Recently Sold tabs |
| `/listings/[slug]` | SSG | Individual listing detail with open homes and contact CTA |
| `/reviews` | Static (6hr ISR) | Paginated RateMyAgent reviews with aggregate bar |
| `/market-insights` | Static | Suburb stats grid — all 12 Wellington northern suburbs |
| `/about` | Static | Bio, credentials, SVG northern suburbs map |
| `/contact` | Dynamic | Contact form — pre-fills subject from `?subject=` query param |
| `/privacy` | Static | Privacy policy placeholder |
| `/studio` | Dynamic | Sanity Studio (CMS editor) |
| `/api/contact` | Dynamic | POST — validates and sends contact form via Resend |
| `/api/reviews` | Dynamic | GET — paginated RateMyAgent reviews for "Load more" |
| `/api/revalidate` | Dynamic | POST — Sanity webhook handler for on-demand ISR |

---

## File Structure

```
app/
  layout.tsx                  Root layout — Header, Footer, brand bg
  page.tsx                    Home page
  globals.css                 Tailwind v4 brand tokens
  about/page.tsx
  contact/page.tsx            Reads ?subject= query param
  listings/
    page.tsx
    [slug]/
      page.tsx
      not-found.tsx
  market-insights/page.tsx
  reviews/page.tsx
  privacy/page.tsx
  api/
    contact/route.ts          Resend email handler
    reviews/route.ts          RateMyAgent paginated reviews
    revalidate/route.ts       Sanity on-demand ISR (Phase 2)

components/
  layout/
    Header.tsx                Sticky, mobile hamburger, active link highlight
    Footer.tsx                Phone, email, social links, Harcourts credit
  listings/
    ListingCard.tsx           Status pill, price, bed/bath/car
    ListingGrid.tsx           Tabbed For Sale / Recently Sold
    CopyLinkButton.tsx        Client — copies current URL to clipboard
  market/
    SuburbStatCard.tsx        Full stats card for /market-insights grid
    MarketInsightsStrip.tsx   Horizontally scrollable teaser for home page
  reviews/
    ReviewCard.tsx            Author, date, stars, body, Recommended badge
    ReviewFeed.tsx            Client — Load more pagination
    ReviewSummaryBar.tsx      Aggregate stars + count + RateMyAgent link
  shared/
    StarRating.tsx            SVG stars with partial fill (fractional ratings)
    ContactForm.tsx           Client — react-hook-form + Zod v4

lib/
  sanity.ts                   Sanity client (falls back to 'unconfigured' if no project ID)
  sanityImageLoader.ts        Custom next/image loader → Sanity CDN (webp, sized)
  reviews.ts                  getReviewAggregate() / getReviews() — RMA API or mock
  rmaToken.ts                 OAuth2 client credentials token cache (module-level, 60s buffer)
  mockReviews.ts              12 real reviews from Layne's RMA profile — used until API live
  mockData.ts                 3 mock listings + 12 suburb stats — replaced by Sanity in Phase 2

sanity/schemas/
  listing.ts                  Property listings (12 suburbs, max 6 images, status radio)
  suburbStat.ts               REINZ suburb stats (quarterly)
  agentProfile.ts             Singleton — bio, photo, credentials, phone, email
  testimonial.ts              Reviews fallback (shown if RMA API unavailable)
  index.ts

types/index.ts                Listing, Review, ReviewAggregate, SuburbStat, AgentProfile
```

---

## Data Sources

### Listings and CMS content
Managed in Sanity Studio (`/studio`). On publish, Sanity fires a webhook to `/api/revalidate` which calls `revalidateTag` to instantly refresh affected pages. Implemented in Phase 2.

### RateMyAgent Reviews
Live reviews fetched server-side via OAuth2 API (`lib/reviews.ts`) with 6-hour ISR. The `RATEMYAGENT_CLIENT_ID` env var acts as the feature flag — absent means mock data, present means live API. Agent code: `layne-hughes-at845`.

The fallback chain is:
1. RateMyAgent API (primary — live reviews)
2. Sanity `testimonial` documents (if API credentials absent or API unavailable)
3. Empty state (if both fail)

### Market insights
Suburb statistics entered manually into Sanity from the REINZ monthly report. Updated quarterly by the developer.

### Contact form
Submitted to `/api/contact` → validated with Zod → sent via Resend to Layne's email. During development uses `onboarding@resend.dev` as the sender. Domain-verified sending address configured in Phase 3.

---

## Caching Strategy

| Content | Strategy | Trigger |
|---|---|---|
| Listings, bio, market stats | `revalidate: false` + on-demand | Sanity webhook → `revalidateTag` |
| RateMyAgent reviews | 6hr ISR | Time-based only (no webhook available) |
| Home page | 6hr ISR | Inherits from reviews fetch |
| `/api/reviews` (Load more) | `force-dynamic` | Always fresh |
| `/api/contact` | `force-dynamic` | Always fresh |

---

## Brand

- **Primary gold:** `#c9a84c` (`brand-gold`) — approximate Harcourts gold; verify from harcourts.co.nz before launch
- **Gold hover:** `#a8873a` (`brand-gold-dark`)
- **Charcoal:** `#1a1a1a` (`brand-dark`)
- **Background:** `#f9f7f4` (`brand-bg`) — warm off-white

Tokens are defined in `app/globals.css` under `@theme inline` and available as `text-brand-gold`, `bg-brand-dark`, etc.

---

## Development Plan

Full task tracking is in `dev/active/layne-website-build/layne-website-build-tasks.md`.

| Phase | Status | Notes |
|---|---|---|
| Phase 0 — Setup | ✅ Complete (code) | T11/T19/T22 require user browser actions — see `dev/layne-website-build-phase0.md` |
| RMA Integration | ✅ Complete (code) | Awaiting API credentials (apply at developers.ratemyagent.co.nz) |
| Phase 1 — Static shell | ✅ Complete | All pages and components built with mock data |
| Phase 2 — Live data | Pending | Requires Sanity project ID (T11) |
| Phase 3 — SEO + launch | Pending | Requires real domain confirmation from Layne |
