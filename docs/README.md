# VeriTraceAI — Architecture & Technical Documentation

Welcome to the engineering documentation for **VeriTraceAI** — an evidence-grounded AI copilot for KYB (Know Your Business) and UBO (Ultimate Beneficial Owner) compliance investigations.

---

## 1. Documentation Index

The documentation suite is structured into specialized directories covering design, governance, data persistence, and protocol specifications:

```
docs/
├── README.md                      # Documentation root and index (this document)
├── architecture/                  # High-level architecture and system topologies
│   ├── ARCHITECTURE.md            # Master technical architecture plan
│   ├── BOUNDED_CONTEXTS.md        # Domain boundary mapping and context invariants
│   └── C4_DIAGRAMS.md             # C4 Context, Container, and Component diagrams
├── adr/                           # Architecture Decision Records (immutable records)
│   ├── README.md                  # ADR index, governance, and full decision registry
│   ├── DECISION_LOG.md            # Authoritative cumulative decision journal (Decisions #1–#80)
│   ├── 01-vision-scope/           # Vision, scope, personas, and non-goals
│   ├── 02-strategic-design/       # Bounded contexts, tenancy, and dual-store graph
│   ├── 03-data-modeling/          # Primary keys, mutability, and exclusive arcs
│   ├── 04-persistence-storage/    # Root schemas, object storage, and Redis tiers
│   ├── 05-state-machine/          # Lifecycles for cases, findings, and documents
│   ├── 06-api-contracts/          # REST standards, RFC 7807, SSE, and pagination
│   ├── 07-security-compliance/    # RLS isolation, KMS crypto-shredding, and audits
│   ├── 08-frontend-ui/            # Next.js, state split, color tokens, typography
│   ├── 09-infrastructure-hosting/ # Monorepo, ECS Fargate, ZeroGPU, and OIDC CI
│   └── 10-mvp-simulation/         # Simulation boundaries and deterministic fixtures
├── database/                      # Executable database schema and query blueprints
│   └── DATABASE.md                # PostgreSQL DDL, Neo4j projections, Redis namespaces
└── specifications/                # Protocol and subsystem specifications
    ├── API_CONTRACTS.md           # Wire protocols, HTTP contracts, and SSE formats
    ├── DATA_MODEL.md              # Domain entity models and graph projection contracts
    ├── INFRA_DEPLOYMENT.md        # Environment topology and CI/CD pipelines
    ├── SECURITY.md                # Threat modeling, RLS policies, and crypto-shredding
    └── STATE_MACHINE.md           # Deterministic finite state machine transitions
```

---

## 2. Core Architectural Pillars

1. **Evidence-Before-Conclusion**: Every assertion, finding, and reconciliation is anchored to an immutable, source-verified evidentiary artifact ([ADR-0001](adr/01-vision-scope/ADR-0001-product-framing.md), [ADR-0009](adr/02-strategic-design/ADR-0009-exclusive-arc-sourcing-for-ownership-edges-and-evidence.md)).
2. **Explicit Non-Goals**: VeriTraceAI is not an autonomous decision-maker, not a black-box fraud detector, and does not generate aggregate risk scores ([ADR-0002](adr/01-vision-scope/ADR-0002-explicit-non-goals.md)). Every state-altering resolution requires a human investigator's explicit attribution and written rationale.
3. **Dual-Store Ownership Graph**: High-integrity transactional consistency and RLS are enforced via PostgreSQL, while complex ownership cycles and multi-hop shell corporate structures are traversed via Neo4j ([ADR-0008](adr/02-strategic-design/ADR-0008-ownership-representation-relational-graph-dual-store.md)).
4. **Append-Only Auditing & Crypto-Shredding**: Compliance-grade audit trails are insert-only and partitioned by time ([ADR-0012](adr/02-strategic-design/ADR-0012-audit-trail-as-a-first-class-partitioned-table.md)). GDPR/PDPA "Right to Erasure" is fulfilled via KMS key destruction (crypto-shredding) of narrow PII fields without corrupting the historical evidentiary integrity of cases ([ADR-0014](adr/02-strategic-design/ADR-0014-field-level-encryption-and-crypto-shredding-scope.md), [ADR-0049](adr/07-security-compliance/ADR-0049-encryption-key-management-for-crypto-shredding.md)).
5. **Calm, Dense UI**: Interfaces use semantic amber (`--finding-indicator`) rather than alarming red for discrepancies, Inter for UI chrome, and IBM Plex Mono strictly for verbatim quoted evidence excerpts ([ADR-0060](adr/08-frontend-ui/ADR-0060-design-principles-priority-ordered.md), [ADR-0061](adr/08-frontend-ui/ADR-0061-color-semantics-amber-for-findings-not-red.md), [ADR-0062](adr/08-frontend-ui/ADR-0062-typography-inter-ibm-plex-mono-purposefully-split.md)).

---

## 3. Decision Traceability Matrix

For any engineering fork or architectural pattern in the repository, consult the corresponding Architecture Decision Record:

| Component / Subsystem | Primary Specification | Canonical ADRs |
|---|---|---|
| **Bounded Contexts** | [BOUNDED_CONTEXTS.md](architecture/BOUNDED_CONTEXTS.md) | [ADR-0005](adr/02-strategic-design/ADR-0005-bounded-context-split.md), [ADR-0073](adr/09-infrastructure-hosting/ADR-0073-full-screening-schema.md), [ADR-0075](adr/09-infrastructure-hosting/ADR-0075-full-intake-schema.md) |
| **Relational Database** | [DATABASE.md](database/DATABASE.md) | [ADR-0006](adr/02-strategic-design/ADR-0006-multi-tenancy-model.md), [ADR-0009](adr/02-strategic-design/ADR-0009-exclusive-arc-sourcing-for-ownership-edges-and-evidence.md), [ADR-0015](adr/03-data-modeling/ADR-0015-primary-key-strategy.md), [ADR-0016](adr/03-data-modeling/ADR-0016-soft-state-vs-hard-state.md) |
| **Graph Projection** | [DATA_MODEL.md](specifications/DATA_MODEL.md) | [ADR-0008](adr/02-strategic-design/ADR-0008-ownership-representation-relational-graph-dual-store.md), [ADR-0011](adr/02-strategic-design/ADR-0011-case-as-the-unit-of-work-not-the-unit-of-evidence.md) |
| **State Machine** | [STATE_MACHINE.md](specifications/STATE_MACHINE.md) | [ADR-0018](adr/03-data-modeling/ADR-0018-case-status-and-region-status-as-explicit-postgres-enums.md), [ADR-0029](adr/05-state-machine/ADR-0029-case-lifecycle-states.md), [ADR-0030](adr/05-state-machine/ADR-0030-finding-lifecycle-states.md), [ADR-0079](adr/10-mvp-simulation/ADR-0079-shared-state-machine-logic-simulation-matches-real-rules.md) |
| **API & Streaming** | [API_CONTRACTS.md](specifications/API_CONTRACTS.md) | [ADR-0036](adr/06-api-contracts/ADR-0036-api-style-rest-over-openapi-no-graphql.md), [ADR-0038](adr/06-api-contracts/ADR-0038-pagination-cursor-based-not-offset.md), [ADR-0039](adr/06-api-contracts/ADR-0039-idempotency-for-mutating-endpoints.md), [ADR-0041](adr/06-api-contracts/ADR-0041-server-sent-events-for-narrative-streaming.md) |
| **Security & Privacy** | [SECURITY.md](specifications/SECURITY.md) | [ADR-0014](adr/02-strategic-design/ADR-0014-field-level-encryption-and-crypto-shredding-scope.md), [ADR-0046](adr/07-security-compliance/ADR-0046-row-level-security-as-the-primary-tenant-isolation-mechanism.md), [ADR-0049](adr/07-security-compliance/ADR-0049-encryption-key-management-for-crypto-shredding.md) |
| **Deployment Topology** | [INFRA_DEPLOYMENT.md](specifications/INFRA_DEPLOYMENT.md) | [ADR-0059](adr/08-frontend-ui/ADR-0059-hosting-cloudflare-pages-workers.md), [ADR-0066](adr/09-infrastructure-hosting/ADR-0066-api-hosting-aws-ecs-fargate.md), [ADR-0070](adr/09-infrastructure-hosting/ADR-0070-demo-evaluation-hosting-hugging-face-spaces-zerogpu-revised.md), [ADR-0072](adr/09-infrastructure-hosting/ADR-0072-production-gpu-hosting-ecs-mixed-capacity-provider-cluster-not-sagemaker-revised.md) |
