# VeriTraceAI — Bounded Contexts & Domain Architecture

> Formal domain boundary and service contract definitions for VeriTraceAI.
> Corresponds to [Decision [#5](../adr/02-strategic-design/ADR-0005-bounded-context-split.md)](../adr/02-strategic-design/ADR-0005-bounded-context-split.md) and ARCHITECTURE.md §3.

---

## 1. Context Map Overview

VeriTraceAI is structured as a modular monolith in `apps/api/src/` around four bounded contexts:

```
┌────────────────────────────────────────────────────────┐
│                        PLATFORM                        │
│         (Tenants, Users, RBAC, GDPR Crypto-Shred)      │
└────────┬───────────────────┬───────────────────┬───────┘
         │ (Tenant Isolation)│                   │
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌────────────────┐
│     INTAKE      │ │  CASE_EVIDENCE  │ │   SCREENING    │
│ (Docs, Malware, │─┼▶(Core Domain,   │◀┼─(Watchlists,   │
│  Extraction)    │ │  Graph, UBO)    │ │  OFAC 50% Rule)│
└─────────────────┘ └────────┬────────┘ └────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │INFERENCE SERVICE│
                    │(Custom GPU Model│
                    │ Entity Match)   │
                    └─────────────────┘
```

---

## 2. Bounded Context Specifications

### 2.1 `case_evidence` (Core Domain)
- **Role**: Primary domain engine governing UBO discovery, graph reconciliation, and decision auditability.
- **Aggregates**:
  - `Case` (Root): Lifecycle coordinator (`case_status`, jurisdiction regions).
  - `Finding`: Atomic discrepancy unit citing 1..N `Evidence` records.
  - `OwnershipGraph`: Relational (`ownership_edges`) and graph projection (Neo4j) tracking declared, observed, and reconciled UBO chains.
  - `CaseDecision`: Immutable, human-authored terminal outcome with rationale.
- **Upstream Dependencies**:
  - Consumes promoted extracted fields from `intake`.
  - Consumes watchlist matches and dispositions from `screening`.
  - Queries `Inference Service` for fuzzy entity resolution confidence scores.
- **Downstream Consumers**:
  - UI Case Queue and Evidence Comparison Panel.

### 2.2 `intake` (Supporting Context)
- **Role**: Ingestion pipeline for corporate filings, PSC statements, and bank proofs.
- **Aggregates**:
  - `Document`: Upload metadata, R2 object references, mime validation.
  - `DocumentIntegrityCheck`: Antivirus/integrity verification results (ClamAV).
  - `ExtractionJob`: Inngest-driven async OCR/parsing execution.
  - `ExtractedField`: Bounding-box anchored machine extraction candidates.
- **Boundary Rule**: Extracted fields never become evidence automatically; they must pass an explicit promotion step to `case_evidence.evidence`.

### 2.3 `screening` (Core Context)
- **Role**: Watchlist, Sanctions (OFAC SDN, OpenSanctions), and PEP screening.
- **Aggregates**:
  - `WatchlistSourceSnapshot`: Point-in-time immutable record of watchlist state.
  - `ScreeningRun`: Case-specific query execution against a snapshot.
  - `ScreeningMatch`: Fuzzy matches with score attribution (`model_run_id`).
  - `MatchDisposition`: Append-only investigator adjudication (`true_match`, `false_positive`).
- **Invariance Rule**: No case can move to `Cleared` without verifying the OFAC 50% rule across all identified UBOs with >=50% ownership interest.

### 2.4 `platform` (Generic Subdomain)
- **Role**: Multi-tenant isolation primitives, authentication mapping, and regulatory erasure.
- **Aggregates**:
  - `Tenant`: Multi-tenant root (`UK_MODE`, `BD_MODE`).
  - `User`: Compliance officers, investigators, admins.
  - `ErasureRequest`: GDPR Art. 17 / BD PDPA crypto-shredding orchestration destroying per-subject DEKs without mutating audit event rows.
