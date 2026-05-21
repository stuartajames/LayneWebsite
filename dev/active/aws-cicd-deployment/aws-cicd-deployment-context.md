# CI/CD Deployment — Context & Key Decisions

**Last Updated: 2026-05-21**

---

## Key Files to Modify

| File | Change Required | Why |
|------|----------------|-----|
| `next.config.ts` | Add `output: 'standalone'` | Reduces Docker image size; required for multi-stage Docker build |
| `app/api/health/route.ts` | Create new file | ALB and CloudFront need a health check endpoint |
| `.dockerignore` | Create new file | Exclude node_modules, .next, .env* from Docker context |
| `Dockerfile` | Create new file | Multi-stage build for production container |
| `.github/workflows/ci.yml` | Create new file | PR validation: lint, typecheck, build |
| `.github/workflows/deploy.yml` | Create new file | Branch-triggered deployment to dev/prod |

---

## Key Architecture Decisions

### Why ECS Fargate over Lambda/Serverless

Next.js ISR (Incremental Static Regeneration) uses in-memory cache and filesystem caching that doesn't survive Lambda cold starts cleanly. Fargate runs a persistent Node.js process — the same model Next.js is designed for. Lambda would require `@sentry/nextjs` or OpenNext adapter which adds complexity.

### Why Not Amplify

AWS Amplify Gen 2 supports Next.js SSR but has version lag and doesn't support every Next.js feature. Given the app uses Next.js 16 (bleeding edge), Amplify may not yet support it. ECS gives full control.

### Why OIDC Instead of IAM Access Keys

GitHub Actions OIDC federation means zero long-lived credentials stored in GitHub secrets. AWS validates the GitHub Actions JWT token at runtime and issues short-lived credentials. This is the AWS-recommended approach.

### Why CloudFront in Front of ALB

- HTTPS termination at the edge (not just at ALB)
- Global CDN for static assets (Next.js `/_next/static/*`)
- Can serve from cache even if ECS task is briefly unavailable
- Free SSL via ACM
- Easier custom domain management

### Why Sydney Region (ap-southeast-2)

Target audience is New Zealand. Sydney is the closest AWS region — lowest latency for visitors and for outbound API calls to RateMyAgent (NZ-based service).

---

## Environment Variable Mapping

### Build-Time Public Vars (baked into JS bundle)

These are set as GitHub Actions env vars, not secrets:

| Variable | Dev Value | Prod Value |
|----------|-----------|------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `hw0zvsfo` | `hw0zvsfo` |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | `production` |
| `NEXT_PUBLIC_SITE_URL` | `https://layne.pleasesendhelp.com` | `https://laynehughes.co.nz` |

### Runtime Secrets (AWS Secrets Manager)

Injected at ECS task startup from `layne/{env}/app`:

- `SANITY_API_TOKEN`
- `RESEND_API_KEY`
- `LAYNE_EMAIL`
- `RATEMYAGENT_CLIENT_ID`
- `RATEMYAGENT_CLIENT_SECRET`
- `RATEMYAGENT_API_URL`
- `RATEMYAGENT_TOKEN_URL`
- `REVALIDATE_SECRET`

---

## External Dependencies

| Service | Used For | Auth Method | Outbound From |
|---------|---------|-------------|--------------|
| Sanity.io | CMS content | API token | ECS task |
| RateMyAgent | Listings + reviews | OAuth2 (client_credentials) | ECS task |
| Resend | Contact form emails | API key | ECS task |
| Sanity CDN | Images | Public (no auth) | Browser |

All external API calls originate from the ECS task (server-side). Ensure ECS security group allows outbound HTTPS (443) to `0.0.0.0/0`.

---

## ISR Behaviour in Docker

Next.js ISR stores cache in `.next/cache/` on the container filesystem. In Fargate:
- Cache is **per task instance** — if you run 2 tasks, each has its own cache
- Cache is **lost on task restart** — first request after restart will fetch fresh data
- This is acceptable for this site (ISR revalidates every 6 hours anyway)

If you later need shared ISR cache, use an EFS volume mounted into Fargate tasks — but this is not needed now.

---

## CloudFront Behaviour Rules

Critical: configure CloudFront to **not cache** API routes.

**Behavior 1 — API routes:**
- Path pattern: `/api/*`
- Cache policy: `CachingDisabled` (built-in managed policy)
- Origin request policy: `AllViewer` (forward everything)
- Compress: No

**Behavior 2 — Next.js static assets:**
- Path pattern: `/_next/static/*`
- Cache policy: `CachingOptimized` (long TTL — these are content-hashed)
- Compress: Yes

**Behavior 3 — Default (everything else):**
- Path pattern: `*`
- Cache policy: `CachingDisabled` (Next.js handles its own caching via Cache-Control headers)
- Compress: Yes

---

## Docker Image Size Targets

With `output: 'standalone'` and multi-stage build, target image size: **~200-400 MB**.

Key inclusions in final stage:
- `node:22-alpine` base (~50MB)
- `.next/standalone/` directory (Next.js server + deps, ~150-300MB)
- `.next/static/` (copied into standalone)
- `public/` directory

---

## Rollback Strategy

ECS rolling deployments keep the previous task definition version. To rollback:

1. Go to ECS console → Service → Update service
2. Select previous task definition revision
3. Force new deployment

Or via CLI:
```bash
aws ecs update-service \
  --cluster layne-prod \
  --service layne-prod-service \
  --task-definition layne-prod-task:{PREVIOUS_REVISION} \
  --force-new-deployment
```

GitHub Actions workflow should output the task definition revision number on each deploy to make rollback easy.

---

## Cost Optimisation Notes

- Run **1 Fargate task** minimum for each environment (site traffic is low)
- Use **Fargate Spot** for dev environment (up to 70% cheaper, occasional interruptions acceptable)
- Use **on-demand Fargate** for production (no interruptions)
- Set ECR lifecycle policy to keep only last 10 images (save storage costs)
- CloudFront free tier: 1TB/mo + 10M requests/mo (more than sufficient for this site)
