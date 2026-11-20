# ADR-0052: Login brute-force handling

## Metadata
- **Status:** `Final. *(Resolves the previously "pending/deferred" login-brute-force item noted in earlier sessions.)*`
- **Category:** Phase 6 — Security, Isolation & Compliance
- **Decision Number:** #52
- **Date:** 2026-11-20

---

## Context
Flagged earlier as not yet a standalone numbered decision; formalized here.

## Decision
Progressive cooldown on repeated failed logins per account, tracked via the `loginattempts:*` Redis namespace (#26) — e.g., exponential backoff after each consecutive failure, resetting on success, bounded by a maximum lockout window rather than a permanent lock.

## Rationale
Progressive cooldown slows automated brute-force attempts without permanently locking out a legitimate user who mistyped a password a few times.

## Alternatives Rejected
Hard account lockout after N failures requiring manual/admin unlock (creates support burden and a denial-of-service vector against legitimate users).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
