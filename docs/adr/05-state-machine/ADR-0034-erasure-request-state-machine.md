# ADR-0034: Erasure request state machine

## Metadata
- **Status:** `Final.`
- **Category:** Phase 4 — State Machine & Lifecycle
- **Decision Number:** #34
- **Date:** 2026-11-20

---

## Context
GDPR/PDPA erasure needs a controlled, auditable workflow rather than an immediate action.

## Decision
`erasure_requests.status` progresses `pending → (key_destroyed | rejected)`; the transition itself is the mechanism that performs DEK destruction per #14 — there is no separate "destroy key" side effect decoupled from the status update.

## Rationale
Making the state transition *be* the destructive action (not a side effect triggered elsewhere) means the audit trail and the actual data-destruction event can never drift out of sync.

## Alternatives Rejected
A separate background job that destroys keys after a request is marked approved (introduces a window where state and reality can diverge, e.g., if the job fails silently).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
