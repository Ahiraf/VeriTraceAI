# ADR-0065: Testing stack: Vitest + pytest + Playwright

## Metadata
- **Status:** `Final.`
- **Category:** Phase 8 — Infrastructure, Deployment & Model Hosting
- **Decision Number:** #65
- **Date:** 2026-11-20

---

## Context
Needed unit/integration/e2e testing tools across a TypeScript frontend and Python backend.

## Decision
**Vitest** for frontend unit/component tests, **pytest** for backend unit/integration tests, **Playwright** for end-to-end browser tests.

## Rationale
Vitest's native ESM/Vite-aligned speed suits the Next.js frontend; pytest is the Python ecosystem standard; Playwright's multi-browser support and trace-viewer tooling fit the e2e needs of a document-heavy UI.

## Alternatives Rejected
Jest (slower, more configuration overhead than Vitest for this stack); Cypress (narrower browser-engine support than Playwright).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
