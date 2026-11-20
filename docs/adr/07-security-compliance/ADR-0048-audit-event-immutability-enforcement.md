# ADR-0048: Audit event immutability enforcement

## Metadata
- **Status:** `Final.`
- **Category:** Phase 6 — Security, Isolation & Compliance
- **Decision Number:** #48
- **Date:** 2026-11-20

---

## Context
Restates #12 at the security-review layer — needed to confirm the immutability isn't just convention.

## Decision
`audit_events` has no `UPDATE`/`DELETE` grants for any application role; only `INSERT` is grantable, enforced at the Postgres GRANT level, not merely assumed from table design.

## Rationale
Table-design insert-only conventions alone can be bypassed by a bug or a careless migration; GRANT-level enforcement makes it a database-level guarantee.

## Alternatives Rejected
Relying on application code discipline alone (not tamper-resistant against bugs or a compromised application credential).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
