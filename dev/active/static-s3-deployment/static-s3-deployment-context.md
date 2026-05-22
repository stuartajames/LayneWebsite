# Static S3 Deployment — Context & Decisions

**Last Updated: 2026-05-22**

---

## Why Static S3 vs Previous ECS Plan

The previous plan used ECS Fargate (~$50-80/mo) because the site had API routes and ISR. Since then:
- Contact form → replaced with Web3Forms (client-side)
- Reviews → fetched from public S3 URL at build time
- Sanity Studio → moved to layne-hughes.sanity.studio
- `output: 'export'` added to next.config.ts

Result: pure static export, S3 + CloudFront is sufficient at ~$1-3/mo.

---

## Key Files

| File | Purpose |
|------|---------|
| `next.config.ts` | `output: 'export'` + `images.unoptimized: true` |
| `out/` | Build output (generated, not committed) |
| `.github/workflows/deploy-dev.yml` | Auto-deploy on push to main |
| `.github/workflows/deploy-prod.yml` | Manual deploy to production |

---

## Environment Variable Split

`NEXT_PUBLIC_SITE_URL` differs per environment — set in each workflow, not as a shared secret:
- Dev: `https://layne.pleasesendhelp.com`
- Prod: `https://laynehughes.co.nz`

All other `NEXT_PUBLIC_*` vars are the same for both environments.

---

## CloudFront Error Page Config

S3 returns **403** (not 404) for missing objects when using OAC with private buckets. CloudFront must be configured to treat 403 as a 404:

- Error code: 403 → Response page: `/404.html` → HTTP status: 404
- Error code: 404 → Response page: `/404.html` → HTTP status: 404

---

## OAC vs OAI

Use **Origin Access Control (OAC)** not the older Origin Access Identity (OAI). OAC is the current AWS recommendation and supports more S3 features.

---

## Root Domain on laynehughes.co.nz

If the NZ registrar doesn't support ALIAS/ANAME records for the root domain (`laynehughes.co.nz`):
- Option A: Migrate DNS to Route 53 and use an ALIAS record pointing to CloudFront
- Option B: Use `www.laynehughes.co.nz` and redirect root via registrar

Route 53 is recommended — it costs $0.50/zone/mo and eliminates this problem permanently.

---

## GitHub OIDC vs Access Keys

Using OIDC federation — no long-lived AWS credentials stored in GitHub. The role trust policy is scoped to the specific repository. Add the GitHub OIDC provider to AWS IAM once (not per repository).

---

## Production Deploy Protection

The prod workflow uses `environment: production`. Configure in GitHub:
Settings → Environments → production → Required reviewers (optional but recommended).

This means the workflow_dispatch still requires a human to click "Run workflow" in the GitHub UI — there's no accidental prod deploy path.

---

## CloudFront Invalidation Cost

Each `/*` invalidation is free for the first 1,000 path invalidations per month. At one deploy per day that's ~30/mo — well within the free tier.
