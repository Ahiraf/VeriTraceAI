# ADR-0040: Error shape

## Metadata
- **Status:** `Final.`
- **Category:** Phase 5 — API Contracts & Protocol
- **Decision Number:** #40
- **Date:** 2026-11-20

---

## Context
Needed one consistent error response contract across all endpoints.

## Decision
RFC 7807-style `problem+json` error bodies (`type`, `title`, `status`, `detail`, `instance`), with domain-specific `type` URIs for validation vs. state-machine-violation vs. authorization errors.

## Rationale
Standard, machine-parseable shape that the frontend can branch on reliably (e.g., distinguishing "invalid finding transition" from "not authorized").

## Alternatives Rejected
Ad hoc per-endpoint error shapes (inconsistent client handling, harder to document).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
