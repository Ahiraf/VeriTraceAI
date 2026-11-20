# ADR-0012: Audit trail as a first-class, partitioned table

## Metadata
- **Status:** `Final.`
- **Category:** Phase 2 — Strategic Design & Bounded Contexts
- **Decision Number:** #12
- **Date:** 2026-11-20

---

## Context
Compliance and audit requirements demand a durable, queryable record of every state-changing action.

## Decision
`audit_events` is an insert-only table, **range-partitioned by `occurred_at`** (monthly partitions, e.g. `audit_events_2026_12`), capturing actor, action, before/after state, and tenant.

## Rationale
Partitioning keeps query performance stable as audit volume grows indefinitely (audit data is never purged); insert-only matches the same tamper-evidence principle as #9.

## Alternatives Rejected
Single unpartitioned table (degrades over years of retained audit history); external log-only audit trail (loses relational queryability against case/finding data).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
