# ADR-0043: Authentication: Supabase-issued JWT, verified at the API

## Metadata
- **Status:** `Final.`
- **Category:** Phase 5 — API Contracts & Protocol
- **Decision Number:** #43
- **Date:** 2026-11-20

---

## Context
Needed an auth mechanism consistent with the Supabase-backed persistence choice.

## Decision
Supabase Auth issues JWTs; FastAPI verifies them independently (not merely trusting Supabase's RLS alone) and maps the verified subject to `platform.users` for role-based authorization.

## Rationale
Defense in depth — RLS protects the data layer, but the API layer should not assume every caller is a correctly-scoped Supabase client; independent verification closes that gap.

## Alternatives Rejected
Relying on RLS alone without API-layer verification (leaves a gap if a request path bypasses the expected Supabase client context).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
