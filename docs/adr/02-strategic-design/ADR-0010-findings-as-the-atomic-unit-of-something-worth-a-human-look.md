# ADR-0010: Findings as the atomic unit of "something worth a human look"

## Metadata
- **Status:** `Final.`
- **Category:** Phase 2 — Strategic Design & Bounded Contexts
- **Decision Number:** #10
- **Date:** 2026-11-20

---

## Context
Needed a concept between raw evidence and a case-level decision.

## Decision
A `findings` table represents one discrete, evidence-linked observation (e.g., an ownership percentage conflict), linked to one or more evidence rows via `finding_evidence_links`. Cases aggregate findings; decisions resolve findings, not raw evidence directly.

## Rationale
Matches investigator mental model (cases are decided one finding at a time) and gives the UI a natural unit for the Finding Switcher (DESIGN.md §5.2).

## Alternatives Rejected
Decisions applied directly against raw evidence rows (loses the aggregation/triage step investigators actually perform).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
