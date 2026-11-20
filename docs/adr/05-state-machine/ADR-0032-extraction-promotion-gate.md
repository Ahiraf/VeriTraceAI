# ADR-0032: Extraction promotion gate

## Metadata
- **Status:** `Final.`
- **Category:** Phase 4 — State Machine & Lifecycle
- **Decision Number:** #32
- **Date:** 2026-11-20

---

## Context
Extracted fields are machine output and should not silently become "evidence" without a deliberate step.

## Decision
`extracted_fields` rows are insert-only and carry a nullable `promoted_to_evidence_id`; only an explicit promotion action (human-reviewed or rule-gated) sets this FK, at which point a corresponding `evidence` row exists.

## Rationale
Keeps the "evidence" concept trustworthy — every evidence row backed by extraction has a traceable, deliberate promotion step, not an automatic pass-through.

## Alternatives Rejected
Auto-promoting all extracted fields directly to evidence (undermines the evidence-trustworthiness guarantee the whole product is built on).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
