# ADR-0001: Product framing

## Metadata
- **Status:** `Final.`
- **Category:** Phase 1 — Vision, Scope & Non-Goals
- **Decision Number:** #1
- **Date:** 2026-11-20

---

## Context
Needed an unambiguous one-line definition of what VeriTraceAI is, to prevent scope creep toward adjacent fraud/AML products.

## Decision
VeriTraceAI is an **evidence-grounded AI copilot for KYB/UBO compliance investigation** — it helps a human investigator determine whether declared company ownership is independently corroborated, surfaces conflicts, and recommends the next human step.

## Rationale
A narrow, defensible framing lets every subsequent architectural choice be tested against "does this serve evidence-grounded investigation, or does it drift toward autonomous decisioning."

## Alternatives Rejected
General-purpose AML fraud detection platform (too broad, regulatorily heavier); single composite risk-score product (conflicts with #2).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
