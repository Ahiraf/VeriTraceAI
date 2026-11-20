# ADR-0030: Finding lifecycle states

## Metadata
- **Status:** `Final.`
- **Category:** Phase 4 — State Machine & Lifecycle
- **Decision Number:** #30
- **Date:** 2026-11-20

---

## Context
Needed states for an individual finding independent of its parent case.

## Decision
`open → (acknowledged) → closed`, where "closed" always carries a reference to the `case_decisions` row (or specific disposition) that closed it.

## Rationale
A case cannot move to `resolved` while any finding remains `open` — enforced in both `state_machine.ts` (frontend simulation) and the equivalent backend/DB logic, per the MVP plan's #79.

## Alternatives Rejected
Allowing case resolution with open findings (would contradict the "evidence-before-conclusion" design principle).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
