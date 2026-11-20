# ADR-0031: Document lifecycle states

## Metadata
- **Status:** `Final.`
- **Category:** Phase 4 — State Machine & Lifecycle
- **Decision Number:** #31
- **Date:** 2026-11-20

---

## Context
Uploaded documents go through integrity checking and extraction before becoming usable evidence.

## Decision
`document_status` enum: `uploaded → scanning → (clean | quarantined | scan_failed) → extracting → extracted`, where only `clean` documents proceed to extraction.

## Rationale
Makes malware/integrity failure a first-class, queryable state rather than a side-channel error log, and prevents extraction from ever running against an unscanned or failed file.

## Alternatives Rejected
Binary clean/unclean flag only (loses visibility into *why* a document is stuck, and loses the distinct "scan in progress" window).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
