# ADR-0060: Design principles (priority-ordered)

## Metadata
- **Status:** `Final.`
- **Category:** Phase 7 — Frontend & UI Architecture
- **Decision Number:** #60
- **Date:** 2026-11-20

---

## Context
Needed a small, prioritized set of principles to arbitrate UI/UX tradeoffs consistently.

## Decision
Four principles, in priority order: (1) evidence-before-conclusion, (2) ≤3-clicks-from-queue-to-decision, (3) calm-not-alarming, (4) dense-but-legible.

## Rationale
A priority order resolves conflicts between principles without re-litigating each tradeoff (e.g., if density and calmness conflict on a given screen, calmness is not ranked above density arbitrarily — the order was fixed in advance precisely to avoid ad hoc re-ranking).

## Alternatives Rejected
An unordered list of principles (leaves every conflict between them unresolved at decision time).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
