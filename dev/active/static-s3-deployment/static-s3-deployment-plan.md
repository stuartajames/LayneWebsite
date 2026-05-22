# Static S3 Deployment Plan

**Last Updated: 2026-05-22**

---

## Executive Summary

Deploy the Next.js static export (`out/`) to AWS S3 + CloudFront with two environments:

| Environment | URL | Trigger |
|------------|-----|---------|
| Development | https://layne.pleasesendhelp.com | Auto on push to `main` |
| Production | https://laynehughes.co.nz | Manual workflow dispatch |

Because the site is now `output: 'export'`, there is no Node.js server — just static HTML/CSS/JS uploaded to S3 and served via CloudFront. This is dramatically simpler and cheaper than the previous ECS plan.

**Estimated AWS cost: ~$1-3/mo total for both environments.**

---

## Current State

- Next.js 16 with `output: 'export'` — `npm run build` produces `out/` directory
- No API routes, no server runtime required
- Contact form uses Web3Forms (client-side)
- Reviews fetched from public S3 URL at build time
- No existing GitHub Actions, no AWS infrastructure
- `NEXT_PUBLIC_WEB3FORMS_KEY` required at build time

---

## Architecture

```
GitHub (main branch)
    │
    ├── push → GitHub Actions (auto)
    │               │
    │               ▼
    │          npm run build
    │               │
    │               ▼
    │        aws s3 sync out/ → layne-dev bucket
    │               │
    │               ▼
    │        CloudFront invalidation (dev)
    │
    └── workflow_dispatch → GitHub Actions (manual)
                    │
                    ▼
               npm run build
                    │
                    ▼
            aws s3 sync out/ → layne-prod bucket
                    │
                    ▼
            CloudFront invalidation (prod)
```

### AWS Resources

| Resource | Dev | Prod |
|----------|-----|------|
| S3 Bucket | `layne-website-dev` | `layne-website-prod` |
| CloudFront Distribution | dev distrib. | prod distrib. |
| ACM Certificate (us-east-1) | `layne.pleasesendhelp.com` | `laynehughes.co.nz` |
| IAM Role | `layne-github-actions` (shared) | same role |

---

## Phase 1: AWS Infrastructure

### 1.1 — IAM Role (GitHub Actions OIDC)

Create role `layne-github-actions` with:

**Trust policy:**
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Federated": "arn:aws:iam::{ACCOUNT_ID}:oidc-provider/token.actions.githubusercontent.com" },
    "Action": "sts:AssumeRoleWithWebIdentity",
    "Condition": {
      "StringLike": {
        "token.actions.githubusercontent.com:sub": "repo:YOUR_GITHUB_ORG/LayneWebsite:*"
      },
      "StringEquals": {
        "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
      }
    }
  }]
}
```

**Permissions policy:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:DeleteObject", "s3:ListBucket", "s3:GetObject"],
      "Resource": [
        "arn:aws:s3:::layne-website-dev",
        "arn:aws:s3:::layne-website-dev/*",
        "arn:aws:s3:::layne-website-prod",
        "arn:aws:s3:::layne-website-prod/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": "cloudfront:CreateInvalidation",
      "Resource": "*"
    }
  ]
}
```

### 1.2 — S3 Buckets

Create two buckets (region: `ap-southeast-2`):
- `layne-website-dev`
- `layne-website-prod`

Both buckets:
- Block all public access: **ON** (CloudFront will access via OAC)
- Versioning: disabled
- Static website hosting: **disabled** (CloudFront handles routing)

### 1.3 — CloudFront Distributions

**Origin Access Control (OAC):**
Create one OAC for each bucket. Allows CloudFront to read from private S3 buckets.

**Distribution settings (both dev and prod):**
- Origin: S3 bucket (via OAC)
- Default root object: `index.html`
- Error pages: 404 → `/404.html` (status code 404)
- Price class: PriceClass_All (or PriceClass_100 for cheaper)
- HTTPS only
- Compress: Yes

**Custom error page for SPA routing:**
- HTTP error code: 403 (S3 returns 403 for missing files, not 404)
- Response page: `/404.html`
- Response code: 404

**CNAME + ACM:**
- Dev: `layne.pleasesendhelp.com` + ACM cert (us-east-1)
- Prod: `laynehughes.co.nz` + ACM cert (us-east-1)

### 1.4 — S3 Bucket Policies (OAC)

After creating CloudFront distributions, attach bucket policies allowing CloudFront OAC access:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Service": "cloudfront.amazonaws.com" },
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::layne-website-{env}/*",
    "Condition": {
      "StringEquals": {
        "AWS:SourceArn": "arn:aws:cloudfront::{ACCOUNT_ID}:distribution/{DISTRIBUTION_ID}"
      }
    }
  }]
}
```

### 1.5 — ACM Certificates

Create in **us-east-1** (required for CloudFront):
- `layne.pleasesendhelp.com`
- `laynehughes.co.nz`

Both: DNS validation. Add CNAME records to respective registrars.

### 1.6 — DNS

**pleasesendhelp.com:**
- Add CNAME: `layne` → dev CloudFront domain (e.g. `xxxxx.cloudfront.net`)

**laynehughes.co.nz:**
- Add CNAME or ALIAS: `laynehughes.co.nz` → prod CloudFront domain
- Note: root domain CNAME may not work at all registrars — if so, migrate DNS to Route 53 and use an ALIAS record

---

## Phase 2: GitHub Actions Workflows

### 2.1 — GitHub Secrets

Add to repository (Settings → Secrets and variables → Actions):

| Secret | Value |
|--------|-------|
| `AWS_ACCOUNT_ID` | Your 12-digit AWS account ID |
| `DEV_S3_BUCKET` | `layne-website-dev` |
| `DEV_CF_DISTRIBUTION_ID` | Dev CloudFront distribution ID |
| `PROD_S3_BUCKET` | `layne-website-prod` |
| `PROD_CF_DISTRIBUTION_ID` | Prod CloudFront distribution ID |
| `NEXT_PUBLIC_WEB3FORMS_KEY` | Web3Forms access key |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `hw0zvsfo` |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |

### 2.2 — Dev Workflow (auto on push)

File: `.github/workflows/deploy-dev.yml`

```yaml
name: Deploy Dev

on:
  push:
    branches: [main]

permissions:
  id-token: write
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - run: npm ci

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_WEB3FORMS_KEY: ${{ secrets.NEXT_PUBLIC_WEB3FORMS_KEY }}
          NEXT_PUBLIC_SANITY_PROJECT_ID: ${{ secrets.NEXT_PUBLIC_SANITY_PROJECT_ID }}
          NEXT_PUBLIC_SANITY_DATASET: ${{ secrets.NEXT_PUBLIC_SANITY_DATASET }}
          NEXT_PUBLIC_SITE_URL: https://layne.pleasesendhelp.com

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::${{ secrets.AWS_ACCOUNT_ID }}:role/layne-github-actions
          aws-region: ap-southeast-2

      - name: Upload to S3
        run: aws s3 sync out/ s3://${{ secrets.DEV_S3_BUCKET }} --delete

      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.DEV_CF_DISTRIBUTION_ID }} \
            --paths "/*"
```

### 2.3 — Prod Workflow (manual dispatch)

File: `.github/workflows/deploy-prod.yml`

```yaml
name: Deploy Prod

on:
  workflow_dispatch:

permissions:
  id-token: write
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - run: npm ci

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_WEB3FORMS_KEY: ${{ secrets.NEXT_PUBLIC_WEB3FORMS_KEY }}
          NEXT_PUBLIC_SANITY_PROJECT_ID: ${{ secrets.NEXT_PUBLIC_SANITY_PROJECT_ID }}
          NEXT_PUBLIC_SANITY_DATASET: ${{ secrets.NEXT_PUBLIC_SANITY_DATASET }}
          NEXT_PUBLIC_SITE_URL: https://laynehughes.co.nz

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::${{ secrets.AWS_ACCOUNT_ID }}:role/layne-github-actions
          aws-region: ap-southeast-2

      - name: Upload to S3
        run: aws s3 sync out/ s3://${{ secrets.PROD_S3_BUCKET }} --delete

      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.PROD_CF_DISTRIBUTION_ID }} \
            --paths "/*"
```

> The `environment: production` setting enables GitHub's built-in deployment protection — you can configure required reviewers in Settings → Environments → production.

---

## Phase 3: Validation

### Smoke Tests

After each deployment verify:
- [ ] Homepage loads with HTTPS
- [ ] TLS certificate is valid (no browser warning)
- [ ] Contact form submits (Web3Forms)
- [ ] Reviews load from S3
- [ ] Listings page loads
- [ ] 404 page shows for unknown routes

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Root domain CNAME not supported by registrar | High | Migrate laynehughes.co.nz DNS to Route 53 |
| CloudFront serves stale content | Low | `--delete` flag + full `/*` invalidation on every deploy |
| `NEXT_PUBLIC_SITE_URL` wrong per env | Medium | Set explicitly per workflow, not shared secret |
| Prod accidentally auto-deployed | Low | Prod is `workflow_dispatch` only — manual trigger required |
| Web3Forms key exposed in bundle | Low | Acceptable — Web3Forms keys are designed to be public-facing |

---

## Cost Estimate

| Service | Monthly Cost |
|---------|-------------|
| S3 (2 buckets, ~50MB) | < $0.01 |
| CloudFront (low traffic) | ~$0.50–2 |
| ACM certificates | Free |
| Route 53 (optional) | $0.50/zone |
| **Total** | **~$1–3/mo** |

---

## Timeline

| Phase | Effort | Est. Time |
|-------|--------|----------|
| Phase 1: AWS infrastructure | M | 2–3 hours |
| Phase 2: GitHub Actions | S | 30 min |
| Phase 3: DNS + validation | S | 1 hour + propagation |
| **Total** | | **~4–5 hours** |
