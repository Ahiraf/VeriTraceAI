# ADR-0066: API hosting: AWS ECS Fargate

## Metadata
- **Status:** `Final. *(Extended, not replaced, by Decision #72 for GPU workloads — API remains on Fargate; only the Inference Service moves to an EC2 GPU capacity provider in the same cluster.)*`
- **Category:** Phase 8 — Infrastructure, Deployment & Model Hosting
- **Decision Number:** #66
- **Date:** 2026-11-20

---

## Context
Needed a production hosting target for `apps/api` (FastAPI) that didn't require managing raw EC2 instances for the baseline, non-GPU workload.

## Decision
**AWS ECS on Fargate**, ≥2 tasks behind an Application Load Balancer, for the API service.

## Rationale
Fargate removes instance-management overhead for a workload with no GPU requirement; ECS integrates cleanly with the existing AWS account/OIDC trust relationship used elsewhere in the deployment pipeline.

## Alternatives Rejected
Raw EC2 (unnecessary instance-management burden for a stateless container workload); Lambda (poor fit for a persistent ASGI/WebSocket-adjacent SSE-streaming process).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
