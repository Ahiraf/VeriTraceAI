# ADR-0013: model_runs as the seam between the domain and any AI/ML component

## Metadata
- **Status:** `Final.

---`
- **Category:** Phase 2 — Strategic Design & Bounded Contexts
- **Decision Number:** #13
- **Date:** 2026-11-20

---

## Context
Needed one place to record *every* model invocation (vendor LLM or custom model) against the case/finding/evidence it touched, without coupling the schema to a specific vendor or model type.

## Decision
`model_runs` is an insert-only table keyed by `model_task_type` (e.g., narrative generation, entity resolution, match-confidence scoring), storing inputs/outputs/provenance, referenced by whichever downstream row it informed. Both the vendor-LLM path and the later custom Inference Service (#69) write through this same table.

## Rationale
Keeps the domain schema model-agnostic; every AI-assisted step is auditable and attributable, consistent with #2's "not an autonomous decision-maker."

## Alternatives Rejected
Separate tables per model/vendor (fragments provenance, complicates audit queries).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
