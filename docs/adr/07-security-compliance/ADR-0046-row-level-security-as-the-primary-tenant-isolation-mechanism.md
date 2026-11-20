# ADR-0046: Row-Level Security as the primary tenant isolation mechanism

## Metadata
- **Status:** `Final.`
- **Category:** Phase 6 — Security, Isolation & Compliance
- **Decision Number:** #46
- **Date:** 2026-11-20

---

## Context
Restates and anchors #6 at the security-review layer.

## Decision
Every tenant-scoped table has an RLS policy keyed on `tenant_id = current_setting('app.tenant_id')`, set per-request from the verified JWT (#43); no table relies on application-layer filtering alone for tenant isolation.

## Rationale
Database-enforced isolation survives application bugs that might otherwise leak cross-tenant data via a missed `WHERE tenant_id = ...` clause.

## Alternatives Rejected
Application-layer-only tenant filtering (a single missed filter is a cross-tenant data leak).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
