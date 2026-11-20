# ADR-0071: Cloudflare Workers rejected as backend/Inference host (revised)

## Metadata
- **Status:** `Final (revised; conclusion unchanged by the background/backend correction, but the reasoning was re-verified against the GPU requirement specifically).`
- **Category:** Phase 8 — Infrastructure, Deployment & Model Hosting
- **Decision Number:** #71
- **Date:** 2026-11-20

---

## Context
The user's "background deploy on Cloudflare Workers" was clarified as a typo for "backend deploy" — raising the question of whether Workers could host the FastAPI backend and/or the GPU Inference Service.

## Decision
**Cloudflare Workers is rejected** as a host for either the FastAPI backend or the GPU Inference Service, under any reading of "background" vs. "backend." Workers' role is unchanged from the pre-existing architecture: frontend hosting (Pages/Workers, #59) plus an optional, later-stage narrow fast-path for a small CPU-only ONNX-exportable sub-model — never the GPU model itself.

## Rationale
The Workers runtime is a stateless, request-scoped V8 isolate with a 128MB hard memory ceiling and a bounded CPU-time budget — structurally incapable of hosting a persistent ASGI process, let alone a GPU-requiring one; Workers CPU execution is WebAssembly-only (no CUDA/WebGPU path exists). Workers AI itself doesn't support arbitrary custom full model weights — only a curated catalog plus a narrow BYO-LoRA path (four base models, 100MB adapter cap, max rank 8) that doesn't fit a general custom-trained model.

## Alternatives Rejected
Attempting to fit the custom model into Workers AI's BYO-LoRA path (too narrow — wrong base models, wrong capability, not a general hosting solution); using Workers purely as a reverse proxy in front of a GPU host elsewhere (adds a hop with no benefit over the frontend calling the Inference Service directly).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
