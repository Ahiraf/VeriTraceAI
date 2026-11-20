# ADR-0045: Typed client generation for the frontend

## Metadata
- **Status:** `Final.

---`
- **Category:** Phase 5 — API Contracts & Protocol
- **Decision Number:** #45
- **Date:** 2026-11-20

---

## Context
Needed to keep frontend request/response types in sync with the backend contract without manual duplication.

## Decision
TypeScript types in `packages/shared-types` are generated from (or kept strictly aligned with) the FastAPI OpenAPI schema, consumed by `apps/web`'s `api-client.ts`.

## Rationale
Reduces drift between backend contract changes and frontend expectations; keeps the single swappable boundary (the MVP plan's #78) type-safe.

## Alternatives Rejected
Hand-maintained, independently-authored frontend types (drift risk every time the API contract changes).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
