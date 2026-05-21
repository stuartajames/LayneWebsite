# AWS CI/CD Deployment Plan — Layne Hughes Real Estate Website

**Last Updated: 2026-05-21**

---

## Executive Summary

Deploy the Next.js 16 (App Router, hybrid SSR/ISR) website to AWS infrastructure with two environments:

- **Development:** https://layne.pleasesendhelp.com
- **Production:** https://laynehughes.co.nz

Because the app uses API routes, ISR, and server-side OAuth2 token management, it **cannot** be deployed as a static export. The architecture uses:

- **Amazon ECS Fargate** — containerized Node.js runtime for the Next.js server
- **Amazon ECR** — Docker image registry
- **Amazon CloudFront** — CDN and HTTPS termination
- **AWS Certificate Manager (ACM)** — TLS certificates (free)
- **Amazon Route 53** — DNS (or CNAME delegation from existing registrar)
- **GitHub Actions** — build, test, and deploy pipeline

---

## Current State Analysis

| Aspect | Current |
|--------|---------|
| Next.js version | 16.2.4 (App Router) |
| Rendering | Hybrid ISR + server routes |
| Deployment | Not deployed (no infra config exists) |
| CMS | Sanity.io (hosted) |
| External APIs | RateMyAgent (OAuth2), Resend (email) |
| CI/CD | None |
| Environments | None |
| Secrets management | `.env.local` only (not committed) |

---

## Proposed Architecture

```
GitHub ──push──▶ GitHub Actions
                     │
              ┌──────▼──────┐
              │  Build &    │
              │  Test       │
              └──────┬──────┘
                     │
              ┌──────▼──────┐
              │  Docker     │
              │  Build &    │
              │  Push ▶ ECR │
              └──────┬──────┘
                     │
         ┌───────────┴──────────┐
         │                      │
   [dev branch]          [main branch]
         │                      │
   ECS Fargate            ECS Fargate
   (dev cluster)          (prod cluster)
         │                      │
   CloudFront               CloudFront
   (dev distrib.)           (prod distrib.)
         │                      │
   layne.please            laynehughes
   sendhelp.com              .co.nz
```

### AWS Services Breakdown

| Service | Purpose | Cost Estimate |
|---------|---------|--------------|
| ECS Fargate | Run Next.js container | ~$15-30/mo (0.25 vCPU, 512MB) |
| ECR | Store Docker images | ~$1-2/mo |
| CloudFront | CDN + HTTPS | ~$1-5/mo |
| ACM | TLS certificates | Free |
| ALB | Load balancer (ECS ingress) | ~$16/mo per env |
| Route 53 | DNS hosting | $0.50/zone/mo |
| Secrets Manager | Environment secrets | ~$0.40/secret/mo |

**Estimated total: ~$50-80/mo for both environments**

> **ALB Cost Note:** ALB at ~$16/mo per environment is the biggest fixed cost. For a low-traffic site, an alternative is to skip ALB and use an ECS service with a public IP + CloudFront directly — but ALB is recommended for health checks and zero-downtime deploys.

---

## Implementation Phases

### Phase 1 — AWS Foundation (Infrastructure Setup)

Manual one-time setup of core AWS resources.

### Phase 2 — Dockerise the Application

Create production-ready Dockerfile for the Next.js app.

### Phase 3 — GitHub Actions Pipeline

Build the CI/CD workflows for dev and production deployments.

### Phase 4 — Secrets & Environment Management

Migrate all environment variables to AWS Secrets Manager.

### Phase 5 — DNS & SSL

Point domains to CloudFront distributions with HTTPS.

### Phase 6 — Validation & Monitoring

Smoke tests, health checks, and basic CloudWatch alarms.

---

## Phase 1: AWS Foundation

### Architecture Decisions

**Container orchestration:** ECS Fargate (no EC2 to manage, scales to zero isn't needed for this app, simpler than EKS)

**Image registry:** ECR (co-located with ECS, IAM-native auth, no credential management)

**Networking:** VPC with public subnets for Fargate tasks (simplest for outbound API calls to Sanity/RateMyAgent/Resend). ALB in public subnets.

### Resources to Create

**IAM Roles:**
- `layne-github-actions` — OIDC-federated role for GitHub Actions (no static keys)
  - Permissions: `ecr:*`, `ecs:UpdateService`, `ecs:RegisterTaskDefinition`, `ecs:DescribeServices`, `secretsmanager:GetSecretValue` (for task secrets)
- `layne-ecs-task-execution` — ECS task execution role
  - Managed policy: `AmazonECSTaskExecutionRolePolicy`
  - Plus: `secretsmanager:GetSecretValue` for app secrets
- `layne-ecs-task` — ECS task role (what the app runs as)
  - No special permissions needed (app calls external APIs directly)

**ECR Repositories:**
- `layne-website` — single repo, tagged by environment and git SHA

**VPC (can reuse default VPC):**
- Use default VPC in your chosen region (e.g., `ap-southeast-2` Sydney for NZ audience)
- Public subnets for ALB and Fargate tasks

**Security Groups:**
- `layne-alb-sg` — inbound 443/80 from `0.0.0.0/0`, outbound all
- `layne-ecs-sg` — inbound port 3000 from `layne-alb-sg` only, outbound all

**ECS Clusters:**
- `layne-dev` cluster
- `layne-prod` cluster

**ALBs:**
- `layne-dev-alb` — listener on 80 (redirect to 443) + 443 (ACM cert)
- `layne-prod-alb` — listener on 80 (redirect to 443) + 443 (ACM cert)

**Target Groups:**
- `layne-dev-tg` — HTTP, port 3000, health check `GET /api/health`
- `layne-prod-tg` — HTTP, port 3000, health check `GET /api/health`

**CloudFront Distributions:**
- `layne-dev-cf` — origin: dev ALB DNS, CNAME: `layne.pleasesendhelp.com`, ACM cert
- `layne-prod-cf` — origin: prod ALB DNS, CNAME: `laynehughes.co.nz`, ACM cert

> **ACM Note:** CloudFront requires certificates in `us-east-1` regardless of your app region. Create a second ACM certificate in us-east-1 for the CloudFront associations.

---

## Phase 2: Dockerise the Application

### Dockerfile Strategy

Multi-stage build:
1. **deps** — install only production dependencies
2. **builder** — build the Next.js app
3. **runner** — minimal runtime image (node:22-alpine)

Next.js standalone output mode reduces the image size significantly. Requires adding `output: 'standalone'` to `next.config.ts`.

### `next.config.ts` Change Required

```typescript
const nextConfig: NextConfig = {
  output: 'standalone',           // ADD THIS
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
  },
}
```

### Health Check Endpoint Required

Add `app/api/health/route.ts`:
```typescript
export async function GET() {
  return Response.json({ status: 'ok' })
}
```

### ECS Task Definition

- CPU: 256 (0.25 vCPU)
- Memory: 512 MB
- Port: 3000
- Secrets: injected from AWS Secrets Manager (not env vars in task def)
- Log driver: `awslogs` → CloudWatch log group `/ecs/layne-[env]`

---

## Phase 3: GitHub Actions Pipeline

### Workflow Strategy

Two workflows:
1. **`ci.yml`** — runs on all PRs: lint, type-check, build
2. **`deploy.yml`** — runs on push to `dev` or `main` branch

### Branch → Environment Mapping

| Branch | Environment | Domain |
|--------|------------|--------|
| `dev` | Development | layne.pleasesendhelp.com |
| `main` | Production | laynehughes.co.nz |

### `ci.yml` — Pull Request Checks

Triggers: `pull_request` to `main` or `dev`

Steps:
1. Checkout
2. Setup Node 22
3. `npm ci`
4. `npm run lint`
5. `npx tsc --noEmit`
6. `npm run build` (with dummy env vars for build-time public vars)

### `deploy.yml` — Deployment

Triggers: `push` to `main` or `dev`

Steps:
1. Checkout
2. Configure AWS credentials (OIDC — no static keys)
3. Login to ECR
4. Build Docker image
5. Tag: `{ECR_URI}:latest`, `{ECR_URI}:{git-sha}`
6. Push to ECR
7. Render new ECS task definition (update image URI)
8. Deploy to ECS service (rolling update)
9. Wait for service stability
10. Smoke test: `curl https://{domain}/api/health`

### GitHub Secrets Required

| Secret | Value |
|--------|-------|
| `AWS_ACCOUNT_ID` | Your 12-digit AWS account ID |
| `AWS_REGION` | e.g., `ap-southeast-2` |
| `ECR_REPOSITORY` | `layne-website` |
| `DEV_ECS_CLUSTER` | `layne-dev` |
| `DEV_ECS_SERVICE` | `layne-dev-service` |
| `DEV_ECS_TASK_FAMILY` | `layne-dev-task` |
| `PROD_ECS_CLUSTER` | `layne-prod` |
| `PROD_ECS_SERVICE` | `layne-prod-service` |
| `PROD_ECS_TASK_FAMILY` | `layne-prod-task` |

> **No AWS access keys stored in GitHub** — use OIDC federation (GitHub's identity provider is trusted by AWS IAM).

---

## Phase 4: Secrets & Environment Management

### AWS Secrets Manager Structure

Create one secret per environment (reduces cost vs. per-variable):

**`layne/dev/app`** (JSON):
```json
{
  "SANITY_API_TOKEN": "...",
  "RESEND_API_KEY": "...",
  "LAYNE_EMAIL": "...",
  "RATEMYAGENT_CLIENT_ID": "...",
  "RATEMYAGENT_CLIENT_SECRET": "...",
  "RATEMYAGENT_API_URL": "...",
  "RATEMYAGENT_TOKEN_URL": "...",
  "REVALIDATE_SECRET": "..."
}
```

**`layne/prod/app`** (same keys, production values)

### Public Environment Variables

These are baked into the build (not secret), set as GitHub Actions environment variables or build args:
- `NEXT_PUBLIC_SANITY_PROJECT_ID=hw0zvsfo`
- `NEXT_PUBLIC_SANITY_DATASET=production`
- `NEXT_PUBLIC_SITE_URL` — set per environment

### ECS Secret Injection

ECS task definition references Secrets Manager ARNs — secrets are injected as environment variables at container startup. No secrets stored in task definition JSON or ECR image.

---

## Phase 5: DNS & SSL

### ACM Certificates

Two regions required:
1. **`ap-southeast-2` (Sydney)** — for ALB HTTPS listeners
   - `layne.pleasesendhelp.com`
   - `laynehughes.co.nz`
2. **`us-east-1` (N. Virginia)** — for CloudFront (CloudFront requires us-east-1 certs)
   - Same domains

Both certificates validated via DNS validation (add CNAME records to domain registrar).

### DNS Configuration

**pleasesendhelp.com (dev subdomain):**
- Add CNAME: `layne.pleasesendhelp.com` → CloudFront dev distribution domain

**laynehughes.co.nz (production):**
- If using Route 53: create A record (alias) pointing to CloudFront distribution
- If keeping existing registrar: add CNAME `laynehughes.co.nz` → CloudFront domain
  - Note: root domain CNAME may not be supported by all registrars — use Route 53 or ALIAS record

---

## Phase 6: Validation & Monitoring

### Health Checks
- ALB target group health check: `GET /api/health` every 30s
- CloudFront origin health: inherits from ALB

### CloudWatch Alarms (Basic)
- ECS CPU > 80% for 5 minutes → SNS notification
- ALB 5xx error rate > 1% for 5 minutes → SNS notification
- ECS task count drops to 0 → SNS notification

### Deployment Smoke Tests
GitHub Actions post-deploy step:
```bash
curl -f https://${DOMAIN}/api/health
curl -f https://${DOMAIN}/api/reviews  # verify external API connectivity
```

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| RateMyAgent OAuth2 fails in container | Medium | High | Add mock fallback (already exists in `mockReviews.ts`) |
| ISR doesn't work as expected in Docker | Low | Medium | Test ISR revalidation in dev environment first |
| CloudFront caches API routes | Medium | High | Set `Cache-Control: no-store` on all API routes; configure CloudFront behavior to forward to origin for `/api/*` |
| ACM cert validation delays | Low | Low | Use DNS validation, not email |
| Secrets rotation breaks app | Low | High | Keep old version active during rotation; test rotation in dev first |
| Cold start latency on Fargate | Low | Low | Run minimum 1 task always (no scale-to-zero) |
| Docker image size bloat | Medium | Low | Use standalone output + multi-stage build |

### CloudFront Caching — Critical Configuration

CloudFront must be configured to **not cache API routes**:

Create two CloudFront cache behaviors:
1. `/api/*` — Cache policy: `CachingDisabled`, Origin request policy: forward all headers/cookies
2. `/*` (default) — Cache policy: `CachingOptimized`, TTL 86400s, respect `Cache-Control` headers

---

## Success Metrics

- [ ] `git push` to `dev` deploys to `layne.pleasesendhelp.com` within 5 minutes
- [ ] `git push` to `main` deploys to `laynehughes.co.nz` within 5 minutes
- [ ] Zero downtime during rolling updates (ECS rolling deployment)
- [ ] HTTPS works on both domains with valid certificates
- [ ] `/api/health` returns 200 on both environments
- [ ] Contact form sends emails in production
- [ ] Listings and reviews load from live data sources
- [ ] No secrets stored in GitHub (OIDC only), ECR images, or task definitions

---

## Required Prerequisites

Before starting implementation:

1. **AWS account** with billing enabled
2. **AWS CLI** configured locally (`aws configure`)
3. **Docker** installed locally (for testing Dockerfile)
4. **Domain registrar access** for both domains (to add DNS records)
5. **GitHub repository** with `main` and `dev` branches
6. **All secret values** ready to populate in Secrets Manager

---

## Timeline Estimates

| Phase | Effort | Est. Time |
|-------|--------|----------|
| Phase 1: AWS Foundation | L | 3-4 hours |
| Phase 2: Dockerise app | M | 1-2 hours |
| Phase 3: GitHub Actions | M | 2-3 hours |
| Phase 4: Secrets management | S | 1 hour |
| Phase 5: DNS & SSL | S | 1-2 hours (+ propagation time) |
| Phase 6: Validation | S | 1 hour |
| **Total** | | **~10-13 hours** |
