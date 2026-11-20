# ADR-0033: Screening match disposition as append-only history

## Metadata
- **Status:** `Final.`
- **Category:** Phase 4 — State Machine & Lifecycle
- **Decision Number:** #33
- **Date:** 2026-11-20

---

## Context
A screening match (e.g., a watchlist hit) may be reviewed multiple times as new context arrives.

## Decision
`match_dispositions` is insert-only/append-style — each review action adds a new disposition row rather than overwriting the previous one; current state is "the latest disposition for a match," derived by query, not stored denormalized.

## Rationale
Preserves full history of how a screening match was reasoned about over time, consistent with #16's audit principle.

## Alternatives Rejected
Single mutable `current_disposition` column on `screening_matches` (loses the reasoning history).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
