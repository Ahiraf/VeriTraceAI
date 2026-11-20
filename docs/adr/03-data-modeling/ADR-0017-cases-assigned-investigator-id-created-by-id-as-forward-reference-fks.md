# ADR-0017: cases.assigned_investigator_id / created_by_id as forward-reference FKs

## Metadata
- **Status:** `Final.`
- **Category:** Phase 3 — Data Model & Invariants
- **Decision Number:** #17
- **Date:** 2026-11-20

---

## Context
`platform.users` and `case_evidence.cases` have a circular dependency (a case references a user; schema load order must resolve both).

## Decision
`cases` is created without these FK constraints initially; they are added via a deferred `ALTER TABLE ... ADD CONSTRAINT` once both schemas exist, matching the migration order in FULL_DATABASE_SCHEMA.md §1.

## Rationale
Standard pattern for resolving genuine bidirectional schema dependencies without introducing a spurious third linking table.

## Alternatives Rejected
Linking table between cases and users (unnecessary indirection for a simple FK relationship).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
