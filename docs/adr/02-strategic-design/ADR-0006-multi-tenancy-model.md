# ADR-0006: Multi-tenancy model

## Metadata
- **Status:** `Final.`
- **Category:** Phase 2 — Strategic Design & Bounded Contexts
- **Decision Number:** #6
- **Date:** 2026-11-20

---

## Context
VeriTraceAI will serve multiple compliance teams/firms; needed a tenancy strategy.

## Decision
Row-level multi-tenancy via a `tenant_id` column on every tenant-scoped table, enforced by Postgres **Row-Level Security (RLS)**, not schema-per-tenant or database-per-tenant.

## Rationale
RLS gives hard isolation guarantees enforced at the database layer (not just application code), while keeping operational overhead to one database/schema set — appropriate for expected tenant counts.

## Alternatives Rejected
Schema-per-tenant (migration fan-out cost); DB-per-tenant (operational overhead disproportionate to scale).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
