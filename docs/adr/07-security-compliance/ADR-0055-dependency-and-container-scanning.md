# ADR-0055: Dependency and container scanning

## Metadata
- **Status:** `Final.

---`
- **Category:** Phase 6 — Security, Isolation & Compliance
- **Decision Number:** #55
- **Date:** 2026-11-20

---

## Context
Needed a consistent supply-chain security check in CI.

## Decision
GitHub Actions CI includes automated dependency vulnerability scanning (e.g., `pnpm audit` / `pip-audit` equivalents) and container image scanning as a required, non-bypassable CI step for the two Docker Compose stacks' images.

## Rationale
Catches known-vulnerable dependencies and base images before they reach any deployed environment.

## Alternatives Rejected
Manual/periodic scanning only (misses vulnerabilities introduced between manual audit cycles).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
