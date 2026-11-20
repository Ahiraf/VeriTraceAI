# ADR-0061: Color semantics: amber for findings, not red

## Metadata
- **Status:** `Final. *(All palette tokens WCAG 2.1 AA contrast-verified in both light and dark themes.)*`
- **Category:** Phase 7 — Frontend & UI Architecture
- **Decision Number:** #61
- **Date:** 2026-11-20

---

## Context
Needed to decide how to visually signal a "finding" (something worth a human look) without implying an automated risk verdict.

## Decision
`--finding-indicator` uses a deliberately **amber**, not red, hue (`#B45309` light / `#D89B4A` dark); a separate, more muted `--escalated` brick tone is reserved for case-level escalation only, also deliberately not pure red.

## Rationale
Red is conventionally "alarm/danger/automated-verdict" — using it for findings would contradict #2's non-goal of implying an automated risk judgment. Amber signals "needs attention" without that implication.

## Alternatives Rejected
Standard red/green risk-indicator convention (directly undermines the product's core framing as a non-scoring, evidence-presenting tool).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
