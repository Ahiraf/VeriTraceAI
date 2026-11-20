# VeriTraceAI — Infrastructure & Deployment Topology

> Environments, container configurations, and cloud deployment pipelines.
> Enforces [Decision [#59](../adr/08-frontend-ui/ADR-0059-hosting-cloudflare-pages-workers.md)](../adr/08-frontend-ui/ADR-0059-hosting-cloudflare-pages-workers.md), [#66](../adr/09-infrastructure-hosting/ADR-0066-api-hosting-aws-ecs-fargate.md), [#67](../adr/09-infrastructure-hosting/ADR-0067-ci-cd-github-actions-3-environments-oidc-no-long-lived-cloud-credentials.md), [#70](../adr/09-infrastructure-hosting/ADR-0070-demo-evaluation-hosting-hugging-face-spaces-zerogpu-revised.md), and [#72](../adr/09-infrastructure-hosting/ADR-0072-production-gpu-hosting-ecs-mixed-capacity-provider-cluster-not-sagemaker-revised.md).

---

## 1. Environment Topology

```
┌────────────────────────────────────────────────────────────────────────┐
│                          DEMO & EVALUATION TIER                        │
├──────────────────────────┬──────────────────────┬──────────────────────┤
│ Frontend (apps/web)      │ API Backend          │ Inference Service    │
│ Cloudflare Pages Preview │ Localhost / ECS Test │ HF Spaces (ZeroGPU)  │
└──────────────────────────┴──────────────────────┴──────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│                         PRODUCTION AWS TOPOLOGY                        │
├────────────────────────────────────────────────────────────────────────┤
│ ALB (HTTPS 443) -> TLS Termination & OTel Instrumentation             │
│                                                                        │
│ ECS Cluster (VPC Private Subnets)                                      │
│   ├── Fargate Task: `apps/api` (FastAPI Monolith, ≥2 instances)       │
│   └── EC2 GPU Task (`g5.xlarge`): `inference-service` (Custom Model)   │
│                                                                        │
│ Managed Backends:                                                      │
│   ├── Supabase PostgreSQL (Multi-AZ, PITR Enabled)                     │
│   ├── Neo4j Aura Graph Instance (Encrypted Bolt connection)            │
│   ├── Upstash Serverless Redis (Token bucket & idempotency)            │
│   └── Cloudflare R2 (Encrypted object storage via S3 API)              │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. CI/CD Deployment with GitHub Actions & OIDC

Deployments avoid long-lived cloud credentials using GitHub Actions OIDC federation:

1. GitHub Action exchanges short-lived JWT with AWS STS (`sts:AssumeRoleWithWebIdentity`).
2. Scoped IAM role grants container push permissions to AWS ECR and service update on ECS.
3. Protected environments (`development`, `staging`, `production`) enforce mandatory reviewer approvals prior to production rolling deploys.
