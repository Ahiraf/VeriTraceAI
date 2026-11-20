# ADR-0067: CI/CD: GitHub Actions, 3 Environments, OIDC (no long-lived cloud credentials)

## Metadata
- **Status:** `Final.`
- **Category:** Phase 8 — Infrastructure, Deployment & Model Hosting
- **Decision Number:** #67
- **Date:** 2026-11-20

---

## Context
Needed a CI/CD pipeline and deployment credential strategy.

## Decision
GitHub Actions workflows gated by three GitHub Environments (e.g., development/staging/production), deploying to AWS via **OIDC federation** (no long-lived AWS access keys stored as GitHub secrets).

## Rationale
OIDC federation eliminates the risk and rotation burden of long-lived cloud credentials sitting in CI secrets; environment gating allows required-reviewer protection on production deploys.

## Alternatives Rejected
Long-lived IAM access keys as GitHub secrets (standing credential-leak risk, manual rotation burden).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
