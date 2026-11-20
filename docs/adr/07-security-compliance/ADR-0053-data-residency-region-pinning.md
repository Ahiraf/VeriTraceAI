# ADR-0053: Data residency / region pinning

## Metadata
- **Status:** `Provisional / explicitly deferred.`
- **Category:** Phase 6 — Security, Isolation & Compliance
- **Decision Number:** #53
- **Date:** 2026-11-20

---

## Context
Compliance data for certain jurisdictions may carry residency requirements.

## Decision
Explicitly deferred — v1 operates a single-region deployment (per INFRA_DEPLOYMENT.md); multi-region/residency pinning is not designed until a specific jurisdiction's requirement is confirmed.

## Rationale
Avoids speculative multi-region architecture before a concrete regulatory trigger exists; this is a genuine judgment call flagged for future revisit rather than resolved unilaterally.

## Alternatives Rejected
Building multi-region data residency controls now (substantial complexity with no current confirmed requirement).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
