# ADR-0051: CSRF protection scope

## Metadata
- **Status:** `Final.`
- **Category:** Phase 6 — Security, Isolation & Compliance
- **Decision Number:** #51
- **Date:** 2026-11-20

---

## Context
Needed to decide where CSRF protection applies given the API is consumed by a same-origin-ish but Cloudflare-Pages-hosted frontend.

## Decision
Double-submit CSRF token pattern backed by the `csrf:*` Redis namespace (#26), applied to all cookie-authenticated state-changing requests; bearer-JWT-only API clients (future integrations) are exempt since CSRF doesn't apply to non-cookie auth.

## Rationale
Targets protection at the actual attack surface (cookie-based session riding) without over-applying it to token-bearer API consumers where it provides no benefit.

## Alternatives Rejected
Applying CSRF tokens uniformly regardless of auth mechanism (unnecessary friction for bearer-token clients).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
