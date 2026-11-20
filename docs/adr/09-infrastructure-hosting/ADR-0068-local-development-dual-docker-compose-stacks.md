# ADR-0068: Local development: dual Docker Compose stacks

## Metadata
- **Status:** `Final. *(Note: superseded in scope — not in correctness — by the MVP Simulation Build in Phase 9, which explicitly runs without Docker; this decision remains the standard for the full-architecture build path.)*

---`
- **Category:** Phase 8 — Infrastructure, Deployment & Model Hosting
- **Decision Number:** #68
- **Date:** 2026-11-20

---

## Context
Needed a reproducible local dev environment distinct from the production topology, without requiring every contributor to have cloud access.

## Decision
Two Docker Compose stacks — `docker-compose.dev.yml` (hot-reload, local Postgres/Neo4j/Redis containers, MailHog) and `docker-compose.prod.yml` (production-shaped image build/test, no hot-reload) — kept as separate files rather than one Compose file with profile flags.

## Rationale
Separate files make the dev-vs-prod-shaped distinction unambiguous at a glance and avoid profile-flag conditional logic creeping into a single shared file.

## Alternatives Rejected
Single Compose file with Docker Compose "profiles" (workable, but blurs the dev/prod distinction and risks accidental cross-contamination of settings).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
