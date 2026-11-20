# ADR-0057: PWA layer: Serwist, not vite-pwa

## Metadata
- **Status:** `Final.`
- **Category:** Phase 7 — Frontend & UI Architecture
- **Decision Number:** #57
- **Date:** 2026-11-20

---

## Context
Needed an offline/installable-app capability compatible with Next.js (not a Vite-based project).

## Decision
**Serwist** for service-worker/PWA tooling.

## Rationale
vite-pwa is Vite-specific and inapplicable to a Next.js build pipeline; Serwist is the maintained, Next.js-compatible successor in this space.

## Alternatives Rejected
vite-pwa (wrong build tool entirely); next-pwa (less actively maintained at time of decision).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
