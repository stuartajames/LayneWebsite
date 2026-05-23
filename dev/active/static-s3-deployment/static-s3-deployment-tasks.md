# Static S3 Deployment — Task Checklist

**Last Updated: 2026-05-22**

---

## Phase 1: AWS Infrastructure

### 1.1 — GitHub OIDC Provider (one-time, per AWS account) ✓

- [x] Go to IAM → Identity providers → Add provider
  - Provider type: OpenID Connect
  - Provider URL: `https://token.actions.githubusercontent.com`
  - Audience: `sts.amazonaws.com`

### 1.2 — IAM Role ✓

- [x] Create role `layne-github-actions`
  - Trusted entity: Web identity → select the GitHub OIDC provider
  - Condition: `token.actions.githubusercontent.com:sub` = `repo:stuartajames/LayneWebsite:*`
  - Condition: `token.actions.githubusercontent.com:aud` = `sts.amazonaws.com`
- [x] Attach inline permissions policy (S3 sync + CloudFront invalidation on both buckets)
- [x] Note the role ARN

### 1.3 — S3 Buckets

- [x] Create bucket `layne-website-dev` in `ap-southeast-2`
  - Block all public access: ON
  - Versioning: off
- [x] Create bucket `layne-website-prod` in `ap-southeast-2`
  - Block all public access: ON
  - Versioning: off

### 1.4 — ACM Certificates (us-east-1 — required for CloudFront)

- [x] Switch console region to **us-east-1**
- [x] Request certificate for `layne.pleasesendhelp.com` (DNS validation)
- [ ] Request certificate for `laynehughes.co.nz` (DNS validation)
- [x] Add CNAME validation records in **Cloudflare DNS** for each domain (proxy status: DNS only)
- [x] Wait for both to show **Issued** status

### 1.5 — CloudFront: Dev Distribution

- [x] Create distribution
  - Origin: `layne-website-dev.s3.ap-southeast-2.amazonaws.com`
  - Origin access: **Origin Access Control (OAC)** — create new OAC
  - Default root object: `index.html`
  - CNAME: `layne.pleasesendhelp.com`
  - ACM certificate: select `layne.pleasesendhelp.com` cert (us-east-1)
  - HTTPS only
  - Compress: Yes
- [x] Add custom error responses:
  - 403 → `/404.html` → status 404
  - 404 → `/404.html` → status 404
- [x] Copy the S3 bucket policy shown after creating OAC → apply to `layne-website-dev` bucket
- [x] Note dev distribution ID

### 1.6 — CloudFront: Prod Distribution

- [ ] Create distribution (same settings as dev)
  - Origin: `layne-website-prod.s3.ap-southeast-2.amazonaws.com`
  - New OAC for prod bucket
  - CNAME: `laynehughes.co.nz`
  - ACM certificate: `laynehughes.co.nz` (us-east-1)
- [ ] Add same custom error responses (403/404 → `/404.html`)
- [ ] Apply bucket policy to `layne-website-prod`
- [ ] Note prod distribution ID

### 1.7 — DNS (Cloudflare)

Both domains are managed via Cloudflare DNS. Cloudflare supports CNAME flattening so root domain CNAMEs work without Route 53.

**Important:** Set Cloudflare proxy to **DNS only** (grey cloud) for CloudFront records — CloudFront handles HTTPS itself and Cloudflare proxying will conflict with ACM certificates.

- [ ] Log into Cloudflare dashboard
- [ ] For `pleasesendhelp.com`:
  - Add CNAME record: `layne` → dev CloudFront domain (e.g. `xxxxx.cloudfront.net`)
  - Proxy status: **DNS only** (grey cloud)
- [ ] For `laynehughes.co.nz`:
  - Add CNAME record: `@` (root) → prod CloudFront domain
  - Proxy status: **DNS only** (grey cloud)
  - Cloudflare will automatically flatten the root CNAME to an A record

---

## Phase 2: GitHub Actions

### 2.1 — GitHub Secrets

Add at: repository Settings → Secrets and variables → Actions → New repository secret

- [x] `AWS_ACCOUNT_ID`
- [x] `DEV_S3_BUCKET` = `layne-website-dev`
- [x] `DEV_CF_DISTRIBUTION_ID`
- [ ] `PROD_S3_BUCKET` = `layne-website-prod`
- [ ] `PROD_CF_DISTRIBUTION_ID`
- [x] `NEXT_PUBLIC_WEB3FORMS_KEY`
- [x] `NEXT_PUBLIC_SANITY_PROJECT_ID` = `hw0zvsfo`
- [x] `NEXT_PUBLIC_SANITY_DATASET` = `production`

### 2.2 — Production Environment (optional but recommended)

- [ ] Go to Settings → Environments → New environment → name: `production`
- [ ] Add required reviewers if desired
- [ ] This gates the prod workflow_dispatch behind an approval

### 2.3 — Create Workflow Files

- [x] Create `.github/workflows/deploy-dev.yml` (auto on push to main)
- [x] Create `.github/workflows/deploy-prod.yml` (manual workflow_dispatch)
- [ ] Commit and push both files

---

## Phase 3: Validation

### 3.1 — Dev Deployment

- [ ] Push a commit to `main`
- [ ] Verify GitHub Actions workflow runs and passes
- [ ] Verify `https://layne.pleasesendhelp.com` loads
- [ ] Verify HTTPS certificate is valid
- [ ] Verify contact form submits
- [ ] Verify reviews load
- [ ] Verify 404 page shows for unknown URL

### 3.2 — Prod Deployment

- [ ] Go to GitHub → Actions → Deploy Prod → Run workflow
- [ ] Verify workflow passes
- [ ] Verify `https://laynehughes.co.nz` loads
- [ ] Run full smoke test (same as dev)

### 3.3 — Cleanup

- [ ] Archive previous ECS/Fargate plan (no longer needed)
- [ ] Remove `RESEND_API_KEY` and `LAYNE_EMAIL` from `.env.local` (no longer used)
