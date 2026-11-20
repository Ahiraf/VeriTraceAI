# ADR-0007: Entity/Person/Address as shared reference data

## Metadata
- **Status:** `Final.`
- **Category:** Phase 2 — Strategic Design & Bounded Contexts
- **Decision Number:** #7
- **Date:** 2026-11-20

---

## Context
Ownership structures reference the same legal entities and natural persons across many cases.

## Decision
`entities`, `persons`, and `addresses` are modeled as shared, tenant-scoped reference tables, referenced (not duplicated) by `ownership_edges` and `findings`.

## Rationale
Avoids duplicate, drifting copies of the same legal entity across cases; supports cross-case entity resolution later without a schema change.

## Alternatives Rejected
Denormalized per-case copies of entity/person data (simpler short-term, but breaks cross-case corroboration later).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
