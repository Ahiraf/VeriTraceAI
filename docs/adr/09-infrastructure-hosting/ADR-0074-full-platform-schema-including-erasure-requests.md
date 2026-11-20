# ADR-0074: Full platform schema including erasure_requests

## Metadata
- **Status:** `Final.`
- **Category:** Phase 8 — Infrastructure, Deployment & Model Hosting
- **Decision Number:** #74
- **Date:** 2026-11-20

---

## Context
The GDPR/PDPA erasure pathway (#14) was previously described only in prose, without a finalized table.

## Decision
Finalized `platform.erasure_requests`, scoped only to Decision #14's encrypted fields (DOB + person identifiers), with status progression `pending → key_destroyed/rejected` per #34.

## Rationale
Turns the previously-prose-only compliance commitment into an enforceable, auditable table matching the rest of the schema's insert-only/status-transition conventions.

## Alternatives Rejected
None — completion of previously-scoped design.

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
