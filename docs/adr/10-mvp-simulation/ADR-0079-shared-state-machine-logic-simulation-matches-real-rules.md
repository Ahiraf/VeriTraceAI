# ADR-0079: Shared state-machine logic, simulation matches real rules

## Metadata
- **Status:** `Final (scoped to Phase 9, logic intended to be ported forward, not replaced, when the real backend is introduced).`
- **Category:** Phase 9 — MVP Simulation Build
- **Decision Number:** #79
- **Date:** 2026-11-20

---

## Context
The simulation must be semantically honest, not just visually similar to the real product.

## Decision
Case/finding/evidence status transitions in the MVP build reuse the exact enum values and transition rules from STATE_MACHINE.md/DATA_MODEL.md (#18, #29, #30), enforced in plain TypeScript (`state-machine.ts`) and Python functions instead of DB CHECK constraints/triggers.

## Rationale
Ensures a demo viewer is seeing the real product's actual rules in action (e.g., a case truly cannot resolve with an open finding), not a simplified or fictional approximation.

## Alternatives Rejected
Ad hoc/simplified transition logic for the demo (would misrepresent the real product's guarantees).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
