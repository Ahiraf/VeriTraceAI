# ADR-0026: Redis as ephemeral-only, never system-of-record

## Metadata
- **Status:** `Final.`
- **Category:** Phase 3 — Persistence & Storage Infrastructure
- **Decision Number:** #26
- **Date:** 2026-11-20

---

## Context
Needed to bound what Redis is allowed to be used for, to prevent silent dependence on it for durability.

## Decision
Redis key namespaces are scoped to exactly five purposes — `ratelimit:*`, `idempotency:*`, `csrf:*`, `cache:registry_search:*`, `loginattempts:*` — each with an explicit TTL; nothing durable is ever Redis-only.

## Rationale
Keeps Redis evictable/replaceable at any time without data loss risk; namespacing by prefix makes operational debugging and TTL auditing straightforward.

## Alternatives Rejected
Using Redis for session storage or durable queues (reintroduces a durability dependency the architecture deliberately avoids).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
