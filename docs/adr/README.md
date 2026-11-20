# VeriTraceAI — Architecture Decision Records (ADRs)

Welcome to the Architectural Decision Records (ADR) registry for **VeriTraceAI**.

This directory documents all architecturally significant design, engineering, and protocol decisions made throughout the lifecycle of the system.

---

## 1. Governance & Format

Each decision is captured in a formal Architecture Decision Record adhering to the [Michael Nygard ADR standard](http://thinkrelevance.com/blog/2011/11/15/documenting-architecture-decisions):
- **Title & Numbering:** Sequentially numbered (`ADR-0001`, `ADR-0002`, ...).
- **Status:** `Accepted` (Final), `Provisional`, `Superseded by ADR-XXXX`, or `Deferred`.
- **Context:** The design challenge, constraint, or fork.
- **Decision:** The chosen path, technology, or interface pattern.
- **Rationale:** Technical justification backed by benchmarks, compliance requirements, or operational constraints.
- **Alternatives Rejected:** Counter-options considered and why they were declined.

Decisions are **immutable once logged**. If a subsequent architectural pivot modifies a prior choice, the earlier record is marked `Superseded by ADR-XXXX` with an explanatory addendum, preserving the audit trail of engineering reasoning.

---

## 2. Directory Structure

To maintain clean repository hygiene and adhere to the directory density limits (maximum 12 items per folder), decisions are grouped into focused domain directories:

| Directory | Scope / Domain | ADR Range |
|---|---|---|
| [`01-vision-scope/`](./01-vision-scope/) | Core product framing, primary persona, and explicit non-goals | ADR-0001 – ADR-0004 |
| [`02-strategic-design/`](./02-strategic-design/) | Bounded contexts, tenancy, dual-store graph model, audit logging | ADR-0005 – ADR-0014 |
| [`03-data-modeling/`](./03-data-modeling/) | Primary keys, immutability invariants, exclusive arcs, schema typing | ADR-0015 – ADR-0022 |
| [`04-persistence-storage/`](./04-persistence-storage/) | Platform root schemas, storage key layouts, Redis semantics, async queues | ADR-0023 – ADR-0028 |
| [`05-state-machine/`](./05-state-machine/) | Case, finding, document, and erasure state machines & promotion gates | ADR-0029 – ADR-0035 |
| [`06-api-contracts/`](./06-api-contracts/) | REST protocol, cursor pagination, idempotency keys, RFC 7807, SSE | ADR-0036 – ADR-0045 |
| [`07-security-compliance/`](./07-security-compliance/) | Row-Level Security, crypto-shredding, KMS keys, input sanitization | ADR-0046 – ADR-0055 |
| [`08-frontend-ui/`](./08-frontend-ui/) | Next.js, state separation, color semantics, typography split, motion | ADR-0056 – ADR-0063 |
| [`09-infrastructure-hosting/`](./09-infrastructure-hosting/) | Turborepo, ECS Fargate, ZeroGPU inference, CI/CD with OIDC | ADR-0064 – ADR-0075 |
| [`10-mvp-simulation/`](./10-mvp-simulation/) | Simulation boundary, in-memory state, deterministic fixtures | ADR-0076 – ADR-0080 |

> For the chronological, unified journal containing all decision records in one place, see [`DECISION_LOG.md`](./DECISION_LOG.md).

---

## 3. Master Architecture Decision Registry

| ID | Title | Domain / Category | Status |
|---|---|---|---|
| [`ADR-0001`](./01-vision-scope/ADR-0001-product-framing.md) | Product framing | Phase 1 | `Final.` |
| [`ADR-0002`](./01-vision-scope/ADR-0002-explicit-non-goals.md) | Explicit non-goals | Phase 1 | `Final.` |
| [`ADR-0003`](./01-vision-scope/ADR-0003-primary-user.md) | Primary user | Phase 1 | `Final.` |
| [`ADR-0004`](./01-vision-scope/ADR-0004-build-philosophy-standing-operating-mode.md) | Build philosophy / standing operating mode | Phase 1 | `Final — governs all decisions from #5 onward.

---` |
| [`ADR-0005`](./02-strategic-design/ADR-0005-bounded-context-split.md) | Bounded context split | Phase 2 | `Final.` |
| [`ADR-0006`](./02-strategic-design/ADR-0006-multi-tenancy-model.md) | Multi-tenancy model | Phase 2 | `Final.` |
| [`ADR-0007`](./02-strategic-design/ADR-0007-entity-person-address-as-shared-reference-data.md) | Entity/Person/Address as shared reference data | Phase 2 | `Final.` |
| [`ADR-0008`](./02-strategic-design/ADR-0008-ownership-representation-relational-graph-dual-store.md) | Ownership representation: relational + graph, dual-store | Phase 2 | `Final.` |
| [`ADR-0009`](./02-strategic-design/ADR-0009-exclusive-arc-sourcing-for-ownership-edges-and-evidence.md) | Exclusive-arc sourcing for ownership edges and evidence | Phase 2 | `Final.` |
| [`ADR-0010`](./02-strategic-design/ADR-0010-findings-as-the-atomic-unit-of-something-worth-a-human-look.md) | Findings as the atomic unit of "something worth a human look" | Phase 2 | `Final.` |
| [`ADR-0011`](./02-strategic-design/ADR-0011-case-as-the-unit-of-work-not-the-unit-of-evidence.md) | Case as the unit of work, not the unit of evidence | Phase 2 | `Final.` |
| [`ADR-0012`](./02-strategic-design/ADR-0012-audit-trail-as-a-first-class-partitioned-table.md) | Audit trail as a first-class, partitioned table | Phase 2 | `Final.` |
| [`ADR-0013`](./02-strategic-design/ADR-0013-model-runs-as-the-seam-between-the-domain-and-any-ai-ml-component.md) | model_runs as the seam between the domain and any AI/ML component | Phase 2 | `Final.

---` |
| [`ADR-0014`](./02-strategic-design/ADR-0014-field-level-encryption-and-crypto-shredding-scope.md) | Field-level encryption and crypto-shredding scope | Phase 2 | `Final — downstream `erasure_requests` table (#74) implements the request/fulfillment workflow for this decision.` |
| [`ADR-0015`](./03-data-modeling/ADR-0015-primary-key-strategy.md) | Primary key strategy | Phase 3 | `Final.` |
| [`ADR-0016`](./03-data-modeling/ADR-0016-soft-state-vs-hard-state.md) | Soft state vs. hard state | Phase 3 | `Final.` |
| [`ADR-0017`](./03-data-modeling/ADR-0017-cases-assigned-investigator-id-created-by-id-as-forward-reference-fks.md) | cases.assigned_investigator_id / created_by_id as forward-reference FKs | Phase 3 | `Final.` |
| [`ADR-0018`](./03-data-modeling/ADR-0018-case-status-and-region-status-as-explicit-postgres-enums.md) | case_status and region_status as explicit Postgres enums | Phase 3 | `Final.` |
| [`ADR-0019`](./03-data-modeling/ADR-0019-evidence-source-exclusivity-columns.md) | Evidence source exclusivity columns | Phase 3 | `Final.` |
| [`ADR-0020`](./03-data-modeling/ADR-0020-jurisdiction-region-as-a-first-class-dimension-not-metadata.md) | Jurisdiction/region as a first-class dimension, not metadata | Phase 3 | `Final.` |
| [`ADR-0021`](./03-data-modeling/ADR-0021-timestamps-occurred-at-vs-created-at-distinction.md) | Timestamps: occurred_at vs. created_at distinction | Phase 3 | `Final.` |
| [`ADR-0022`](./03-data-modeling/ADR-0022-no-soft-is-deleted-flags.md) | No soft "is_deleted" flags | Phase 3 | `Final.` |
| [`ADR-0023`](./04-persistence-storage/ADR-0023-tenants-and-users-as-the-root-of-platform-schema.md) | tenants and users as the root of platform schema | Phase 3 | `Final.` |
| [`ADR-0024`](./04-persistence-storage/ADR-0024-role-model-coarse-roles-fine-permissions-deferred.md) | Role model: coarse roles, fine permissions deferred | Phase 3 | `Final (subject to revisit if a real need emerges).` |
| [`ADR-0025`](./04-persistence-storage/ADR-0025-object-storage-key-structure.md) | Object storage key structure | Phase 3 | `Final.` |
| [`ADR-0026`](./04-persistence-storage/ADR-0026-redis-as-ephemeral-only-never-system-of-record.md) | Redis as ephemeral-only, never system-of-record | Phase 3 | `Final.` |
| [`ADR-0027`](./04-persistence-storage/ADR-0027-message-async-processing-inngest-arq-rabbitmq-kafka-dropped.md) | Message/async processing: Inngest + ARQ, RabbitMQ/Kafka dropped | Phase 3 | `Final.` |
| [`ADR-0028`](./04-persistence-storage/ADR-0028-email-resend-fastapi-mail-mailhog.md) | Email: Resend + fastapi-mail + MailHog | Phase 3 | `Final.

---` |
| [`ADR-0029`](./05-state-machine/ADR-0029-case-lifecycle-states.md) | Case lifecycle states | Phase 4 | `Final.` |
| [`ADR-0030`](./05-state-machine/ADR-0030-finding-lifecycle-states.md) | Finding lifecycle states | Phase 4 | `Final.` |
| [`ADR-0031`](./05-state-machine/ADR-0031-document-lifecycle-states.md) | Document lifecycle states | Phase 4 | `Final.` |
| [`ADR-0032`](./05-state-machine/ADR-0032-extraction-promotion-gate.md) | Extraction promotion gate | Phase 4 | `Final.` |
| [`ADR-0033`](./05-state-machine/ADR-0033-screening-match-disposition-as-append-only-history.md) | Screening match disposition as append-only history | Phase 4 | `Final.` |
| [`ADR-0034`](./05-state-machine/ADR-0034-erasure-request-state-machine.md) | Erasure request state machine | Phase 4 | `Final.` |
| [`ADR-0035`](./05-state-machine/ADR-0035-model-run-status-is-implicit-not-enumerated.md) | Model run status is implicit, not enumerated | Phase 4 | `Final.

---` |
| [`ADR-0036`](./06-api-contracts/ADR-0036-api-style-rest-over-openapi-no-graphql.md) | API style: REST over OpenAPI, no GraphQL | Phase 5 | `Final.` |
| [`ADR-0037`](./06-api-contracts/ADR-0037-versioning-strategy.md) | Versioning strategy | Phase 5 | `Final.` |
| [`ADR-0038`](./06-api-contracts/ADR-0038-pagination-cursor-based-not-offset.md) | Pagination: cursor-based, not offset | Phase 5 | `Final.` |
| [`ADR-0039`](./06-api-contracts/ADR-0039-idempotency-for-mutating-endpoints.md) | Idempotency for mutating endpoints | Phase 5 | `Final.` |
| [`ADR-0040`](./06-api-contracts/ADR-0040-error-shape.md) | Error shape | Phase 5 | `Final.` |
| [`ADR-0041`](./06-api-contracts/ADR-0041-server-sent-events-for-narrative-streaming.md) | Server-Sent Events for narrative streaming | Phase 5 | `Final.` |
| [`ADR-0042`](./06-api-contracts/ADR-0042-bulk-operations-deferred.md) | Bulk operations deferred | Phase 5 | `Final (subject to revisit).` |
| [`ADR-0043`](./06-api-contracts/ADR-0043-authentication-supabase-issued-jwt-verified-at-the-api.md) | Authentication: Supabase-issued JWT, verified at the API | Phase 5 | `Final.` |
| [`ADR-0044`](./06-api-contracts/ADR-0044-rate-limiting-at-the-api-layer.md) | Rate limiting at the API layer | Phase 5 | `Final.` |
| [`ADR-0045`](./06-api-contracts/ADR-0045-typed-client-generation-for-the-frontend.md) | Typed client generation for the frontend | Phase 5 | `Final.

---` |
| [`ADR-0046`](./07-security-compliance/ADR-0046-row-level-security-as-the-primary-tenant-isolation-mechanism.md) | Row-Level Security as the primary tenant isolation mechanism | Phase 6 | `Final.` |
| [`ADR-0047`](./07-security-compliance/ADR-0047-secrets-management.md) | Secrets management | Phase 6 | `Final (subject to revisit if compliance requirements demand a dedicated secrets manager).
*(Cross-reference: INFRA_DEPLOYMENT.md, 3 GitHub Environments.)*` |
| [`ADR-0048`](./07-security-compliance/ADR-0048-audit-event-immutability-enforcement.md) | Audit event immutability enforcement | Phase 6 | `Final.` |
| [`ADR-0049`](./07-security-compliance/ADR-0049-encryption-key-management-for-crypto-shredding.md) | Encryption key management for crypto-shredding | Phase 6 | `Final.` |
| [`ADR-0050`](./07-security-compliance/ADR-0050-input-validation-and-file-upload-safety.md) | Input validation and file-upload safety | Phase 6 | `Final.` |
| [`ADR-0051`](./07-security-compliance/ADR-0051-csrf-protection-scope.md) | CSRF protection scope | Phase 6 | `Final.` |
| [`ADR-0052`](./07-security-compliance/ADR-0052-login-brute-force-handling.md) | Login brute-force handling | Phase 6 | `Final. *(Resolves the previously "pending/deferred" login-brute-force item noted in earlier sessions.)*` |
| [`ADR-0053`](./07-security-compliance/ADR-0053-data-residency-region-pinning.md) | Data residency / region pinning | Phase 6 | `Provisional / explicitly deferred.` |
| [`ADR-0054`](./07-security-compliance/ADR-0054-secrets-pii-never-logged.md) | Secrets/PII never logged | Phase 6 | `Final.` |
| [`ADR-0055`](./07-security-compliance/ADR-0055-dependency-and-container-scanning.md) | Dependency and container scanning | Phase 6 | `Final.

---` |
| [`ADR-0056`](./08-frontend-ui/ADR-0056-framework-and-core-libraries.md) | Framework and core libraries | Phase 7 | `Final.` |
| [`ADR-0057`](./08-frontend-ui/ADR-0057-pwa-layer-serwist-not-vite-pwa.md) | PWA layer: Serwist, not vite-pwa | Phase 7 | `Final.` |
| [`ADR-0058`](./08-frontend-ui/ADR-0058-theming-next-themes.md) | Theming: next-themes | Phase 7 | `Final.` |
| [`ADR-0059`](./08-frontend-ui/ADR-0059-hosting-cloudflare-pages-workers.md) | Hosting: Cloudflare Pages + Workers | Phase 7 | `Final (Workers' role narrowed by #71).` |
| [`ADR-0060`](./08-frontend-ui/ADR-0060-design-principles-priority-ordered.md) | Design principles (priority-ordered) | Phase 7 | `Final.` |
| [`ADR-0061`](./08-frontend-ui/ADR-0061-color-semantics-amber-for-findings-not-red.md) | Color semantics: amber for findings, not red | Phase 7 | `Final. *(All palette tokens WCAG 2.1 AA contrast-verified in both light and dark themes.)*` |
| [`ADR-0062`](./08-frontend-ui/ADR-0062-typography-inter-ibm-plex-mono-purposefully-split.md) | Typography: Inter + IBM Plex Mono, purposefully split | Phase 7 | `Final.` |
| [`ADR-0063`](./08-frontend-ui/ADR-0063-motion-scoped-to-panel-transitions-one-deliberate-exception.md) | Motion: scoped to panel transitions, one deliberate exception | Phase 7 | `Final.

---` |
| [`ADR-0064`](./09-infrastructure-hosting/ADR-0064-monorepo-tooling-turborepo-pnpm.md) | Monorepo tooling: Turborepo + pnpm | Phase 8 | `Final.` |
| [`ADR-0065`](./09-infrastructure-hosting/ADR-0065-testing-stack-vitest-pytest-playwright.md) | Testing stack: Vitest + pytest + Playwright | Phase 8 | `Final.` |
| [`ADR-0066`](./09-infrastructure-hosting/ADR-0066-api-hosting-aws-ecs-fargate.md) | API hosting: AWS ECS Fargate | Phase 8 | `Final. *(Extended, not replaced, by Decision #72 for GPU workloads — API remains on Fargate; only the Inference Service moves to an EC2 GPU capacity provider in the same cluster.)*` |
| [`ADR-0067`](./09-infrastructure-hosting/ADR-0067-ci-cd-github-actions-3-environments-oidc-no-long-lived-cloud-credentials.md) | CI/CD: GitHub Actions, 3 Environments, OIDC (no long-lived cloud credentials) | Phase 8 | `Final.` |
| [`ADR-0068`](./09-infrastructure-hosting/ADR-0068-local-development-dual-docker-compose-stacks.md) | Local development: dual Docker Compose stacks | Phase 8 | `Final. *(Note: superseded in scope — not in correctness — by the MVP Simulation Build in Phase 9, which explicitly runs without Docker; this decision remains the standard for the full-architecture build path.)*

---` |
| [`ADR-0069`](./09-infrastructure-hosting/ADR-0069-custom-model-inference-as-a-separate-container-service.md) | Custom model inference as a separate container/service | Phase 8 | `Final. *(Originally logged provisional-CPU; confirmed GPU-requiring by user correction — see #70.)*` |
| [`ADR-0070`](./09-infrastructure-hosting/ADR-0070-demo-evaluation-hosting-hugging-face-spaces-zerogpu-revised.md) | Demo/evaluation hosting: Hugging Face Spaces + ZeroGPU (revised) | Phase 8 | `Final (revised from an earlier CPU-only provisional form of this decision).` |
| [`ADR-0071`](./09-infrastructure-hosting/ADR-0071-cloudflare-workers-rejected-as-backend-inference-host-revised.md) | Cloudflare Workers rejected as backend/Inference host (revised) | Phase 8 | `Final (revised; conclusion unchanged by the background/backend correction, but the reasoning was re-verified against the GPU requirement specifically).` |
| [`ADR-0072`](./09-infrastructure-hosting/ADR-0072-production-gpu-hosting-ecs-mixed-capacity-provider-cluster-not-sagemaker-revised.md) | Production GPU hosting: ECS mixed-capacity-provider cluster, not SageMaker (revised) | Phase 8 | `Final (revised from an initial Fargate-only assumption once the GPU requirement was confirmed).` |
| [`ADR-0073`](./09-infrastructure-hosting/ADR-0073-full-screening-schema.md) | Full screening schema | Phase 8 | `Final.` |
| [`ADR-0074`](./09-infrastructure-hosting/ADR-0074-full-platform-schema-including-erasure-requests.md) | Full platform schema including erasure_requests | Phase 8 | `Final.` |
| [`ADR-0075`](./09-infrastructure-hosting/ADR-0075-full-intake-schema.md) | Full intake schema | Phase 8 | `Final.

---` |
| [`ADR-0076`](./10-mvp-simulation/ADR-0076-in-memory-state-no-database.md) | In-memory state, no database | Phase 9 | `Final (scoped to Phase 9 only).` |
| [`ADR-0077`](./10-mvp-simulation/ADR-0077-hand-authored-fixture-data.md) | Hand-authored fixture data | Phase 9 | `Final (scoped to Phase 9 only).` |
| [`ADR-0078`](./10-mvp-simulation/ADR-0078-single-swappable-api-client-boundary.md) | Single swappable API-client boundary | Phase 9 | `Final (scoped to Phase 9, but the boundary itself is a durable pattern retained into the full build).` |
| [`ADR-0079`](./10-mvp-simulation/ADR-0079-shared-state-machine-logic-simulation-matches-real-rules.md) | Shared state-machine logic, simulation matches real rules | Phase 9 | `Final (scoped to Phase 9, logic intended to be ported forward, not replaced, when the real backend is introduced).` |
| [`ADR-0080`](./10-mvp-simulation/ADR-0080-trimmed-turborepo-pipeline-no-ci-for-this-build.md) | Trimmed Turborepo pipeline, no CI for this build | Phase 9 | `Final (scoped to Phase 9 only).

---` |

---

## 4. Pending & Deferred Decisions

| Topic | Status | Notes |
|---|---|---|
| **LLM Provider Default** (Anthropic Claude primary, OpenAI fallback behind `LLMClient`) | Provisional | Defaulting to Claude 3.5 Sonnet; configurable via provider abstraction. |
| **Data Residency / Multi-Region Pinning** (ADR-0053) | Deferred | Single-region baseline; multi-region deferred until jurisdictional mandate. |
| **Fine-Grained Permissions / ABAC** (ADR-0024) | Deferred | Coarse `user_role` enum is sufficient for initial operational roles. |
| **Bulk Case / Finding Mutations** (ADR-0042) | Deferred | All mutations remain single-resource to preserve strict audit attribution. |
| **Dedicated Enterprise Secrets Manager** (ADR-0047) | Deferred | GitHub Environment secrets and runtime injection fulfill initial posture. |

---

## 5. Cross-Reference Navigation

- [System Architecture Plan](../architecture/ARCHITECTURE.md)
- [Bounded Context Specifications](../architecture/BOUNDED_CONTEXTS.md)
- [Database Schema & Constraints](../database/DATABASE.md)
- [Domain Data Model](../specifications/DATA_MODEL.md)
- [Finite State Machine Engine](../specifications/STATE_MACHINE.md)
- [API Contracts & Wire Protocol](../specifications/API_CONTRACTS.md)
- [Security & Compliance Posture](../specifications/SECURITY.md)
- [Infrastructure & Deployment Pipeline](../specifications/INFRA_DEPLOYMENT.md)
