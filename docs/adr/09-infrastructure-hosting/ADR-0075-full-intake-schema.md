# ADR-0075: Full intake schema

## Metadata
- **Status:** `Final.

---`
- **Category:** Phase 8 — Infrastructure, Deployment & Model Hosting
- **Decision Number:** #75
- **Date:** 2026-11-20

---

## Context
The `intake` bounded context's OCR/extraction data model (#31, #32) was previously deferred at the table-definition level.

## Decision
Finalized `intake.documents` (with the `document_status` enum including `quarantined`/`scan_failed`), `document_integrity_checks` (insert-only), `extraction_jobs`, and `extracted_fields` (insert-only, including a `bounding_box` jsonb column for UI highlighting and the `promoted_to_evidence_id` FK from #32).

## Rationale
Completes the intake pipeline's data model with the same conventions applied throughout the rest of the schema.

## Alternatives Rejected
None — completion of previously-scoped design.

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
