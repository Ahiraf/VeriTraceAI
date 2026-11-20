# ADR-0004: Build philosophy / standing operating mode

## Metadata
- **Status:** `Final — governs all decisions from #5 onward.

---`
- **Category:** Phase 1 — Vision, Scope & Non-Goals
- **Decision Number:** #4
- **Date:** 2026-11-20

---

## Context
With dozens of implementation forks ahead, a per-fork confirmation loop would be slow and would surface mostly non-judgment-call questions.

## Decision
Resolve all future technical forks via single-best-practice reasoning without per-item confirmation; ask the user only when a genuine non-technical, no-single-defensible-answer judgment call exists. Log every resolution as a numbered decision here.

## Rationale
Keeps forward progress fast while preserving an auditable trail — itself consistent with the product's own evidence-grounded, traceable ethos.

## Alternatives Rejected
Full interactive confirm-everything loop (too slow); fully autonomous no-log mode (not auditable, inconsistent with #1/#2).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
