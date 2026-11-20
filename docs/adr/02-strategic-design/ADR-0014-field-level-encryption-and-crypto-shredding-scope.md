# ADR-0014: Field-level encryption and crypto-shredding scope

## Metadata
- **Status:** `Final — downstream `erasure_requests` table (#74) implements the request/fulfillment workflow for this decision.`
- **Category:** Phase 2 — Strategic Design & Bounded Contexts
- **Decision Number:** #14
- **Date:** 2026-11-20

---

## Context
GDPR/PDPA erasure requests must be honorable without destroying the evidentiary/audit value of an entire case.

## Decision
Only a narrow set of fields are stored **application-layer encrypted** with per-subject data encryption keys (DEKs): date of birth and other direct person identifiers on `persons`. Erasure is performed by **destroying the DEK** (crypto-shredding), not by deleting rows — ciphertext remains as an unreadable tombstone, everything else in the case (findings, evidence metadata, audit trail) survives intact.

## Rationale
Satisfies "right to erasure" without breaking referential integrity or destroying non-personal evidentiary context; scoping encryption narrowly (not whole-row) keeps query performance acceptable for the vast majority of non-PII columns.

## Alternatives Rejected
Whole-database encryption at rest only (doesn't satisfy per-subject erasure without full dataset re-encryption); hard-delete on erasure request (destroys audit/evidence integrity, unacceptable for a compliance product).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
