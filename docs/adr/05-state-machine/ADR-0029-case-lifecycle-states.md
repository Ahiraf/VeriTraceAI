# ADR-0029: Case lifecycle states

## Metadata
- **Status:** `Final.`
- **Category:** Phase 4 — State Machine & Lifecycle
- **Decision Number:** #29
- **Date:** 2026-11-20

---

## Context
Needed the canonical state machine for a case's life.

## Decision
`intake → under_review → (escalated | resolved)`, with `resolved` further distinguishing sub-outcomes recorded via `case_decisions`, not via additional `case_status` enum values.

## Rationale
Keeps the status enum small and stable; nuanced outcomes belong in the insert-only decisions table where they're naturally auditable.

## Alternatives Rejected
Encoding every possible outcome as its own enum value (enum bloat, migration churn every time a new outcome type is needed).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
