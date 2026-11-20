# ADR-0016: Soft state vs. hard state

## Metadata
- **Status:** `Final.`
- **Category:** Phase 3 — Data Model & Invariants
- **Decision Number:** #16
- **Date:** 2026-11-20

---

## Context
Needed a consistent rule for which tables allow UPDATE/DELETE and which don't.

## Decision
Tables representing **assertions/evidence/history** (`evidence`, `ownership_edges`, `case_decisions`, `audit_events`, `model_runs`, `screening_matches`, `match_dispositions`, `document_integrity_checks`, `extracted_fields`) are insert-only or revoked-not-deleted. Tables representing **current operational state** (`cases`, `entities`, `persons`, `documents`, `extraction_jobs`) allow controlled updates.

## Rationale
Matches #9's exclusive-arc principle at the whole-schema level; gives a single mental rule ("is this a fact or a status") instead of per-table special-casing.

## Alternatives Rejected
Uniform mutability (breaks the audit guarantee); uniform immutability (makes ordinary operational status tracking unworkable).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
