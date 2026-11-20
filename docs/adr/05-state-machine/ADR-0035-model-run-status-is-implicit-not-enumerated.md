# ADR-0035: Model run status is implicit, not enumerated

## Metadata
- **Status:** `Final.

---`
- **Category:** Phase 4 — State Machine & Lifecycle
- **Decision Number:** #35
- **Date:** 2026-11-20

---

## Context
Deciding whether `model_runs` needs its own status lifecycle.

## Decision
`model_runs` has no status enum — a row's mere existence represents a completed run (success or logged failure via an `error` field); there is no "pending model run" row.

## Rationale
Model invocations are synchronous-enough request/response operations in this architecture (LLM call or Inference Service call) that an in-flight state isn't meaningfully observable at the row level; keeping the table purely append-of-completed-runs is simpler.

## Alternatives Rejected
Full status enum mirroring document/extraction lifecycles (unnecessary complexity for an operation that's fundamentally request/response).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
