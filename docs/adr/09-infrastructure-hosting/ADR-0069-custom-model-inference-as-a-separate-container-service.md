# ADR-0069: Custom model inference as a separate container/service

## Metadata
- **Status:** `Final. *(Originally logged provisional-CPU; confirmed GPU-requiring by user correction — see #70.)*`
- **Category:** Phase 8 — Infrastructure, Deployment & Model Hosting
- **Decision Number:** #69
- **Date:** 2026-11-20

---

## Context
The custom-trained model is distinct from the vendor-LLM abstraction (#13's `model_runs` / `LLMClient`) and needed its own architectural seam.

## Decision
A dedicated **Inference Service** container, consumed via `model_runs.model_task_type`, kept fully separate from the `LLMClient` vendor-LLM path.

## Rationale
The custom model has an entirely different runtime profile (GPU-requiring, weight-loading-at-boot) from a vendor LLM API call; conflating the two abstractions would force the simpler `LLMClient` interface to carry GPU/hosting concerns it shouldn't need to know about.

## Alternatives Rejected
Embedding custom-model inference inside the existing API process (couples an entirely different scaling/hardware profile to the stateless API tier).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
