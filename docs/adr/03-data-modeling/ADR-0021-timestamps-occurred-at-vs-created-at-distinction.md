# ADR-0021: Timestamps: occurred_at vs. created_at distinction

## Metadata
- **Status:** `Final.`
- **Category:** Phase 3 — Data Model & Invariants
- **Decision Number:** #21
- **Date:** 2026-11-20

---

## Context
Audit and evidence tables need to distinguish "when did this happen in the real world" from "when did our system record it."

## Decision
Event-shaped tables (`audit_events`, evidence with a document date, etc.) carry both an `occurred_at` (or equivalent domain timestamp) and a `created_at` (system insert time); purely operational tables carry only `created_at`/`updated_at`.

## Rationale
Real-world event time and system ingestion time legitimately diverge (e.g., a document dated months ago, uploaded today) and both matter for investigation accuracy.

## Alternatives Rejected
Single timestamp column (loses the real-world-vs-system-time distinction needed for accurate evidence dating).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
