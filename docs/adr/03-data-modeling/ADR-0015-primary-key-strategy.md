# ADR-0015: Primary key strategy

## Metadata
- **Status:** `Final.`
- **Category:** Phase 3 — Data Model & Invariants
- **Decision Number:** #15
- **Date:** 2026-11-20

---

## Context
Needed a consistent PK scheme across all tenant-scoped tables.

## Decision
UUIDv7 primary keys everywhere (time-ordered UUIDs), generated application-side or via `gen_random_uuid()`-equivalent, never auto-increment integers.

## Rationale
UUIDv7 preserves rough insertion-order index locality (unlike UUIDv4) while avoiding the enumerability/leakage risk of sequential integer IDs across a multi-tenant system.

## Alternatives Rejected
Sequential bigint IDs (cross-tenant enumeration risk); UUIDv4 (worse index locality, no ordering benefit).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
