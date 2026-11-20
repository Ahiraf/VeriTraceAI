# VeriTraceAI — Technical Architecture Plan

> Status: Architecture-complete through [Decision [#80](../adr/10-mvp-simulation/ADR-0080-trimmed-turborepo-pipeline-no-ci-for-this-build.md)](../adr/10-mvp-simulation/ADR-0080-trimmed-turborepo-pipeline-no-ci-for-this-build.md). This document is the single
> narrative entry point into the architecture; it does not duplicate the detailed
> contracts in `BOUNDED_CONTEXTS.md`, `STATE_MACHINE.md`, `C4_DIAGRAMS.md`,
> `FULL_DATABASE_SCHEMA.md`, `API_CONTRACTS.md`, `SECURITY.md`, `UI_ARCHITECTURE.md`,
> `INFRA_DEPLOYMENT.md`, or `DESIGN.md` — it explains how they fit together and why.
> Each section below is intentionally self-contained: you can read §4 without having
> read §3, and §7 without having read §4.

---

## 1. Purpose & Scope

VeriTraceAI is an evidence-grounded AI copilot for KYB/UBO compliance investigation.
It helps a human investigator determine whether a company's *declared* ownership is
*independently corroborated* by registry, sanctions, and document evidence, surfaces
conflicts, and recommends the next human step.

**Architecturally enforced non-goals** (these are not product copy — they are
constraints baked into the state machine and API surface):

| Non-goal | Where it is structurally prevented |
|---|---|
| Not a fraud detector | No `is_fraud` field anywhere in the data model; `Finding` records *discrepancies*, not accusations |
| Not a single risk score | No aggregate score field exists on `Case`; findings are enumerated, not collapsed |
| Not an autonomous decision-maker | `Case.status` cannot reach `Decided` without a human-authored, insert-only `case_decisions` row (Decision [#19](../adr/03-data-modeling/ADR-0019-evidence-source-exclusivity-columns.md)); the state machine has no transition that an agent can fire unattended |

---

## 2. System at a Glance

One FastAPI container (`apps/api`) hosts four internal modules organized by bounded
context, plus one new standalone **Inference Service** container for the custom
GPU model. One Next.js container (`apps/web`) serves the investigator UI. See
`C4_DIAGRAMS.md` for the formal Level 1/2 diagrams — this section is the plain-English
version.

```
┌─────────────────────────────────────────────────────────────────┐
│ apps/web (Next.js, App Router, Serwist PWA)                      │
│   → talks only to apps/api over HTTPS + SSE                      │
└───────────────────────────┬───────────────────────────────────────┘
                            │
┌───────────────────────────▼───────────────────────────────────────┐
│ apps/api (single FastAPI process, 4 internal modules)             │
│   case_evidence/   screening/   intake/   platform/                │
│   shared/  (cross-cutting: auth, db session, problem-details)      │
└──┬────────────┬───────────────┬────────────────┬──────────────────┘
   │             │               │                │
   ▼             ▼               ▼                ▼
Postgres      Neo4j          Redis           Cloudflare R2
(Supabase)   (ownership      (Upstash,       (documents,
 schema per   graph)          rate-limit,     evidence files)
 context)                     idempotency,
                               cache)
   │
   ▼ (async, HTTP)
┌─────────────────────────────────────────────────────────────────┐
│ Inference Service (separate container, GPU)                       │
│   Serves custom-trained model scores (entity-resolution /          │
│   screening confidence). Hosted independently per environment      │
│   — see §6.                                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Module Map

Each bounded context is a Python package under `apps/api/src/`, not a separate
deployable — this is Decision [#7](../adr/02-strategic-design/ADR-0007-entity-person-address-as-shared-reference-data.md)'s single-container, modular-monolith choice.
Modules talk to each other only through explicit internal service interfaces,
never by reaching into another module's ORM models directly.

### 3.1 `case_evidence/` (Core)
- **Owns:** `Entity`, `Person`, `Address`, `OwnershipEdge`, `Evidence`, `Finding`,
  `Case`, `CaseDecision`, `AuditEvent`, `ModelRun`.
- **Does not own:** raw document files (R2), raw screening hits (`screening/`),
  raw uploaded PDFs pre-extraction (`intake/`).
- **Responsibility:** the statechart backbone, evidence reconciliation, finding
  generation, decision recording, audit trail.
- **Talks to:** `screening/` (reads latest screening disposition for the guard
  check at `AnalystReview→Decided`), `intake/` (reads extracted fields as
  candidate `Evidence` rows), Neo4j (ownership graph), Inference Service (requests
  entity-resolution confidence scores).
- **Hosted on:** AWS ECS Fargate (Decision [#66](../adr/09-infrastructure-hosting/ADR-0066-api-hosting-aws-ecs-fargate.md)).

### 3.2 `screening/` (Core)
- **Owns:** `ScreeningRun`, `ScreeningMatch`, `WatchlistSourceSnapshot`,
  `MatchDisposition`.
- **Responsibility:** executes OFAC/OpenSanctions/PEP checks against declared
  entities and persons, records every hit with full snapshot provenance (so a
  later watchlist update never silently rewrites history), and exposes a
  human-reviewable disposition per match.
- **Talks to:** `case_evidence/` (writes the `ScreeningMatch` guard input),
  Inference Service (name-matching confidence scoring for fuzzy hits).
- **Hosted on:** AWS ECS Fargate, same container as `case_evidence/` (same
  process — see §2).

### 3.3 `intake/` (Supporting)
- **Owns:** `Document`, `ExtractionJob`, `ExtractedField`, `DocumentIntegrityCheck`.
- **Responsibility:** document upload lifecycle, OCR/extraction orchestration
  (via Inngest), malware scanning (ClamAV, Decision [#46](../adr/07-security-compliance/ADR-0046-row-level-security-as-the-primary-tenant-isolation-mechanism.md)), promoting extracted
  fields into `case_evidence.evidence` rows once validated.
- **Talks to:** R2 (document storage), ClamAV sidecar, `case_evidence/`
  (evidence promotion).
- **Hosted on:** AWS ECS Fargate, same container.

### 3.4 `platform/` (Generic)
- **Owns:** `Tenant`, `User`, `UserRole` enum, `ErasureRequest`.
- **Responsibility:** tenant isolation primitives (`current_tenant_id()`), RBAC,
  GDPR/PDPA erasure request lifecycle (crypto-shredding of Decision [#14](../adr/02-strategic-design/ADR-0014-field-level-encryption-and-crypto-shredding-scope.md)'s
  encrypted fields).
- **Talks to:** every other module, indirectly, via Postgres RLS policies scoped
  to `platform.current_tenant_id()`.
- **Hosted on:** AWS ECS Fargate, same container.

### 3.5 Inference Service (new, Decisions [#69](../adr/09-infrastructure-hosting/ADR-0069-custom-model-inference-as-a-separate-container-service.md)–[#72](../adr/09-infrastructure-hosting/ADR-0072-production-gpu-hosting-ecs-mixed-capacity-provider-cluster-not-sagemaker-revised.md))
- **Owns:** the self-trained model weights and the inference-serving process.
  Owns no business data — stateless with respect to the domain model.
- **Responsibility:** given an entity/person pair or a fuzzy name match, return a
  confidence score consumed by `case_evidence/` and `screening/` via
  `model_runs.model_task_type`.
- **Does not own:** the decision of what to do with the score — that remains a
  `Finding` for a human to interpret, never an automatic case transition.
- **Talks to:** R2 (loads weights at boot), called synchronously by the API over
  internal HTTPS.
- **Hosted on:** environment-conditional — see §6.

---

## 4. Request Lifecycle Walkthrough (concrete example)

Tracing one investigator action end-to-end shows how the modules above actually
cooperate. Example: an investigator uploads a shareholder register PDF for a case
already in `Resolving`.

1. **Upload.** `apps/web` requests a presigned R2 URL from `intake/`
   (`POST /v1/intake/documents/presign`, Decision [#31](../adr/05-state-machine/ADR-0031-document-lifecycle-states.md)), uploads directly to R2.
2. **Malware scan.** `intake/` triggers an Inngest function that streams the
   object through the ClamAV sidecar; a `DocumentIntegrityCheck` row is written
   (`clean` or `quarantined`).
3. **Extraction.** On `clean`, Inngest triggers OCR/extraction; `ExtractedField`
   rows are written, each pointing back to the source `Document` and a bounding
   box (for the UI's evidence-highlighting view, see `DESIGN.md` §5.3).
4. **Evidence promotion.** `intake/` calls `case_evidence/`'s internal promotion
   service, which validates each `ExtractedField` against the exclusive-arc
   `Evidence` shape (Decision [#16](../adr/03-data-modeling/ADR-0016-soft-state-vs-hard-state.md)) and inserts it.
5. **Resolution.** The `Case`'s `IdentityMatch` parallel region (Decision [#18](../adr/03-data-modeling/ADR-0018-case-status-and-region-status-as-explicit-postgres-enums.md))
   recomputes: for any ambiguous name match, `case_evidence/` calls the
   **Inference Service** for a confidence score, which is stored on a new
   `ModelRun` row (Decision [#21](../adr/03-data-modeling/ADR-0021-timestamps-occurred-at-vs-created-at-distinction.md)) — never silently overwriting the prior run.
6. **Finding generation.** If the new evidence conflicts with previously
   corroborated ownership, a `Finding` is created (Decision [#17](../adr/03-data-modeling/ADR-0017-cases-assigned-investigator-id-created-by-id-as-forward-reference-fks.md)) — not a status
   change, not a score, a discrete, human-readable discrepancy record.
7. **Notification.** An `SSE` event (`finding_created`, Decision [#34](../adr/05-state-machine/ADR-0034-erasure-request-state-machine.md)) pushes to
   any investigator with the case open; no polling.
8. **Human review.** The investigator reviews the `Finding` in the UI's evidence
   comparison layout (`DESIGN.md` §5.2) and either requests more evidence or
   proceeds — the case cannot reach `Decided` without this step (Decision [#19](../adr/03-data-modeling/ADR-0019-evidence-source-exclusivity-columns.md)).

This walkthrough is the canonical reference for "where does X live" questions —
every new feature should be traceable to a step in a lifecycle like this one.

---

## 5. Cross-Cutting Concerns (index, not re-derivation)

| Concern | Mechanism | Full detail |
|---|---|---|
| AuthN/AuthZ | Supabase Auth (Google/Apple OAuth) + JWKS verify + RBAC | `SECURITY.md` §2 |
| Rate limiting | Upstash Redis sliding window + token bucket | `SECURITY.md` §5 |
| Caching | Three-tier Cache-Control + ETag | `API_CONTRACTS.md` §Caching |
| Idempotency | Client header + Inngest-internal | `API_CONTRACTS.md` Decision [#30](../adr/05-state-machine/ADR-0030-finding-lifecycle-states.md) |
| Optimistic concurrency | `version` field on `Case`/`Finding` | `API_CONTRACTS.md` Decision [#29](../adr/05-state-machine/ADR-0029-case-lifecycle-states.md) |
| Audit integrity | Insert-only, no-FK polymorphic `AuditEvent` | `FULL_DATABASE_SCHEMA.md` §4 |
| Tenant isolation | Postgres RLS on `platform.current_tenant_id()` | `FULL_DATABASE_SCHEMA.md` §1 |
| Observability | OTel → Prometheus + Jaeger → Grafana-as-code | `INFRA_DEPLOYMENT.md` §Observability |
| Erasure (GDPR/PDPA) | Crypto-shredding of Decision [#14](../adr/02-strategic-design/ADR-0014-field-level-encryption-and-crypto-shredding-scope.md) fields via `platform.erasure_requests` | `FULL_DATABASE_SCHEMA.md` §3.4 |

---

## 6. Deployment Topology by Environment

| Component | Local dev | Demo / evaluation | Staging | Production |
|---|---|---|---|---|
| `apps/web` | `next dev` | Cloudflare Pages (preview) | Cloudflare Pages | Cloudflare Pages + Workers |
| `apps/api` | docker-compose | — | AWS (OIDC), container | AWS ECS Fargate, ≥2 tasks, ALB |
| **Inference Service (GPU)** | local GPU if available, else mocked | **Hugging Face Spaces + ZeroGPU** (Decision [#70](../adr/09-infrastructure-hosting/ADR-0070-demo-evaluation-hosting-hugging-face-spaces-zerogpu-revised.md)) | AWS ECS, EC2 GPU capacity provider (shared cluster) | AWS ECS, EC2 GPU capacity provider (Decision [#72](../adr/09-infrastructure-hosting/ADR-0072-production-gpu-hosting-ecs-mixed-capacity-provider-cluster-not-sagemaker-revised.md)), same cluster as `apps/api`, different capacity provider |
| Postgres | Supabase CLI | Supabase (shared dev project) | Supabase | Supabase (PITR) |
| Neo4j | `neo4j:5-community` container | Aura Free | Aura | Aura (backups) |
| Redis | `redis:7-alpine` + REST shim | Upstash | Upstash | Upstash |
| Object storage | — (R2 directly) | R2 | R2 | R2 (versioned) |

**Why the Inference Service is never on the same host type as `apps/api`:**
GPU scheduling is a fundamentally different resource shape than the CPU-bound
API process. Coupling them would force the entire API onto GPU-billed instances.
Keeping them as separate task definitions/services (sharing a cluster in staging
and production, Decision [#72](../adr/09-infrastructure-hosting/ADR-0072-production-gpu-hosting-ecs-mixed-capacity-provider-cluster-not-sagemaker-revised.md)) lets each scale independently.

---

## 7. Technology Decision Index

This plan does not re-litigate individual technology choices — see the [Master Architectural Decision Log](../adr/DECISION_LOG.md) and the [ADR Registry](../adr/README.md) for the full rationale trail across Decisions [#1](../adr/01-vision-scope/ADR-0001-product-framing.md)–[#80](../adr/10-mvp-simulation/ADR-0080-trimmed-turborepo-pipeline-no-ci-for-this-build.md).
The condensed shape: **Postgres (Supabase)** for relational/audit data, **Neo4j**
for the ownership graph only, **Redis (Upstash)** for ephemeral state, **R2** for
documents, **Inngest + ARQ** for async orchestration, **FastAPI** monolith for
the API, **Next.js** for the UI, **AWS ECS Fargate/EC2** + **Cloudflare
Pages/Workers** for deployment, **Hugging Face Spaces (ZeroGPU)** for the custom
model demo tier.

---

## 8. Glossary

| Term | Meaning in this system |
|---|---|
| UBO | Ultimate Beneficial Owner — a natural person with controlling interest, possibly through intermediate entities |
| Finding | A discrete, evidence-cited discrepancy between declared and corroborated data — never a score |
| Exclusive arc | A DB pattern where exactly one of several nullable FK columns must be non-null (used for `Evidence`, `OwnershipEdge`) |
| Narrow slice | A deliberately partial schema/feature covering only what's currently needed, with the rest explicitly deferred and logged |
| Model run | A single invocation of any model (LLM narrator or custom Inference Service) with its inputs/outputs recorded for audit |
