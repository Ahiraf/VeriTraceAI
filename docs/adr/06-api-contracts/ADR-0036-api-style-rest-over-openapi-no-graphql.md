# ADR-0036: API style: REST over OpenAPI, no GraphQL

## Metadata
- **Status:** `Final.`
- **Category:** Phase 5 — API Contracts & Protocol
- **Decision Number:** #36
- **Date:** 2026-11-20

---

## Context
Needed to choose an API paradigm for `apps/api`.

## Decision
REST/JSON over FastAPI's auto-generated OpenAPI schema; no GraphQL layer.

## Rationale
The domain's access patterns are resource-oriented (cases, findings, documents) rather than deeply nested/client-driven-shape queries; FastAPI's OpenAPI generation gives typed-client generation "for free" without a separate GraphQL server to operate.

## Alternatives Rejected
GraphQL (added server complexity and a second query language, without a corresponding need for flexible client-shaped queries at this stage).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
