# ADR-0059: Hosting: Cloudflare Pages + Workers

## Metadata
- **Status:** `Final (Workers' role narrowed by #71).`
- **Category:** Phase 7 — Frontend & UI Architecture
- **Decision Number:** #59
- **Date:** 2026-11-20

---

## Context
Needed a frontend hosting target consistent with the rest of the Cloudflare-based edge strategy (R2 for storage).

## Decision
**Cloudflare Pages** for the Next.js app's static/SSR hosting, with **Cloudflare Workers** providing edge functions where needed (e.g., auth redirects, lightweight middleware) — and, per Decision #71, an optional later-stage narrow fast-path for a small CPU-only ONNX sub-model, never the GPU Inference Service itself.

## Rationale
Keeps frontend hosting on the same edge network as object storage (R2), minimizing cross-provider latency for asset delivery; Workers' edge-function model fits lightweight middleware well.

## Alternatives Rejected
Vercel (viable alternative, but duplicates infrastructure providers unnecessarily alongside the already-chosen Cloudflare R2/Workers stack).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
