# ADR-0019: Evidence source exclusivity columns

## Metadata
- **Status:** `Final.`
- **Category:** Phase 3 — Data Model & Invariants
- **Decision Number:** #19
- **Date:** 2026-11-20

---

## Context
Specific to how #9's exclusive-arc constraint is physically shaped for `evidence`.

## Decision
`evidence` carries nullable `document_id`, `registry_snapshot_id`, and `screening_match_id` reference columns plus a CHECK constraint requiring exactly one non-null.

## Rationale
Keeps a single `evidence` table queryable across all source types instead of three separate evidence tables with duplicated downstream linking logic.

## Alternatives Rejected
Table-per-source-type (fragments `finding_evidence_links` into three parallel join tables).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
