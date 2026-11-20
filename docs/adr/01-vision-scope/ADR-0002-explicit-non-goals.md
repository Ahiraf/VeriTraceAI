# ADR-0002: Explicit non-goals

## Metadata
- **Status:** `Final.`
- **Category:** Phase 1 — Vision, Scope & Non-Goals
- **Decision Number:** #2
- **Date:** 2026-11-20

---

## Context
"AI compliance tool" is a label broad enough to accidentally justify almost any feature.

## Decision
VeriTraceAI is explicitly **not** a fraud detector, **not** a single risk score generator, and **not** an autonomous decision-maker. Every finding must trace to underlying evidence; every case terminates in a human decision, never a system-issued verdict.

## Rationale
These three non-goals are structurally enforced (not just policy) throughout the data model — e.g., `case_decisions` is insert-only and always has a human `decided_by`; there is no "risk_score" column anywhere in the schema.

## Alternatives Rejected
Adding an optional composite score "for convenience" — rejected because it re-introduces the exact ambiguity the product exists to avoid.

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
