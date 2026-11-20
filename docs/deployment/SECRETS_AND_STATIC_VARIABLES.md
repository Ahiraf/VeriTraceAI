# Cloudflare Pages CD — Secrets and Static Configuration Reference

This document serves as the canonical reference manual for all **Secrets** and **Static Values / Variables** required to deploy the VeriTraceAI frontend (`apps/web`) to Cloudflare Pages via GitHub Actions CD.

---

## 1. Quick Reference Inventory

### A. GitHub Actions Secrets (Sensitive / Encrypted)

| Secret Key | Required | Scope | Cloudflare Equivalent | Description |
| :--- | :---: | :--- | :--- | :--- |
| `CLOUDFLARE_API_TOKEN` | **Yes** | Repository or Environment Secret | Custom API Token (Account.Cloudflare Pages: Edit) | API Bearer token allowing GitHub Actions runner to deploy builds to Cloudflare Pages. |
| `CLOUDFLARE_ACCOUNT_ID` | **Yes** | Repository or Environment Secret | Account ID | 32-character hexadecimal identifier for your Cloudflare organization/account. |

### B. Static Configuration Variables & Parameters

| Variable Key | Required | Default / Fallback | Type | Description |
| :--- | :---: | :--- | :--- | :--- |
| `CLOUDFLARE_PROJECT_NAME` | No | `veritrace-web` | GitHub Variable / Env | The name of the Cloudflare Pages project created in your Cloudflare dashboard. |
| `NEXT_PUBLIC_API_URL` | No | `http://localhost:8000/v1` | GitHub Variable / Input | Base URL for FastAPI backend endpoints (`/cases`, `/evidence`, etc.) baked into static client bundles at build time. |
| `NODE_VERSION` | Constant | `20` | Workflow Constant | Pinned Active LTS Node.js runtime for deterministic build environments. |
| `PNPM_VERSION` | Constant | `9.15.3` | Workflow Constant | Pinned pnpm package manager version (matching `packageManager` in `package.json`). |
| `BUILD_OUTPUT_DIR` | Constant | `apps/web/out` | Workflow Constant | The static artifact directory emitted by Next.js (`output: 'export'`) deployed to Cloudflare Pages. |
| `BUILD_FILTER` | Constant | `--filter web` | Workflow Constant | Turborepo package selector targeting only the frontend and its workspace dependencies (`@veritrace/types`). |

---

## 2. Secrets Deep Dive & Acquisition Guide

### 1. `CLOUDFLARE_API_TOKEN`

#### Purpose
Used by the `cloudflare/wrangler-action@v3` step to authenticate API calls against Cloudflare's v4 API and upload site assets to Cloudflare Pages.

#### Least-Privilege Permission Template
Never use a Global API Key. Always provision a scoped API Token with minimal necessary permissions:

| Permission Category | Resource Target | Access Level |
| :--- | :--- | :--- |
| **Account** | **Cloudflare Pages** | **Edit** |

*(Optional additional permissions if managing custom domains via API: `Zone.DNS: Edit`)*

#### Step-by-Step Acquisition in Cloudflare Dashboard
1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. In the top-right user menu, click **My Profile**.
3. Select **API Tokens** from the left navigation bar (or navigate directly to `https://dash.cloudflare.com/profile/api-tokens`).
4. Click **Create Token**.
5. Scroll down to **Custom Token** and click **Get started**.
6. Configure the token fields:
   - **Token name:** `veritrace-frontend-cd-token`
   - **Permissions:**
     - Select **Account** | **Cloudflare Pages** | **Edit**
   - **Account Resources:**
     - Select **Include** | **All accounts** (or select your specific Cloudflare account)
   - **TTL (Optional):** Set an expiration period according to your organizational key rotation policy (e.g., 90 days or 180 days).
7. Click **Continue to summary**.
8. Click **Create Token**.
9. **Copy the generated token string immediately** (Cloudflare displays this secret only once).

---

### 2. `CLOUDFLARE_ACCOUNT_ID`

#### Purpose
Identifies the Cloudflare tenant account where the Pages project resides.

#### Step-by-Step Acquisition in Cloudflare Dashboard
1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. On the main overview page or in the sidebar, click **Workers & Pages**.
3. Look at the right sidebar of the **Overview** page:
   - Under the section labeled **Account ID**, click **Click to copy** (a 32-character hexadecimal string, e.g., `4a7b9c...f12d`).
4. *Alternative:* Check the browser address bar while viewing your account overview:
   ```
   https://dash.cloudflare.com/<ACCOUNT_ID>/workers-and-pages
   ```
   The string between `dash.cloudflare.com/` and `/workers-and-pages` is your Account ID.

---

## 3. Static Variables & Environment Parameters Deep Dive

### 1. `CLOUDFLARE_PROJECT_NAME`
- **Default:** `veritrace-web`
- **Purpose:** Specifies the target Pages project name in Cloudflare. Wrangler matches this against existing projects in the specified account.
- **Where to configure:**
  - In GitHub: **Settings** → **Secrets and variables** → **Actions** → **Variables** tab → New repository variable `CLOUDFLARE_PROJECT_NAME = veritrace-web`.
  - If omitted in GitHub, the workflow automatically defaults to `veritrace-web`.

### 2. `NEXT_PUBLIC_API_URL`
- **Default:** `http://localhost:8000/v1`
- **Purpose:** Injected into Next.js client bundles during `pnpm --filter web build`. The client API wrapper (`apps/web/src/lib/api-client.ts`) uses this URL when contacting external endpoints.
- **Where to configure:**
  - Can be set as a GitHub Repository Variable (`vars.NEXT_PUBLIC_API_URL`), or overridden manually during a `workflow_dispatch` run via the `api_url` input field.

---

## 4. Configuring GitHub Repository Secrets and Variables

### Adding Secrets in GitHub
1. In your GitHub repository, navigate to **Settings** → **Secrets and variables** → **Actions**.
2. Under the **Repository secrets** section, click **New repository secret**.
3. Create the two required secrets:
   - **Name:** `CLOUDFLARE_API_TOKEN`  
     **Secret:** Paste the Cloudflare API token created in Section 2.1.
   - **Name:** `CLOUDFLARE_ACCOUNT_ID`  
     **Secret:** Paste your Cloudflare Account ID from Section 2.2.
4. Click **Add secret** for each.

### Adding Variables in GitHub
1. Under the **Repository variables** section (click the **Variables** tab), click **New repository variable**.
2. Create optional variables:
   - **Name:** `CLOUDFLARE_PROJECT_NAME`  
     **Value:** `veritrace-web` (or your chosen project name).
   - **Name:** `NEXT_PUBLIC_API_URL`  
     **Value:** `https://api.veritrace.ai/v1` (or your staging/production API domain).
3. Click **Add variable**.

---

## 5. Security Protocols & Token Lifecycle

### Principle of Least Privilege
- The token **only** requires `Account: Cloudflare Pages: Edit`.
- Do not grant `Zone: Edit`, `Account: Read/Edit All`, or superuser roles.
- Never commit `.env`, `.env.local`, or configuration files containing raw tokens.

### Token Rotation Protocol
1. Navigate to Cloudflare Dashboard → **My Profile** → **API Tokens**.
2. Click **Create Token** to generate a replacement token with the same permissions.
3. Update `CLOUDFLARE_API_TOKEN` in GitHub Repository Secrets with the new value.
4. Verify the new token by triggering a manual test deployment (`workflow_dispatch`).
5. Revoke or delete the old token in the Cloudflare Dashboard.
