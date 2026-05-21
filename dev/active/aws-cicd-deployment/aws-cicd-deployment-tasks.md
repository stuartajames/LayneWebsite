# CI/CD Deployment — Task Checklist

**Last Updated: 2026-05-21**

---

## Phase 1: AWS Foundation (One-Time Setup)

### 1.1 — Account & Region Setup
- [ ] Select AWS region: `ap-southeast-2` (Sydney)
- [ ] Enable billing alerts in AWS account

### 1.2 — IAM: GitHub Actions OIDC Federation
- [ ] Add GitHub as OIDC identity provider in IAM console
  - Provider URL: `https://token.actions.githubusercontent.com`
  - Audience: `sts.amazonaws.com`
- [ ] Create IAM role `layne-github-actions`
  - Trust policy: GitHub OIDC, scoped to `repo:YOUR_ORG/LayneWebsite:*`
  - Permissions: ECR push, ECS deploy, Secrets Manager read
- [ ] Note the role ARN for GitHub secrets

### 1.3 — IAM: ECS Roles
- [ ] Create ECS task execution role `layne-ecs-task-execution`
  - Attach managed policy: `AmazonECSTaskExecutionRolePolicy`
  - Inline policy: `secretsmanager:GetSecretValue` on `layne/*` secrets
- [ ] Create ECS task role `layne-ecs-task`
  - No special permissions (app calls external APIs directly)

### 1.4 — ECR Repository
- [ ] Create ECR repository: `layne-website`
  - Tag mutability: `MUTABLE`
  - Scan on push: enabled
- [ ] Set lifecycle policy: keep last 10 images tagged `dev-*`, last 10 tagged `prod-*`, expire untagged after 1 day
- [ ] Note the ECR URI: `{ACCOUNT_ID}.dkr.ecr.ap-southeast-2.amazonaws.com/layne-website`

### 1.5 — Networking
- [ ] Identify or use default VPC in `ap-southeast-2`
- [ ] Note 2+ public subnet IDs for ALB
- [ ] Note 2+ subnet IDs for Fargate tasks
- [ ] Create security group `layne-alb-sg`
  - Inbound: 80/443 from `0.0.0.0/0, ::/0`
  - Outbound: all
- [ ] Create security group `layne-ecs-sg`
  - Inbound: port 3000 from `layne-alb-sg`
  - Outbound: all (needed for Sanity, RateMyAgent, Resend calls)

### 1.6 — ACM Certificates (Sydney region — for ALB)
- [ ] Request certificate in `ap-southeast-2` for `layne.pleasesendhelp.com`
- [ ] Request certificate in `ap-southeast-2` for `laynehughes.co.nz`
- [ ] Complete DNS validation (add CNAME records to registrars)
- [ ] Confirm both certificates show `Issued` status

### 1.7 — ACM Certificates (us-east-1 — for CloudFront)
- [ ] Request certificate in `us-east-1` for `layne.pleasesendhelp.com`
- [ ] Request certificate in `us-east-1` for `laynehughes.co.nz`
- [ ] Complete DNS validation
- [ ] Confirm both certificates show `Issued` status

### 1.8 — Load Balancers
- [ ] Create ALB `layne-dev-alb`
  - Internet-facing, `ap-southeast-2`, public subnets, `layne-alb-sg`
  - Listener 80 → redirect to 443
  - Listener 443 → forward to target group `layne-dev-tg` (create below)
  - Attach ACM cert for `layne.pleasesendhelp.com`
- [ ] Create target group `layne-dev-tg`
  - Type: IP, Protocol: HTTP, Port: 3000
  - Health check: `GET /api/health`, threshold 2, interval 30s
- [ ] Create ALB `layne-prod-alb` (same config, prod cert)
- [ ] Create target group `layne-prod-tg` (same config)
- [ ] Note both ALB DNS names

### 1.9 — ECS Clusters
- [ ] Create ECS cluster `layne-dev` (Fargate infrastructure)
- [ ] Create ECS cluster `layne-prod` (Fargate infrastructure)
- [ ] Enable CloudWatch Container Insights on both clusters

### 1.10 — CloudWatch Log Groups
- [ ] Create log group `/ecs/layne-dev` (retention: 30 days)
- [ ] Create log group `/ecs/layne-prod` (retention: 90 days)

### 1.11 — CloudFront Distributions
- [ ] Create distribution `layne-dev-cf`
  - Origin: `layne-dev-alb` DNS name, HTTPS only, port 443
  - CNAME: `layne.pleasesendhelp.com`
  - ACM cert: us-east-1 cert for `layne.pleasesendhelp.com`
  - Behaviors: see context doc for `/api/*`, `/_next/static/*`, default
- [ ] Create distribution `layne-prod-cf`
  - Origin: `layne-prod-alb` DNS name, HTTPS only, port 443
  - CNAME: `laynehughes.co.nz`
  - ACM cert: us-east-1 cert for `laynehughes.co.nz`
  - Same behaviors
- [ ] Note both CloudFront domain names (e.g., `xxxxx.cloudfront.net`)

---

## Phase 2: Dockerise the Application

### 2.1 — next.config.ts Update
- [ ] Add `output: 'standalone'` to `next.config.ts`
- [ ] Test local build still works: `npm run build`

### 2.2 — Health Check Endpoint
- [ ] Create `app/api/health/route.ts` returning `{ status: 'ok' }`
- [ ] Test locally: `npm run dev` → `curl http://localhost:3000/api/health`

### 2.3 — Dockerfile
- [ ] Create `Dockerfile` with 3 stages: deps, builder, runner
- [ ] Use `node:22-alpine` as base in runner stage
- [ ] Copy `.next/standalone` and `.next/static` and `public/`
- [ ] Set `NODE_ENV=production`, `PORT=3000`
- [ ] Test locally: `docker build -t layne-test .` && `docker run -p 3000:3000 --env-file .env.local layne-test`
- [ ] Verify `/api/health` returns 200 in container

### 2.4 — .dockerignore
- [ ] Create `.dockerignore` excluding: `.next/`, `node_modules/`, `.env*`, `.git/`, `dev/`, `README.md`

### 2.5 — Image Size Check
- [ ] Confirm built image is < 500MB: `docker images layne-test`

---

## Phase 3: GitHub Actions

### 3.1 — Repository Setup
- [ ] Ensure `dev` branch exists (create from `main` if not)
- [ ] Add GitHub secrets (Settings → Secrets and variables → Actions):
  - `AWS_ACCOUNT_ID`
  - `AWS_REGION` = `ap-southeast-2`
  - `ECR_REPOSITORY` = `layne-website`
  - `DEV_ECS_CLUSTER` = `layne-dev`
  - `DEV_ECS_SERVICE` = `layne-dev-service`
  - `DEV_ECS_TASK_FAMILY` = `layne-dev-task`
  - `PROD_ECS_CLUSTER` = `layne-prod`
  - `PROD_ECS_SERVICE` = `layne-prod-service`
  - `PROD_ECS_TASK_FAMILY` = `layne-prod-task`
  - `GITHUB_ACTIONS_ROLE_ARN` = ARN from 1.2

### 3.2 — CI Workflow
- [ ] Create `.github/workflows/ci.yml`
  - Triggers: `pull_request` targeting `main` or `dev`
  - Steps: checkout, setup Node 22, `npm ci`, lint, typecheck, build
  - Build uses dummy public env vars (no secrets needed for build validation)
- [ ] Test: open a PR and verify checks run

### 3.3 — ECS Task Definitions (Initial)
- [ ] Register initial task definition for `layne-dev-task` in ECS
  - Image: placeholder (will be updated by deploy workflow)
  - CPU: 256, Memory: 512
  - Port: 3000
  - Log config: awslogs → `/ecs/layne-dev`
  - Secrets: reference `layne/dev/app` secret ARN (after Phase 4)
- [ ] Create ECS service `layne-dev-service` on `layne-dev` cluster
  - Launch type: Fargate
  - Task definition: `layne-dev-task`
  - Desired count: 1
  - Network: private subnets, `layne-ecs-sg`
  - Load balancer: `layne-dev-alb`, target group `layne-dev-tg`
  - Deployment: rolling update (min 100%, max 200%)
- [ ] Repeat for prod: `layne-prod-task`, `layne-prod-service`

### 3.4 — Deploy Workflow
- [ ] Create `.github/workflows/deploy.yml`
  - Triggers: `push` to `main` (→ prod) and `dev` (→ dev)
  - Use GitHub Actions OIDC: `aws-actions/configure-aws-credentials@v4`
  - Login to ECR: `aws-actions/amazon-ecr-login@v2`
  - Build and tag image: `{ECR_URI}:dev-{sha}` or `{ECR_URI}:prod-{sha}`
  - Push image
  - Render task definition: `aws-actions/amazon-ecs-render-task-definition@v1`
  - Deploy: `aws-actions/amazon-ecs-deploy-task-definition@v2` with `wait-for-service-stability: true`
  - Smoke test: `curl -f https://{domain}/api/health`
- [ ] Test: push to `dev` branch, verify deployment succeeds

---

## Phase 4: Secrets Management

### 4.1 — Create Secrets in AWS Secrets Manager
- [ ] Create secret `layne/dev/app` (JSON) with all dev environment values
- [ ] Create secret `layne/prod/app` (JSON) with all prod environment values
- [ ] Verify ECS task execution role can read both secrets (test with `aws secretsmanager get-secret-value`)

### 4.2 — Update Task Definitions
- [ ] Update `layne-dev-task` definition to inject secrets from `layne/dev/app`
  - Each key in the JSON secret maps to an individual env var
- [ ] Update `layne-prod-task` definition similarly
- [ ] Redeploy both services to pick up secret injection
- [ ] Verify app starts correctly (check CloudWatch logs)

### 4.3 — GitHub Actions Public Vars
- [ ] Add GitHub Actions environment variables (not secrets) for build-time public vars:
  - `NEXT_PUBLIC_SANITY_PROJECT_ID=hw0zvsfo`
  - `NEXT_PUBLIC_SANITY_DATASET=production`
- [ ] Add per-environment vars:
  - Dev: `NEXT_PUBLIC_SITE_URL=https://layne.pleasesendhelp.com`
  - Prod: `NEXT_PUBLIC_SITE_URL=https://laynehughes.co.nz`

---

## Phase 5: DNS & SSL

### 5.1 — Dev Domain (pleasesendhelp.com)
- [ ] Log into DNS registrar for `pleasesendhelp.com`
- [ ] Add CNAME record: `layne.pleasesendhelp.com` → `{dev-cloudfront-domain}.cloudfront.net`
- [ ] Wait for DNS propagation (up to 48h, usually < 1h)
- [ ] Verify: `curl https://layne.pleasesendhelp.com/api/health`

### 5.2 — Production Domain (laynehughes.co.nz)
- [ ] Log into DNS registrar for `laynehughes.co.nz`
- [ ] Determine if registrar supports ALIAS/ANAME records for root domain
  - If yes: create ALIAS record pointing to CloudFront distribution
  - If no: either migrate DNS to Route 53 (recommended) or use `www.laynehughes.co.nz` CNAME + redirect
- [ ] Add DNS record for `laynehughes.co.nz` → prod CloudFront
- [ ] Wait for propagation
- [ ] Verify: `curl https://laynehughes.co.nz/api/health`

---

## Phase 6: Validation & Monitoring

### 6.1 — Full Smoke Test (Dev)
- [ ] Homepage loads: `https://layne.pleasesendhelp.com`
- [ ] Listings page loads with live data
- [ ] Reviews page loads with live data
- [ ] Contact form submits successfully (check email received)
- [ ] Sanity Studio accessible: `https://layne.pleasesendhelp.com/studio`
- [ ] HTTPS certificate is valid (no browser warnings)

### 6.2 — Full Smoke Test (Prod)
- [ ] All above checks on `https://laynehughes.co.nz`
- [ ] Confirm `NEXT_PUBLIC_SITE_URL` is correct in prod (affects OG tags, sitemaps)

### 6.3 — CloudWatch Alarms
- [ ] Create alarm: ECS CPU > 80% for 5 min → SNS email
- [ ] Create alarm: ALB HTTPCode_Target_5XX_Count > 10 per minute → SNS email
- [ ] Create alarm: ECS RunningTaskCount < 1 → SNS email (critical)
- [ ] Subscribe stu.james@gmail.com to SNS topic

### 6.4 — Deployment Verification
- [ ] Make a test commit to `dev` branch → verify auto-deploys
- [ ] Merge dev → main → verify production auto-deploys
- [ ] Confirm rollback procedure works (update ECS service to previous task def revision)

### 6.5 — Documentation
- [ ] Record all AWS resource IDs/ARNs in `aws-cicd-deployment-context.md`
- [ ] Document rollback procedure
- [ ] Note ECR URI and image tagging convention
