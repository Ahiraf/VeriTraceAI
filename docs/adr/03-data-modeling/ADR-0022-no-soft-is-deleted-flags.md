# ADR-0022: No soft "is_deleted" flags

## Metadata
- **Status:** `Final.`
- **Category:** Phase 3 — Data Model & Invariants
- **Decision Number:** #22
- **Date:** 2026-11-20

---

## Context
A common anti-pattern is adding `is_deleted boolean` to every table "just in case."

## Decision
No table uses a generic `is_deleted` flag; each context has an explicit, purpose-built mechanism instead (`revoked_at` for evidence/ownership, `erasure_requests` status progression for PII, ordinary status enums for operational entities).

## Rationale
Generic soft-delete flags obscure *why* something is inactive; purpose-built mechanisms make the reason queryable and auditable.

## Alternatives Rejected
Universal `is_deleted` column (ambiguous semantics, doesn't distinguish erasure from correction from normal lifecycle progression).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
