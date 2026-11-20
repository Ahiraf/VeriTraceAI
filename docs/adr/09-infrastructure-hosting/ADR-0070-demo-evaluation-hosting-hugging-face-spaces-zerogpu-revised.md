# ADR-0070: Demo/evaluation hosting: Hugging Face Spaces + ZeroGPU (revised)

## Metadata
- **Status:** `Final (revised from an earlier CPU-only provisional form of this decision).`
- **Category:** Phase 8 — Infrastructure, Deployment & Model Hosting
- **Decision Number:** #70
- **Date:** 2026-11-20

---

## Context
The user's original proposal was Render's free tier for the model weights and agents. After confirming the model is GPU-requiring, Render's free/Hobby tier was re-evaluated and found non-viable in any form.

## Decision
**Render free tier is rejected entirely** for the Inference Service. Replacement for demo/evaluation hosting: **Hugging Face Spaces with ZeroGPU** — free, GPU-backed per-call allocation, reachable as an HTTP API, with up to two free ZeroGPU Spaces available per account.

## Rationale
Render's free web-service instance is 512MB RAM / 0.1 CPU with no GPU variant in any free/Hobby tier, no background-worker instance type at all, a non-persistent filesystem, and Render's own Terms of Service state free instances should not be used for production. HF Spaces' ZeroGPU directly solves the "need an actual GPU, for free, reachable over HTTP" requirement that Render structurally cannot.

## Alternatives Rejected
Render free tier in any configuration (no GPU tier exists even before the correction's impact; post-correction it is even less viable); a paid Render GPU-capable tier (reintroduces cost the user's proposal was explicitly trying to avoid at the demo stage).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
