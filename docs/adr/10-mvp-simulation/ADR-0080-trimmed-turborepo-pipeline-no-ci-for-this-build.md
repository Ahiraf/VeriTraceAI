# ADR-0080: Trimmed Turborepo pipeline, no CI for this build

## Metadata
- **Status:** `Final (scoped to Phase 9 only).

---`
- **Category:** Phase 9 — MVP Simulation Build
- **Decision Number:** #80
- **Date:** 2026-11-20

---

## Context
Needed to decide how much of the full monorepo tooling (#64, #67) applies to the MVP build.

## Decision
`turbo.json`'s pipeline is trimmed to `dev`/`lint`/`build` only for this build path; `test`/`typecheck` tasks remain defined but are not wired into any CI workflow, since this build has no CI.

## Rationale
Keeps the tooling footprint proportional to a no-Docker, no-database, no-LLM demo build; full CI/CD (#67) is reserved for the production-track build.

## Alternatives Rejected
Standing up a full GitHub Actions pipeline for the demo build (disproportionate to this build's explicitly minimal scope).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
