# Cloudflare Pages Frontend CD — Step-by-Step Tutorial & Operations Guide

This step-by-step tutorial guides you through configuring, validating, and running the Continuous Deployment (CD) pipeline to deploy the VeriTraceAI frontend (`apps/web`) to **Cloudflare Pages** using GitHub Actions.

---

## Architecture Overview

```
┌──────────────────────────┐      pnpm build       ┌────────────────────────┐
│  Next.js 15 (apps/web)   │  ──────────────────>  │  apps/web/out (Static) │
└──────────────────────────┘                       └───────────┬────────────┘
                                                               │
                                                               │ cloudflare/wrangler-action@v3
                                                               ▼
┌──────────────────────────┐                      ┌─────────────────────────┐
│ GitHub Actions CD Runner │  ──────────────────> │ Cloudflare Edge Network │
│ (.github/workflows/...)  │                      │ (*.pages.dev / Custom)  │
└──────────────────────────┘                      └─────────────────────────┘
```

The VeriTraceAI presentation layer is an interactive, client-side compliance simulation shell. Compiling with Next.js static export (`output: 'export'`) emits pure pre-rendered HTML, JavaScript, and CSS assets into `apps/web/out`. Cloudflare Pages serves these assets globally across Cloudflare's edge data centers with zero container cold starts and minimal operational cost.

---

## Prerequisites

Before beginning, ensure you have:
1. A **Cloudflare account** (free tier or enterprise).
2. Admin permissions on your **GitHub repository** (to configure Secrets and Variables).
3. Local development environment with `node >= 20` and `pnpm >= 9.15.3`.

---

## Step 1: Create the Cloudflare Pages Project

1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. In the left navigation menu, navigate to **Compute (Workers) > Workers & Pages**.
3. Click the **Create** button (or **Create application**).
4. Select the **Pages** tab.
5. Click **Upload assets** (Direct Upload).
   > *Note:* We deploy via GitHub Actions and the Wrangler CLI, so we use Direct Upload rather than connecting Git directly in the Cloudflare UI.
6. Enter the **Project name**:
   ```
   veritrace-web
   ```
7. Click **Create project**.
8. Cloudflare will prompt you to upload assets for your first deployment. You can upload a placeholder or proceed immediately to API token creation.

---

## Step 2: Retrieve Account ID and Generate Scoped API Token

Follow the detailed guide in [SECRETS_AND_STATIC_VARIABLES.md](file:///home/galib/MY_WORKSPACE/ai-congress/VeriTraceAI/docs/deployment/SECRETS_AND_STATIC_VARIABLES.md) or follow these quick steps:

### 2.1 Copy Account ID
1. In Cloudflare Dashboard, go to **Compute (Workers) > Workers & Pages**.
2. Locate the **Account ID** in the right-hand panel and click **Click to copy**. Save this value.

### 2.2 Create API Token
1. Go to **My Profile** (top-right avatar) > **API Tokens**.
2. Click **Create Token** > find **Custom Token** > click **Get started**.
3. Name: `veritrace-github-cd-token`.
4. Permissions:
   - **Account** | **Cloudflare Pages** | **Edit**
5. Account Resources:
   - **Include** | Select your Cloudflare Account.
6. Click **Continue to summary** > **Create Token**.
7. Copy the token string immediately.

---

## Step 3: Configure GitHub Repository Secrets & Variables

In your GitHub repository:
1. Go to **Settings** > **Secrets and variables** > **Actions**.

### 3.1 Add Secrets
Under **Repository secrets**, click **New repository secret** and add:
- `CLOUDFLARE_API_TOKEN`: Paste your Cloudflare API token.
- `CLOUDFLARE_ACCOUNT_ID`: Paste your 32-character Account ID.

### 3.2 Add Variables (Optional but Recommended)
Click the **Variables** tab > **New repository variable** and add:
- `CLOUDFLARE_PROJECT_NAME`: `veritrace-web` (matches your Cloudflare project name).
- `NEXT_PUBLIC_API_URL`: Your backend API endpoint (e.g. `https://api.veritrace.ai/v1` or `http://localhost:8000/v1`).

---

## Step 4: Verify Local Build and Output

Before deploying from CI, test the static export locally to verify that all routes pre-render properly:

```bash
# 1. Build the frontend workspace
pnpm --filter web build

# 2. Check the output directory
ls -lh apps/web/out

# Expected output includes:
# - index.html
# - cases.html
# - cases/case_001.html
# - cases/case_001/documents/doc_001.html
# - 404.html
# - _next/
```

### Optional: Test Locally with Wrangler
You can preview the exact static distribution using Cloudflare's local runtime emulator:

```bash
npx wrangler pages dev apps/web/out --port 8788
```
Open `http://localhost:8788` in your browser to verify that routes and assets load properly.

---

## Step 5: Trigger Deployment via GitHub Actions

The workflow file `.github/workflows/deploy-frontend-cloudflare.yml` supports two deployment mechanisms:

### Method A: Automated Push Trigger
Pushing any commit to `main` that touches frontend files will automatically trigger the deployment:
```bash
git push origin main
```
The workflow path filters ensure that changes to `apps/web/**` or workspace types automatically start the deployment.

### Method B: Manual Dispatch (Recommended for Initial Setup)
1. In your GitHub repository, click the **Actions** tab.
2. In the left workflow list, select **Deploy Frontend to Cloudflare Pages**.
3. Click the **Run workflow** dropdown on the right.
4. Select:
   - **Branch:** `main`
   - **Target Deployment Environment:** `production`
   - **Optional API URL Override:** (Leave blank for default)
5. Click the green **Run workflow** button.

---

## Step 6: Verify Deployment on Cloudflare Edge

1. Monitor the GitHub Action execution. Once the job succeeds, inspect the **Publish Deployment Summary** step in the action run summary.
2. Open the Cloudflare Dashboard:
   - Navigate to **Workers & Pages > veritrace-web**.
   - Your latest deployment appears under **All deployments** with a green **Success** badge.
3. Click the deployment URL (e.g., `https://<hash>.veritrace-web.pages.dev` or `https://veritrace-web.pages.dev`).
4. Validate that the application loads and navigate across routes:
   - `/` (Landing page)
   - `/cases` (Case queue)
   - `/cases/case_001` (Case detail investigation view)
   - `/documents` (Document repository)
   - `/features` & `/pricing`

---

## Step 7: Custom Domain Setup (Production)

To attach your custom domain (e.g., `app.veritrace.ai`):
1. In Cloudflare Dashboard, open **Workers & Pages > veritrace-web**.
2. Click the **Custom domains** tab.
3. Click **Set up a custom domain**.
4. Enter your domain: `app.veritrace.ai`.
5. Cloudflare will automatically configure the DNS CNAME record and issue an edge SSL/TLS certificate.
6. Once active, the status updates to **Active** and all traffic routes securely through Cloudflare.

---

## Step 8: Operational Management & Rollbacks

### Instant Rollbacks
Cloudflare Pages maintains an immutable archive of all past deployments:
1. In Cloudflare Dashboard, navigate to **Workers & Pages > veritrace-web**.
2. In the deployment list, find the previous stable deployment.
3. Click the three dots (`...`) next to the deployment and select **Rollback to this deployment**.
4. Cloudflare instantly repoints traffic to that build with zero downtime.

### Build and Deployment Troubleshooting

| Symptom | Cause | Solution |
| :--- | :--- | :--- |
| `Error: Project not found` | The `CLOUDFLARE_PROJECT_NAME` does not match the project in Cloudflare. | Ensure the project name in Cloudflare matches `vars.CLOUDFLARE_PROJECT_NAME` (default `veritrace-web`). |
| `Authentication error (code: 10000)` | Invalid or expired `CLOUDFLARE_API_TOKEN`. | Re-generate the token with `Account: Cloudflare Pages: Edit` and update GitHub Secret. |
| `Cannot use both "use client" and generateStaticParams` | Next.js App Router restriction on client components. | Keep `generateStaticParams` in a Server Component `page.tsx` that wraps the client component. |
| `ERR_PNPM_ADDING_TO_ROOT` | `wrangler-action` dynamically trying to run `pnpm add wrangler` in a monorepo. | Pre-install `wrangler` in root `devDependencies` and keep `.npmrc` with `ignore-workspace-root-check=true`. |
| `404 on page refresh on sub-routes` | Missing static pre-rendering or SPA fallback. | Check that `apps/web/out` contains pre-rendered HTML files or a fallback `404.html`. |
