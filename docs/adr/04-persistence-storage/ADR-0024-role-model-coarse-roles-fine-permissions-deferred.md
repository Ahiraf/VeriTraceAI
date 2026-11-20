# ADR-0024: Role model: coarse roles, fine permissions deferred

## Metadata
- **Status:** `Final (subject to revisit if a real need emerges).`
- **Category:** Phase 3 — Persistence & Storage Infrastructure
- **Decision Number:** #24
- **Date:** 2026-11-20

---

## Context
Needed to decide between a small fixed role enum vs. a full permissions/ACL system for v1.

## Decision
v1 ships with a small, fixed `user_role` enum (not a configurable permissions matrix); finer-grained permissioning is explicitly deferred until a real multi-role customer need is observed.

## Rationale
Avoids building a flexible-but-unused permissions engine speculatively; a fixed enum is sufficient for the known personas (#3).

## Alternatives Rejected
Full RBAC/ABAC engine from day one (speculative complexity with no current requirement driving it).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
