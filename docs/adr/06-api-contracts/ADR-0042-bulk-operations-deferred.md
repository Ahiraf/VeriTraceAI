# ADR-0042: Bulk operations deferred

## Metadata
- **Status:** `Final (subject to revisit).`
- **Category:** Phase 5 — API Contracts & Protocol
- **Decision Number:** #42
- **Date:** 2026-11-20

---

## Context
Considered whether to support bulk case/finding operations (e.g., bulk-close) in v1's API contract.

## Decision
No bulk endpoints in v1; all mutations are single-resource. Revisit only if real investigator workflow data shows a bulk-action need.

## Rationale
Avoids building speculative bulk-mutation semantics (including the audit-trail implications of "who decided what" across N rows at once) before a concrete need is observed.

## Alternatives Rejected
Building bulk endpoints preemptively (speculative, complicates the insert-only audit model's per-action attribution).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
