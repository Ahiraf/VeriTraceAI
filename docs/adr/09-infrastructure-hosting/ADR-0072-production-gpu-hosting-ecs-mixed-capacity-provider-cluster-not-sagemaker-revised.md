# ADR-0072: Production GPU hosting: ECS mixed-capacity-provider cluster, not SageMaker (revised)

## Metadata
- **Status:** `Final (revised from an initial Fargate-only assumption once the GPU requirement was confirmed).`
- **Category:** Phase 8 — Infrastructure, Deployment & Model Hosting
- **Decision Number:** #72
- **Date:** 2026-11-20

---

## Context
AWS was named as the "future" production target. With Fargate (#66) unable to run GPU-backed tasks, needed to decide between extending the existing ECS cluster vs. introducing SageMaker as a new orchestration paradigm for the Inference Service alone.

## Decision
Extend the **existing AWS ECS cluster** using capacity provider strategies: the API continues on Fargate (#66, unchanged) while the Inference Service runs as a second task definition on an **EC2 GPU (`g5`/`g4dn`) capacity provider** within the same cluster — same ALB, same OIDC trust relationship (#67), same container registry pattern.

## Rationale
Fargate does not support GPU-backed tasks on ECS or EKS; ECS does support mixing Fargate and EC2 capacity providers within a single cluster, which lets one container gain GPU capability without introducing a second orchestration paradigm (SageMaker) and its separate deployment/IAM/networking model for a single service.

## Alternatives Rejected
AWS SageMaker (would introduce an entirely separate vendor-paradigm, deployment pipeline, and IAM model to operate for one container — disproportionate for a single additional service when the existing cluster can be extended instead).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
