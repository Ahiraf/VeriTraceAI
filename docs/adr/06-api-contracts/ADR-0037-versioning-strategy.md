# ADR-0037: Versioning strategy

## Metadata
- **Status:** `Final.`
- **Category:** Phase 5 — API Contracts & Protocol
- **Decision Number:** #37
- **Date:** 2026-11-20

---

## Context
Needed a forward-compatible API versioning approach.

## Decision
URL-path versioning (`/v1/...`), additive-only changes preferred within a version; breaking changes require a new version prefix.

## Rationale
Simplest to reason about for both server routing and generated client code; avoids header-based versioning's extra indirection for a product at this stage of maturity.

## Alternatives Rejected
Header-based versioning (adds indirection with no current multi-version-concurrently need).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
