# ADR-0064: Monorepo tooling: Turborepo + pnpm

## Metadata
- **Status:** `Final.`
- **Category:** Phase 8 — Infrastructure, Deployment & Model Hosting
- **Decision Number:** #64
- **Date:** 2026-11-20

---

## Context
Needed build/task orchestration across `apps/web`, `apps/api`, and shared packages.

## Decision
Turborepo for task graph/caching, pnpm for package management and workspaces.

## Rationale
pnpm's strict, content-addressed node_modules avoids phantom dependency bugs; Turborepo's remote caching and task graph fit the multi-app/multi-package structure without needing a heavier tool (Nx) for the current package count.

## Alternatives Rejected
npm/yarn workspaces without a task orchestrator (no build caching, slower CI); Nx (more powerful than needed at current scale).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
