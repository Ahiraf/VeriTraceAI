# ADR-0044: Rate limiting at the API layer

## Metadata
- **Status:** `Final.`
- **Category:** Phase 5 — API Contracts & Protocol
- **Decision Number:** #44
- **Date:** 2026-11-20

---

## Context
Needed to bound abuse/runaway-client risk, especially around login and search endpoints.

## Decision
Token-bucket rate limiting backed by the `ratelimit:*` Redis namespace (#26), applied per-user and per-IP, with stricter limits on `loginattempts:*`-tracked authentication endpoints.

## Rationale
Matches the existing ephemeral-Redis design (#26); prevents brute-force and scraping patterns without introducing a new infrastructure dependency.

## Alternatives Rejected
Rate limiting at the CDN/edge only (insufficient granularity for per-user, authenticated-endpoint limits).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
