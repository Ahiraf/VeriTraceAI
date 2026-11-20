# ADR-0078: Single swappable API-client boundary

## Metadata
- **Status:** `Final (scoped to Phase 9, but the boundary itself is a durable pattern retained into the full build).`
- **Category:** Phase 9 — MVP Simulation Build
- **Decision Number:** #78
- **Date:** 2026-11-20

---

## Context
Needed to guarantee that "frontend simulation first" work is not throwaway once a real backend exists.

## Decision
All frontend data access routes through one module, `lib/api-client.ts`; Phase 1 of the MVP build points it at local fixtures with simulated latency, Phase 2 repoints it at the real FastAPI server with zero changes to any component.

## Rationale
Makes the fixture-to-real-backend transition a one-file change instead of a component-by-component rewrite, directly protecting the time invested in the simulation phase.

## Alternatives Rejected
Importing fixture JSON directly into components (would require touching every component when the real backend is introduced).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
