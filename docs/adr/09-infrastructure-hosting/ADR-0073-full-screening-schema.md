# ADR-0073: Full screening schema

## Metadata
- **Status:** `Final.`
- **Category:** Phase 8 — Infrastructure, Deployment & Model Hosting
- **Decision Number:** #73
- **Date:** 2026-11-20

---

## Context
The `screening` bounded context (#5) was previously deferred at the table-definition level.

## Decision
Finalized `screening.watchlist_source_snapshots`, `screening_runs`, `screening_matches` (insert-only), and `match_dispositions` (insert-only/append-style, per #33).

## Rationale
Completes the bounded context with the same insert-only/append discipline (#16) applied consistently across the schema, and gives `evidence`'s exclusive-arc (#19) a concrete `screening_match_id` target.

## Alternatives Rejected
None — this was a completion of previously-scoped, not newly-debated, design.

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
