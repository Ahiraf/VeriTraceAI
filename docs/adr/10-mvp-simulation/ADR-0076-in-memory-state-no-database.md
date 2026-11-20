# ADR-0076: In-memory state, no database

## Metadata
- **Status:** `Final (scoped to Phase 9 only).`
- **Category:** Phase 9 — MVP Simulation Build
- **Decision Number:** #76
- **Date:** 2026-11-20

---

## Context
Needed the simplest possible persistence for a demo build with no DB infrastructure.

## Decision
A single in-memory Python dict on the backend, mirrored by a Zustand store on the frontend, both seeded from static JSON fixture files at process start; restarting either process resets all state.

## Rationale
Sufficient for demonstrability; explicitly not meant to be durable, which is an acceptable tradeoff given this build's purpose.

## Alternatives Rejected
SQLite as a "lightweight database" (still a database — rejected to honor the explicit "no database" constraint for this build).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
