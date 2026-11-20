# ADR-0038: Pagination: cursor-based, not offset

## Metadata
- **Status:** `Final.`
- **Category:** Phase 5 — API Contracts & Protocol
- **Decision Number:** #38
- **Date:** 2026-11-20

---

## Context
Case queues and audit event listings can grow large and are frequently filtered/sorted.

## Decision
Cursor-based (keyset) pagination on all list endpoints, using the UUIDv7 PK's time-ordering property (#15) as the natural cursor basis.

## Rationale
Avoids the performance degradation and page-drift correctness issues of offset pagination on large, frequently-mutating tables.

## Alternatives Rejected
Offset/limit pagination (degrades at scale, suffers from page-drift when rows are inserted between page requests).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
