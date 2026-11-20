# ADR-0039: Idempotency for mutating endpoints

## Metadata
- **Status:** `Final.`
- **Category:** Phase 5 — API Contracts & Protocol
- **Decision Number:** #39
- **Date:** 2026-11-20

---

## Context
Decision-recording and document-upload endpoints must be safe to retry (client timeouts, network blips).

## Decision
Mutating endpoints accept an `Idempotency-Key` header, checked/stored against the `idempotency:*` Redis namespace (#26) with a bounded TTL.

## Rationale
Prevents duplicate case decisions or duplicate document records from naive client retries, without requiring durable idempotency storage for a short-lived concern.

## Alternatives Rejected
No idempotency handling (risks duplicate state-changing side effects on retry); durable idempotency table (overkill given Redis's bounded-TTL semantics suffice here).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
