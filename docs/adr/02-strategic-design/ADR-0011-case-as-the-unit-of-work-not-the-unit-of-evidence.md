# ADR-0011: Case as the unit of work, not the unit of evidence

## Metadata
- **Status:** `Final.`
- **Category:** Phase 2 — Strategic Design & Bounded Contexts
- **Decision Number:** #11
- **Date:** 2026-11-20

---

## Context
Needed to decide what a "case" actually bundles.

## Decision
A `case` bundles one subject `entity`, its full `ownership_edges` graph, and all `findings` raised against it; `case_status` and `region_status` enums track overall and per-jurisdiction progress separately.

## Rationale
Multi-jurisdiction entities need independently trackable regional review progress without splitting into separate cases.

## Alternatives Rejected
One case per jurisdiction per entity (fragments a single legal entity's story across disconnected records).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
