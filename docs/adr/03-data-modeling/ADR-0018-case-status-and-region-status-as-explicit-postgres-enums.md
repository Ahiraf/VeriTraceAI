# ADR-0018: case_status and region_status as explicit Postgres enums

## Metadata
- **Status:** `Final.`
- **Category:** Phase 3 — Data Model & Invariants
- **Decision Number:** #18
- **Date:** 2026-11-20

---

## Context
Case lifecycle needs a small, closed set of states enforced at the database layer, not just validated in application code.

## Decision
Native Postgres `ENUM` types for both, matching STATE_MACHINE.md's transition diagram exactly (e.g., `intake → under_review → escalated/resolved`).

## Rationale
Enum types reject invalid states at the write layer, catching bugs earlier than application-only validation.

## Alternatives Rejected
Free-text status column with app-layer validation (no DB-level guarantee); separate lookup table (unnecessary indirection for a small, stable set of values).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
