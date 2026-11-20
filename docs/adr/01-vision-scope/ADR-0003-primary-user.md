# ADR-0003: Primary user

## Metadata
- **Status:** `Final.`
- **Category:** Phase 1 — Vision, Scope & Non-Goals
- **Decision Number:** #3
- **Date:** 2026-11-20

---

## Context
Needed to decide whose workflow the UI and API optimize for.

## Decision
Primary persona is the **human investigator** working a case queue; secondary personas are a reviewing supervisor and a compliance/audit reader (read-only, post-hoc).

## Rationale
Determines queue-first navigation (DESIGN.md §5.1), the permanently-visible decision row (§5.2), and why `audit_events` exists as a first-class, partitioned table rather than an afterthought.

## Alternatives Rejected
Optimizing for a batch/ops persona (automated bulk screening) — explicitly out of scope per #2.

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
