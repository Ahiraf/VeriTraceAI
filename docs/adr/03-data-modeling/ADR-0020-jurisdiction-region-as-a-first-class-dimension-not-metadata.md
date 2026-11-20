# ADR-0020: Jurisdiction/region as a first-class dimension, not metadata

## Metadata
- **Status:** `Final.`
- **Category:** Phase 3 — Data Model & Invariants
- **Decision Number:** #20
- **Date:** 2026-11-20

---

## Context
UBO investigations are inherently multi-jurisdiction (an entity may have ownership across several countries with different disclosure regimes).

## Decision
`region_status` is tracked per case per jurisdiction in a dedicated structure, not collapsed into a single case-level status.

## Rationale
Allows a case to be "resolved" in one jurisdiction while still "under review" in another, matching real regulatory practice.

## Alternatives Rejected
Single case-wide status (loses per-jurisdiction granularity needed for accurate compliance reporting).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
