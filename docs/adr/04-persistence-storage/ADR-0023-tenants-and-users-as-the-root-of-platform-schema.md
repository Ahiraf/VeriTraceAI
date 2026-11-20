# ADR-0023: tenants and users as the root of platform schema

## Metadata
- **Status:** `Final.`
- **Category:** Phase 3 — Persistence & Storage Infrastructure
- **Decision Number:** #23
- **Date:** 2026-11-20

---

## Context
Needed the minimal platform-schema foundation before any tenant-scoped table can reference it.

## Decision
`platform.tenants` and `platform.users` (with a `user_role` enum: e.g., investigator, supervisor, auditor, admin) are the first tables created in any environment bootstrap.

## Rationale
Every other schema's RLS policies and FK references depend on these two tables existing first.

## Alternatives Rejected
Deferring tenancy modeling until after case_evidence schema (would require retrofitting RLS onto already-populated tables).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
