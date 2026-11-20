# ADR-0009: Exclusive-arc sourcing for ownership edges and evidence

## Metadata
- **Status:** `Final.`
- **Category:** Phase 2 — Strategic Design & Bounded Contexts
- **Decision Number:** #9
- **Date:** 2026-11-20

---

## Context
Every ownership edge and every evidence record must trace to exactly one declared-document source, confirmatory source, or system-detected conflict — never an ambiguous mix.

## Decision
`ownership_edges` and `evidence` both use a **CHECK-constraint-enforced exclusive arc** across their possible source-reference columns (exactly one must be non-null per row), plus **revoked-not-deleted** semantics (an `update`/`delete` is disallowed; corrections insert a new row and mark the old one `revoked_at`).

## Rationale
Structurally guarantees the "evidence-before-conclusion" principle (DESIGN.md §1) at the database layer, not just in application logic; revoked-not-deleted preserves a full audit trail of corrections, which compliance review depends on.

## Alternatives Rejected
Nullable multi-source columns validated only in application code (not tamper-proof, not DB-enforced); true row deletion/update on correction (destroys audit trail).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
