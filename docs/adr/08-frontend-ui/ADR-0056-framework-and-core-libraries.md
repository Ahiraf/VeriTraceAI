# ADR-0056: Framework and core libraries

## Metadata
- **Status:** `Final.`
- **Category:** Phase 7 — Frontend & UI Architecture
- **Decision Number:** #56
- **Date:** 2026-11-20

---

## Context
Needed the frontend's foundational stack.

## Decision
Next.js + TypeScript + Tailwind CSS + shadcn/ui components + Zustand (client state) + React Query (server state/caching) + Framer Motion (motion, scoped per DESIGN.md §6).

## Rationale
This combination gives strong typing, a component system that's customizable rather than black-box, clean separation of server-cache state (React Query) from UI-only state (Zustand), and a motion library capable of the restrained, purposeful animation DESIGN.md calls for.

## Alternatives Rejected
Redux (more boilerplate than needed given React Query already owns server state); CSS-in-JS runtime libraries (Tailwind's build-time approach preferred for performance).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
