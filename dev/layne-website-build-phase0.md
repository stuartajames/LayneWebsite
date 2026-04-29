# Phase 0 — User Action Setup Guide

Last Updated: 2026-04-29

---

## T11 — Create Sanity Project

**What it's for:** Sanity is the CMS where you'll manage listings, suburb stats, Layne's bio, and testimonials. The project ID connects the website code to your Sanity data.

**Steps:**

1. Go to [sanity.io](https://sanity.io) and sign in (or create a free account)
2. Click **"Create new project"**
3. Name it something like `layne-hughes-real-estate`
4. Select **"Free"** plan — no credit card needed
5. Choose dataset name: `production` (this matches the code exactly — don't change it)
6. Once created, you'll land on the project dashboard. Copy the **Project ID** — it's a short string like `abc12def`
7. Open `.env.local` in this project and fill in:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=abc12def
   ```
8. To generate a read token (needed for fetching data server-side):
   - In the Sanity dashboard go to **API → Tokens**
   - Click **"Add API token"**
   - Name: `website-read`, permissions: **Viewer**
   - Copy the token and add to `.env.local`:
     ```
     SANITY_API_TOKEN=sk...your-token-here
     ```
9. To access the Sanity Studio (content editor), run `npm run dev` and visit `http://localhost:3000/studio`

---

## T19/T20 — Create Cloudflare Pages Project

**What it's for:** Cloudflare Pages hosts the website for free with no commercial use restrictions (unlike Vercel's free tier). It serves the site globally via Cloudflare's CDN.

**Steps:**

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) and sign in (or create a free account — no credit card needed)
2. In the left sidebar go to **Workers & Pages → Pages**
3. Click **"Create a project"** → **"Connect to Git"**
4. Connect your GitHub account and select the `layne-website` repository
5. Configure the build settings:
   - **Framework preset:** Next.js
   - **Build command:** `npx @cloudflare/next-on-pages`
   - **Build output directory:** `.vercel/output/static`
   - **Node.js version:** `20` (set under Environment Variables → `NODE_VERSION=20`)
6. Before deploying, add all environment variables from `.env.local` under **Settings → Environment Variables**. Add each one to both **Production** and **Preview** environments:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN
   RATEMYAGENT_CLIENT_ID
   RATEMYAGENT_CLIENT_SECRET
   RATEMYAGENT_TOKEN_URL
   LAYNE_AGENT_CODE=layne-hughes-at845
   RESEND_API_KEY
   LAYNE_EMAIL
   NEXT_PUBLIC_SITE_URL
   REVALIDATE_SECRET
   ```
7. Click **"Save and Deploy"**
8. If the build fails with a Next.js adapter error, follow the T21 fallback below

### T21 — Fallback: Switch to Vercel (if Cloudflare build fails)

The `@cloudflare/next-on-pages` adapter occasionally has issues with newer Next.js versions. If the build fails:

1. Go to [vercel.com](https://vercel.com) → **"Add New Project"** → import the same GitHub repo
2. Vercel auto-detects Next.js — no build config needed
3. Add the same environment variables under **Settings → Environment Variables**
4. Note: Vercel Pro is $20/mo — only switch if Cloudflare has persistent build issues

---

## T22 — Create Resend Account

**What it's for:** Resend sends the contact form emails to Layne. When someone submits the contact form on the website, Resend delivers it to Layne's inbox. The free tier covers 3,000 emails/month which is more than enough.

**Steps:**

1. Go to [resend.com](https://resend.com) and sign up with your email
2. In the dashboard, go to **API Keys → "Create API Key"**
3. Name it `layne-website`, permission: **Sending access**
4. Copy the key (starts with `re_`) and add to `.env.local`:
   ```
   RESEND_API_KEY=re_...your-key-here
   ```
5. Also fill in the recipient address:
   ```
   LAYNE_EMAIL=layne@example.com
   ```
   *(replace with Layne's actual email)*
6. **For now** the contact form will send from `onboarding@resend.dev` — this is Resend's shared test address and works immediately with no DNS setup. Emails may land in spam during this phase.
7. **Domain verification** (Phase 3 — when the real domain is confirmed): In Resend go to **Domains → "Add Domain"**, enter the real domain, and add the 5 DNS records it provides to the domain registrar. This moves sending to `noreply@realdomain.co.nz` and ensures inbox delivery.

---

## Summary

| Action | Urgency | Blocks |
|---|---|---|
| T11 — Sanity project | Do first | Sanity Studio, live data in Phase 2 |
| T22 — Resend account | Do anytime before Phase 2 | Contact form going live |
| T19/T20 — Cloudflare Pages | Do before launch | Production deployment |

You can continue building Phase 1 (all the page components) without any of these being done — they're only needed when you want to see live CMS data or deploy to production.
